import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  pendingNFCe,
  nfceValidationLog,
  point_transactions,
  user_store_balances,
  store_settings,
} from "@/lib/db/schema";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";
// import { resend } from "@/lib/resend";

// Schema de validação para NFC-e (removido pontosAtribuidos)
const validateNFCeSchema = z.object({
  nfceId: z.string().uuid("ID da NFC-e inválido"),
  action: z.enum(["approve", "reject"]),
  valorTotal: z
    .number()
    .min(0.01, "Valor total deve ser maior que zero")
    .optional(),
  dataEmissao: z.string().optional(),
  estabelecimento: z.string().optional(),
  cnpj: z.string().optional(),
  observacoes: z.string().optional(),
});

// Função para calcular pontos automaticamente baseado nas configurações da loja
async function calculatePointsForStore(
  storeId: string,
  valorTotal: number
): Promise<{
  points: number;
  config: {
    pointsPerCurrency: number;
    minValue: number;
    validityDays: number;
  };
}> {
  // Buscar configurações da loja
  const storeConfig = await db.query.store_settings.findFirst({
    where: (settings, { eq }) => eq(settings.store_id, storeId),
  });

  if (!storeConfig) {
    // Configurações padrão se não existirem
    return {
      points: Math.floor(valorTotal),
      config: {
        pointsPerCurrency: 1,
        minValue: 0,
        validityDays: 365,
      },
    };
  }

  const pointsPerCurrency = Number(storeConfig.points_per_currency_unit) || 1;
  const minValue = Number(storeConfig.min_purchase_value_to_award) || 0;
  const validityDays = storeConfig.points_validity_days || 365;

  // Verificar se o valor mínimo foi atingido
  if (valorTotal < minValue) {
    return {
      points: 0,
      config: { pointsPerCurrency, minValue, validityDays },
    };
  }

  // Calcular pontos: valor * pontos por unidade monetária
  const points = Math.floor(valorTotal * pointsPerCurrency);

  return {
    points,
    config: { pointsPerCurrency, minValue, validityDays },
  };
}

