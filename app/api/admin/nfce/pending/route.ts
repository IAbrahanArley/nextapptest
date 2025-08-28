import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { pendingNFCe, users, stores } from "@/lib/db/schema";
import { eq, desc, and, sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 ADMIN: Iniciando busca de NFC-e pendentes...");

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const storeId = searchParams.get("storeId");

    console.log("🔍 ADMIN: Parâmetros recebidos:", {
      page,
      limit,
      status,
      search,
      storeId,
    });

    const offset = (page - 1) * limit;

    // Construir filtros
    let whereConditions = [];

    if (status && status !== "all") {
      whereConditions.push(eq(pendingNFCe.status, status as any));
      console.log("🔍 ADMIN: Filtro de status aplicado:", status);
    }

    if (storeId && storeId !== "all") {
      whereConditions.push(eq(pendingNFCe.storeId, storeId));
      console.log("🔍 ADMIN: Filtro de loja aplicado:", storeId);
    }

    if (search) {
      whereConditions.push(
        sql`(${pendingNFCe.chaveAcesso} ILIKE ${`%${search}%`} OR 
             ${pendingNFCe.estabelecimento} ILIKE ${`%${search}%`} OR
             ${pendingNFCe.cnpj} ILIKE ${`%${search}%`})`
      );
      console.log("🔍 ADMIN: Filtro de busca aplicado:", search);
    }

    const whereClause =
      whereConditions.length > 0 ? and(...whereConditions) : undefined;

    console.log("🔍 ADMIN: Condições WHERE:", whereConditions);

    // Primeiro, vamos tentar uma query simples para ver se a tabela existe
    console.log("🔍 ADMIN: Testando query simples...");

    try {
      const testQuery = await db
        .select({ id: pendingNFCe.id })
        .from(pendingNFCe)
        .limit(1);

      console.log(
        "🔍 ADMIN: Query simples funcionou, registros encontrados:",
        testQuery.length
      );
    } catch (testError) {
      console.error("❌ ADMIN: Erro na query simples:", testError);
      throw testError;
    }

    // Buscar NFC-e pendentes com informações relacionadas
    console.log("🔍 ADMIN: Executando query principal...");

    const pendingNFCeList = await db
      .select({
        id: pendingNFCe.id,
        chaveAcesso: pendingNFCe.chaveAcesso,
        estado: pendingNFCe.estado,
        sefazUrl: pendingNFCe.sefazUrl,
        status: pendingNFCe.status,
        valorTotal: pendingNFCe.valorTotal,
        dataEmissao: pendingNFCe.dataEmissao,
        estabelecimento: pendingNFCe.estabelecimento,
        cnpj: pendingNFCe.cnpj,
        pontosAtribuidos: pendingNFCe.pontosAtribuidos,
        observacoes: pendingNFCe.observacoes,
        validadoPor: pendingNFCe.validadoPor,
        validadoEm: pendingNFCe.validadoEm,
        createdAt: pendingNFCe.createdAt,
        updatedAt: pendingNFCe.updatedAt,
        // Informações do usuário
        userName: users.name,
        userEmail: users.email,
        userCpf: users.cpf,
        // Informações da loja
        storeName: stores.name,
        storeCnpj: stores.cnpj,
        storeId: stores.id,
      })
      .from(pendingNFCe)
      .leftJoin(users, eq(pendingNFCe.userId, users.id))
      .leftJoin(stores, eq(pendingNFCe.storeId, stores.id))
      .where(whereClause)
      .orderBy(desc(pendingNFCe.createdAt))
      .limit(limit)
      .offset(offset);

    console.log(
      "🔍 ADMIN: Query principal executada, registros encontrados:",
      pendingNFCeList.length
    );

    // Contar total para paginação
    console.log("🔍 ADMIN: Contando total de registros...");

    const totalCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(pendingNFCe)
      .where(whereClause);

    const total = totalCount[0]?.count || 0;
    const totalPages = Math.ceil(total / limit);

    console.log(
      "🔍 ADMIN: Total de registros:",
      total,
      "Total de páginas:",
      totalPages
    );

    // Estatísticas
    console.log("🔍 ADMIN: Calculando estatísticas...");

    const stats = await db
      .select({
        total: sql<number>`count(*)`,
        pending: sql<number>`count(*) filter (where ${pendingNFCe.status} = 'pending')`,
        approved: sql<number>`count(*) filter (where ${pendingNFCe.status} = 'approved')`,
        rejected: sql<number>`count(*) filter (where ${pendingNFCe.status} = 'rejected')`,
      })
      .from(pendingNFCe);

    console.log("🔍 ADMIN: Estatísticas calculadas:", stats[0]);

    const response = {
      success: true,
      data: {
        nfceList: pendingNFCeList,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
        stats: stats[0],
      },
    };

    console.log("🔍 ADMIN: Resposta preparada com sucesso");
    return NextResponse.json(response);
  } catch (error) {
    console.error("❌ ADMIN: Erro ao buscar NFC-e pendentes:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Erro interno do servidor",
        message: error instanceof Error ? error.message : "Erro desconhecido",
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
