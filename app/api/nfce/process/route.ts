import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { pendingNFCe } from "@/lib/db/schema";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

// Schema simplificado - apenas URL da SEFAZ
const nfceSchema = z.object({
  sefazUrl: z.string().url("URL da SEFAZ inválida"),
});

export async function POST(request: NextRequest) {
  try {
    console.log("=== 🚀 INÍCIO DA REQUISIÇÃO NFC-e ===");

    const body = await request.json();
    console.log("API: 📦 Body recebido:", JSON.stringify(body, null, 2));

    // Validar dados de entrada
    let validatedData;
    try {
      validatedData = nfceSchema.parse(body);
      console.log("API: ✅ Dados validados:", validatedData);
    } catch (validationError) {
      console.log("API: ❌ Erro de validação:", validationError);
      return NextResponse.json(
        {
          success: false,
          error: "URL da SEFAZ inválida",
          message: "URL da SEFAZ inválida",
        },
        { status: 400 }
      );
    }

    // Verificar autenticação do usuário
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      console.log("API: ❌ Usuário não autenticado");
      return NextResponse.json(
        {
          success: false,
          error: "Usuário não autenticado",
          message: "Usuário não autenticado",
        },
        { status: 401 }
      );
    }

    console.log("API: 👤 Usuário autenticado:", session.user.email);

    // Extrair CNPJ da nota fiscal
    console.log("API: 🔍 Extraindo CNPJ da nota fiscal...");

    const sefazUrl = new URL(validatedData.sefazUrl);
    const params = sefazUrl.searchParams.get("p");

    if (!params) {
      console.log("API: ❌ Parâmetro 'p' não encontrado na URL");
      return NextResponse.json(
        {
          success: false,
          error: "URL da SEFAZ inválida - parâmetro 'p' não encontrado",
          message: "URL da SEFAZ inválida",
        },
        { status: 400 }
      );
    }

    const parts = params.split("|");
    if (parts.length < 5) {
      console.log("API: ❌ Formato do parâmetro 'p' inválido");
      return NextResponse.json(
        {
          success: false,
          error: "Formato da URL da SEFAZ inválido",
          message: "Formato da nota fiscal inválido",
        },
        { status: 400 }
      );
    }

    const chaveAcesso = parts[0];
    const estado = parts[1];
    const ano = parts[2];
    const mes = parts[3];
    const hash = parts[4];

    console.log("API: 🔑 Dados extraídos da URL:", {
      chaveAcesso,
      estado,
      ano,
      mes,
      hash,
    });

    // Extrair CNPJ da chave de acesso
    let cnpjFromChave = null;
    if (chaveAcesso.length >= 44) {
      const cnpjDigits = chaveAcesso.substring(6, 20);
      if (cnpjDigits.match(/^\d{14}$/)) {
        cnpjFromChave = `${cnpjDigits.substring(0, 2)}.${cnpjDigits.substring(
          2,
          5
        )}.${cnpjDigits.substring(5, 8)}/${cnpjDigits.substring(
          8,
          12
        )}-${cnpjDigits.substring(12, 14)}`;
        console.log("API: 🔍 CNPJ extraído da nota fiscal:", cnpjFromChave);
      }
    }

    if (!cnpjFromChave) {
      console.log("API: ❌ Não foi possível extrair CNPJ da nota fiscal");
      return NextResponse.json(
        {
          success: false,
          error: "Não foi possível extrair CNPJ da nota fiscal",
          message: "Formato da nota fiscal inválido",
        },
        { status: 400 }
      );
    }

    // Buscar loja pelo CNPJ da nota fiscal
    console.log(
      "API: 🔍 Buscando loja pelo CNPJ da nota fiscal:",
      cnpjFromChave
    );

    const store = await db.query.stores.findFirst({
      where: (stores, { eq }) => eq(stores.cnpj, cnpjFromChave),
    });

    if (!store) {
      console.log("API: ❌ Loja não encontrada com o CNPJ da nota fiscal");
      return NextResponse.json(
        {
          success: false,
          error: "Esta loja não está cadastrada no sistema",
          message: "Esta loja não está cadastrada no sistema",
          notRegistered: true,
          cnpj: cnpjFromChave,
        },
        { status: 404 }
      );
    }

    console.log("API: ✅ Loja encontrada:", store.name);

    // Verificar se a nota já foi processada
    const existingNFCe = await db.query.pendingNFCe.findFirst({
      where: (pendingNFCe, { eq }) => eq(pendingNFCe.chaveAcesso, chaveAcesso),
    });

    if (existingNFCe) {
      console.log("API: ❌ NFC-e já foi processada anteriormente");
      return NextResponse.json(
        {
          success: false,
          error: "Esta nota fiscal já foi processada anteriormente",
          message: "Esta nota fiscal já foi processada anteriormente",
          alreadyProcessed: true,
          nfceId: existingNFCe.id,
        },
        { status: 409 }
      );
    }

    // Criar registro de NFC-e pendente para validação do admin
    console.log("API: 🔧 Dados para inserção:", {
      userId: session.user.id,
      storeId: store.id,
      chaveAcesso,
      estado,
      sefazUrl: validatedData.sefazUrl,
      status: "pending",
      cnpj: cnpjFromChave,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    try {
      const newPendingNFCe = await db
        .insert(pendingNFCe)
        .values({
          userId: session.user.id,
          storeId: store.id,
          chaveAcesso,
          estado,
          sefazUrl: validatedData.sefazUrl,
          status: "pending",
          cnpj: cnpjFromChave,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      console.log("API: ✅ NFC-e pendente criada:", newPendingNFCe[0].id);
      console.log("API: 🔍 Dados retornados:", newPendingNFCe[0]);
    } catch (insertError) {
      console.error("API: ❌ Erro na inserção:", insertError);
      throw insertError;
    }

    // Retornar sucesso - nota enviada para validação
    const response = {
      success: true,
      message:
        "Nota fiscal enviada com sucesso! Ela será validada por nossa equipe em breve.",
      nfceId: newPendingNFCe[0].id,
      status: "pending",
      storeName: store.name,
      estimatedTime: "2-4 horas úteis",
    };

    console.log("API: ✅ Resposta de sucesso:", response);
    console.log("=== 🏁 FIM DA REQUISIÇÃO NFC-e ===");

    return NextResponse.json(response);
  } catch (error) {
    console.error("=== ❌ ERRO NA REQUISIÇÃO NFC-e ===");
    console.error("API: Erro:", error);

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
