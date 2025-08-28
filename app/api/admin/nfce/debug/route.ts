import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { pendingNFCe, users, stores } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 DEBUG: Verificando tabela pendingNFCe...");

    // 1. Verificar se a tabela existe e contar registros
    const totalCount = await db
      .select({ count: pendingNFCe.id })
      .from(pendingNFCe);

    console.log("🔍 DEBUG: Total de registros na tabela:", totalCount.length);

    // 2. Buscar todos os registros (limitado a 10 para debug)
    const allNFCe = await db
      .select({
        id: pendingNFCe.id,
        chaveAcesso: pendingNFCe.chaveAcesso,
        estado: pendingNFCe.estado,
        status: pendingNFCe.status,
        cnpj: pendingNFCe.cnpj,
        userId: pendingNFCe.userId,
        storeId: pendingNFCe.storeId,
        createdAt: pendingNFCe.createdAt,
        updatedAt: pendingNFCe.updatedAt,
      })
      .from(pendingNFCe)
      .orderBy(desc(pendingNFCe.createdAt))
      .limit(10);

    console.log("🔍 DEBUG: Registros encontrados:", allNFCe);

    // 3. Verificar se há registros com status "pending"
    const pendingCount = await db
      .select({ count: pendingNFCe.id })
      .from(pendingNFCe)
      .where(eq(pendingNFCe.status, "pending"));

    console.log("🔍 DEBUG: Registros pendentes:", pendingCount.length);

    // 4. Verificar estrutura da tabela (primeiro registro)
    let tableStructure = null;
    if (allNFCe.length > 0) {
      tableStructure = {
        fields: Object.keys(allNFCe[0]),
        sampleRecord: allNFCe[0],
      };
    }

    // 5. Verificar se há problemas com as relações
    let relationTest = null;
    if (allNFCe.length > 0) {
      const firstNFCe = allNFCe[0];

      try {
        // Testar relação com usuário
        const user = await db.query.users.findFirst({
          where: (users, { eq }) => eq(users.id, firstNFCe.userId),
        });

        // Testar relação com loja
        const store = await db.query.stores.findFirst({
          where: (stores, { eq }) => eq(stores.id, firstNFCe.storeId),
        });

        relationTest = {
          userFound: !!user,
          storeFound: !!store,
          userData: user
            ? { id: user.id, name: user.name, email: user.email }
            : null,
          storeData: store
            ? { id: store.id, name: store.name, cnpj: store.cnpj }
            : null,
        };
      } catch (relationError) {
        relationTest = { error: relationError.message };
      }
    }

    const debugInfo = {
      success: true,
      message: "Debug da tabela pendingNFCe",
      data: {
        totalRecords: totalCount.length,
        pendingRecords: pendingCount.length,
        tableStructure,
        relationTest,
        recentRecords: allNFCe,
      },
    };

    console.log("🔍 DEBUG: Informações de debug:", debugInfo);
    return NextResponse.json(debugInfo);
  } catch (error) {
    console.error("❌ DEBUG: Erro ao verificar tabela:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Erro ao verificar tabela",
        message: error instanceof Error ? error.message : "Erro desconhecido",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
