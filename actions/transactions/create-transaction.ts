"use server";

import { db } from "@/lib/db";
import { createTransactionSchema } from "./schema";
import {
  point_transactions,
  pending_points,
  users,
  store_settings,
  stores,
  user_store_balances,
} from "@/lib/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { getStoreId } from "../store-config/get-store-id";
import { setupDefaultStoreSettings } from "../store-config/setup-default-settings";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendPointsAttributionEmail } from "@/lib/email";

// Função para atualizar saldos automaticamente
async function updateUserStoreBalance(
  userId: string,
  storeId: string,
  pointsToAdd: number
) {
  try {
    // Verificar se já existe saldo para esta loja
    const existingBalance = await db
      .select()
      .from(user_store_balances)
      .where(
        and(
          eq(user_store_balances.user_id, userId),
          eq(user_store_balances.store_id, storeId)
        )
      )
      .limit(1);

    if (existingBalance.length > 0) {
      // Atualizar saldo existente
      await db
        .update(user_store_balances)
        .set({
          points: sql`${user_store_balances.points} + ${pointsToAdd}`,
          updated_at: new Date(),
        })
        .where(
          and(
            eq(user_store_balances.user_id, userId),
            eq(user_store_balances.store_id, storeId)
          )
        );
    } else {
      // Criar novo saldo
      await db.insert(user_store_balances).values({
        user_id: userId,
        store_id: storeId,
        points: pointsToAdd,
        reserved_points: 0,
      });
    }

    console.log(
      `✅ [TRANSACAO] Saldo atualizado: +${pointsToAdd} pontos para usuário ${userId} na loja ${storeId}`
    );
  } catch (error) {
    console.error(
      `❌ [TRANSACAO] Erro ao atualizar saldo para usuário ${userId} na loja ${storeId}:`,
      error
    );
  }
}

export async function createTransaction(
  input: typeof createTransactionSchema._type
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new Error("Usuário não autenticado");
    }

    const storeIdResult = await getStoreId({ userId: session.user.id });
    if (!storeIdResult?.success || !storeIdResult?.data?.storeId) {
      throw new Error("Loja não encontrada");
    }

    const storeId = storeIdResult.data.storeId;
    const validatedData = createTransactionSchema.parse(input);

    // Garantir que a loja tenha configurações
    await setupDefaultStoreSettings(storeId);

    // Buscar as configurações da loja
    const storeSettings = await db
      .select()
      .from(store_settings)
      .where(eq(store_settings.store_id, storeId))
      .limit(1);

    if (!storeSettings.length) {
      throw new Error("Erro ao configurar configurações da loja");
    }

    const settings = storeSettings[0];
    const pointsToAward = Math.floor(
      Number(validatedData.valor) * Number(settings.points_per_currency_unit)
    );

    if (validatedData.clienteId) {
      // Buscar informações do cliente e da loja para o email
      const [clientInfo] = await db
        .select({
          name: users.name,
          email: users.email,
        })
        .from(users)
        .where(eq(users.id, validatedData.clienteId))
        .limit(1);

      const [storeInfo] = await db
        .select({
          name: stores.name,
        })
        .from(stores)
        .where(eq(stores.id, storeId))
        .limit(1);

      // Criar a transação
      await db.insert(point_transactions).values({
        user_id: validatedData.clienteId,
        store_id: storeId,
        type: "award",
        amount: pointsToAward,
        reference: validatedData.descricao || "Compra",
        metadata: {
          purchaseValue: validatedData.valor,
          pointsPerCurrency: Number(settings.points_per_currency_unit),
        },
      });

      // Atualizar saldo automaticamente
      await updateUserStoreBalance(
        validatedData.clienteId,
        storeId,
        pointsToAward
      );

      // Enviar email se o cliente tiver email
      if (clientInfo?.email && clientInfo?.name && storeInfo?.name) {
        try {
          console.log(
            "🔧 [TRANSACAO] Enviando email de atribuição de pontos..."
          );
          const emailResult = await sendPointsAttributionEmail(
            clientInfo.email,
            clientInfo.name,
            pointsToAward,
            storeInfo.name,
            validatedData.descricao || "Compra"
          );
          console.log("🔧 [TRANSACAO] Resultado do email:", emailResult);
        } catch (emailError) {
          console.error(
            "❌ [TRANSACAO] Erro ao enviar email de atribuição de pontos:",
            emailError
          );
          // Não falhar a transação se o email falhar
        }
      } else {
        console.log(
          "🔧 [TRANSACAO] Cliente sem email ou informações incompletas, email não enviado"
        );
      }
    } else if (validatedData.cpf) {
      // Verificar se já existe usuário com este CPF
      const existingUser = await db
        .select({ id: users.id, name: users.name, email: users.email })
        .from(users)
        .where(eq(users.cpf, validatedData.cpf))
        .limit(1);

      if (existingUser.length > 0) {
        // Usuário já existe, criar transação direta
        console.log(
          `🔧 [TRANSACAO] Usuário com CPF ${validatedData.cpf} já existe, criando transação direta`
        );

        await db.insert(point_transactions).values({
          user_id: existingUser[0].id,
          store_id: storeId,
          type: "award",
          amount: pointsToAward,
          reference: validatedData.descricao || "Compra",
          metadata: {
            purchaseValue: validatedData.valor,
            pointsPerCurrency: Number(settings.points_per_currency_unit),
            attributedByCpf: true,
            originalCpf: validatedData.cpf,
          },
        });

        // Atualizar saldo automaticamente
        await updateUserStoreBalance(
          existingUser[0].id,
          storeId,
          pointsToAward
        );

        // Buscar informações da loja para o email
        const [storeInfo] = await db
          .select({
            name: stores.name,
          })
          .from(stores)
          .where(eq(stores.id, storeId))
          .limit(1);

        // Enviar email se o usuário tiver email
        if (existingUser[0].email && existingUser[0].name && storeInfo?.name) {
          try {
            console.log(
              "🔧 [TRANSACAO] Enviando email de atribuição de pontos por CPF..."
            );
            const emailResult = await sendPointsAttributionEmail(
              existingUser[0].email,
              existingUser[0].name,
              pointsToAward,
              storeInfo.name,
              validatedData.descricao || "Compra"
            );
            console.log("🔧 [TRANSACAO] Resultado do email:", emailResult);
          } catch (emailError) {
            console.error(
              "❌ [TRANSACAO] Erro ao enviar email de atribuição de pontos por CPF:",
              emailError
            );
            // Não falhar a transação se o email falhar
          }
        }
      } else {
        // Usuário não existe, salvar em pending_points
        console.log(
          `🔧 [TRANSACAO] Usuário com CPF ${validatedData.cpf} não existe, salvando em pending_points`
        );

        await db.insert(pending_points).values({
          cpf: validatedData.cpf,
          store_id: storeId,
          amount: pointsToAward,
          metadata: {
            purchaseValue: validatedData.valor,
            pointsPerCurrency: Number(settings.points_per_currency_unit),
            description: validatedData.descricao || "Compra",
          },
        });
      }
    } else {
      throw new Error("Cliente ID ou CPF deve ser fornecido");
    }

    return { success: true, pointsAwarded: pointsToAward };
  } catch (error) {
    console.error("Erro ao criar transação:", error);
    throw new Error("Erro interno ao criar transação");
  }
}
