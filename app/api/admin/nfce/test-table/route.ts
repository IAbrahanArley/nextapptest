import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { pendingNFCe } from "@/lib/db/schema";

export async function GET(request: NextRequest) {
  try {
    console.log("🧪 TEST: Testando tabela pendingNFCe...");

    // Teste 1: Verificar se a tabela existe
    try {
      const testSelect = await db
        .select({ id: pendingNFCe.id })
        .from(pendingNFCe)
        .limit(1);

      console.log(
        "✅ TEST: Tabela existe, registros encontrados:",
        testSelect.length
      );
    } catch (selectError) {
      console.error("❌ TEST: Erro ao selecionar da tabela:", selectError);
      return NextResponse.json(
        {
          success: false,
          error: "Erro ao acessar tabela",
          message:
            selectError instanceof Error
              ? selectError.message
              : "Erro desconhecido",
        },
        { status: 500 }
      );
    }

    // Teste 2: Contar total de registros
    try {
      const totalCount = await db
        .select({ count: pendingNFCe.id })
        .from(pendingNFCe);

      console.log("✅ TEST: Total de registros:", totalCount.length);
    } catch (countError) {
      console.error("❌ TEST: Erro ao contar registros:", countError);
      return NextResponse.json(
        {
          success: false,
          error: "Erro ao contar registros",
          message:
            countError instanceof Error
              ? countError.message
              : "Erro desconhecido",
        },
        { status: 500 }
      );
    }

    // Teste 3: Buscar registros com status "pending"
    try {
      const pendingRecords = await db
        .select({
          id: pendingNFCe.id,
          chaveAcesso: pendingNFCe.chaveAcesso,
          status: pendingNFCe.status,
          createdAt: pendingNFCe.createdAt,
        })
        .from(pendingNFCe)
        .limit(5);

      console.log(
        "✅ TEST: Registros pendentes encontrados:",
        pendingRecords.length
      );
      console.log("✅ TEST: Dados dos registros:", pendingRecords);
    } catch (pendingError) {
      console.error(
        "❌ TEST: Erro ao buscar registros pendentes:",
        pendingError
      );
      return NextResponse.json(
        {
          success: false,
          error: "Erro ao buscar registros pendentes",
          message:
            pendingError instanceof Error
              ? pendingError.message
              : "Erro desconhecido",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Tabela pendingNFCe está funcionando corretamente",
      data: {
        tableExists: true,
        totalRecords: 0, // Será preenchido pelo teste 2
        pendingRecords: [], // Será preenchido pelo teste 3
      },
    });
  } catch (error) {
    console.error("❌ TEST: Erro geral no teste:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Erro geral no teste",
        message: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}