export async function POST(request: NextRequest) {
  try {
    // Verificar se é admin do sistema
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Acesso negado - apenas administradores" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = validateNFCeSchema.parse(body);

    // Buscar NFC-e
    const nfce = await db.query.pendingNFCe.findFirst({
      where: (pendingNFCe, { eq }) => eq(pendingNFCe.id, validatedData.nfceId),
      with: {
        user: true,
        store: true,
      },
    });

    if (!nfce) {
      return NextResponse.json(
        { error: "NFC-e não encontrada" },
        { status: 404 }
      );
    }

    if (nfce.status !== "pending") {
      return NextResponse.json(
        { error: "NFC-e já foi processada" },
        { status: 400 }
      );
    }

    // Atualizar status da NFC-e
    const updateData: any = {
      status: validatedData.action === "approve" ? "approved" : "rejected",
      validadoPor: session.user.id,
      validadoEm: new Date(),
      updatedAt: new Date(),
    };

    // Se for aprovação, adicionar dados validados
    if (validatedData.action === "approve") {
      if (validatedData.valorTotal) {
        updateData.valorTotal = validatedData.valorTotal;

        // Calcular pontos automaticamente baseado nas configurações da loja
        const pointsCalculation = await calculatePointsForStore(
          nfce.storeId,
          validatedData.valorTotal
        );

        updateData.pontosAtribuidos = pointsCalculation.points;

        console.log("🔢 ADMIN: Cálculo automático de pontos:", {
          valorTotal: validatedData.valorTotal,
          pontosCalculados: pointsCalculation.points,
          configuracao: pointsCalculation.config,
        });
      }

      if (validatedData.dataEmissao)
        updateData.dataEmissao = validatedData.dataEmissao;
      if (validatedData.estabelecimento)
        updateData.estabelecimento = validatedData.estabelecimento;
      if (validatedData.cnpj) updateData.cnpj = validatedData.cnpj;
    }

    if (validatedData.observacoes) {
      updateData.observacoes = validatedData.observacoes;
    }

    // Atualizar NFC-e
    await db
      .update(pendingNFCe)
      .set(updateData)
      .where(eq(pendingNFCe.id, validatedData.nfceId));

    // Registrar log da validação
    await db.insert(nfceValidationLog).values({
      nfceId: validatedData.nfceId,
      action: validatedData.action === "approve" ? "approved" : "rejected",
      userId: session.user.id,
      details: JSON.stringify({
        valorTotal: validatedData.valorTotal,
        pontosAtribuidos: updateData.pontosAtribuidos,
        observacoes: validatedData.observacoes,
        calculoAutomatico: true,
      }),
    });

    // Se aprovada, atribuir pontos automaticamente
    if (validatedData.action === "approve" && updateData.pontosAtribuidos > 0) {
      // Validar se o CNPJ da nota corresponde ao da loja (se ambos estiverem disponíveis)
      if (validatedData.cnpj && nfce.store?.cnpj) {
        const cnpjNota = validatedData.cnpj.replace(/\D/g, "");
        const cnpjLoja = nfce.store.cnpj.replace(/\D/g, "");

        if (cnpjNota !== cnpjLoja) {
          console.log("❌ CNPJ da nota não corresponde ao da loja:", {
            cnpjNota: validatedData.cnpj,
            cnpjLoja: nfce.store.cnpj,
          });
          return NextResponse.json(
            {
              error:
                "CNPJ da nota não corresponde ao CNPJ da loja. Verifique os dados antes de aprovar.",
              cnpjMismatch: true,
              cnpjNota: validatedData.cnpj,
              cnpjLoja: nfce.store.cnpj,
            },
            { status: 400 }
          );
        }
        console.log("✅ CNPJ da nota corresponde ao da loja");
      }

      // Criar transação de pontos
      await db.insert(point_transactions).values({
        user_id: nfce.userId,
        store_id: nfce.storeId,
        type: "award",
        amount: updateData.pontosAtribuidos,
        reference: `NFC-e ${nfce.chaveAcesso}`,
        metadata: {
          nfceId: nfce.id,
          valorTotal: validatedData.valorTotal,
          estabelecimento: validatedData.estabelecimento,
          calculoAutomatico: true,
          configuracaoLoja: await calculatePointsForStore(
            nfce.storeId,
            validatedData.valorTotal || 0
          ),
        },
        created_at: new Date(),
      });

      // Atualizar saldo do usuário na loja
      const existingBalance = await db.query.user_store_balances.findFirst({
        where: (balances, { and, eq }) =>
          and(
            eq(balances.user_id, nfce.userId),
            eq(balances.store_id, nfce.storeId)
          ),
      });

      if (existingBalance) {
        await db
          .update(user_store_balances)
          .set({
            points: sql`${user_store_balances.points} + ${updateData.pontosAtribuidos}`,
            updated_at: new Date(),
          })
          .where(eq(user_store_balances.id, existingBalance.id));
      } else {
        await db.insert(user_store_balances).values({
          user_id: nfce.userId,
          store_id: nfce.storeId,
          points: updateData.pontosAtribuidos,
          reserved_points: 0,
          updated_at: new Date(),
        });
      }

      console.log("✅ ADMIN: Pontos atribuídos automaticamente:", {
        userId: nfce.userId,
        storeId: nfce.storeId,
        pontos: updateData.pontosAtribuidos,
        valorTotal: validatedData.valorTotal,
      });

      // Enviar email de confirmação (comentado por enquanto)
      try {
        // await resend.emails.send({
        //   from: "noreply@seudominio.com",
        //   to: nfce.user?.email || "",
        //   subject: "✅ Sua nota fiscal foi aprovada!",
        //   html: `
        //     <h2>🎉 Nota Fiscal Aprovada!</h2>
        //     <p>Olá ${nfce.user?.name || "Cliente"},</p>
        //     <p>Sua nota fiscal foi aprovada e <strong>${updateData.pontosAtribuidos} pontos</strong> foram creditados automaticamente em sua conta!</p>
        //     <h3>📋 Detalhes da Nota:</h3>
        //     <ul>
        //       <li><strong>Chave de Acesso:</strong> ${nfce.chaveAcesso}</li>
        //       <li><strong>Estabelecimento:</strong> ${validatedData.estabelecimento || "Não informado"}</li>
        //       <li><strong>Valor Total:</strong> R$ ${validatedData.valorTotal?.toFixed(2) || "Não informado"}</li>
        //       <li><strong>Pontos Ganhos:</strong> ${updateData.pontosAtribuidos} (calculados automaticamente)</li>
        //     </ul>
        //   `,
        // });
      } catch (emailError) {
        console.error("❌ Erro ao enviar email:", emailError);
      }
    }

    return NextResponse.json({
      success: true,
      message:
        validatedData.action === "approve"
          ? `NFC-e aprovada! ${
              updateData.pontosAtribuidos || 0
            } pontos foram atribuídos automaticamente.`
          : "NFC-e rejeitada com sucesso.",
      data: {
        nfceId: validatedData.nfceId,
        action: validatedData.action,
        pontosAtribuidos: updateData.pontosAtribuidos || 0,
        calculoAutomatico: true,
      },
    });
  } catch (error) {
    console.error("❌ Erro ao validar NFC-e:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Dados inválidos",
          message: "Dados inválidos fornecidos",
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Erro interno do servidor",
        message: "Erro interno do servidor",
      },
      { status: 500 }
    );
  }
}
