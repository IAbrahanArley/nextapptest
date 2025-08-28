import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  user_store_balances,
  stores,
  point_transactions,
} from "@/lib/db/schema";
import { eq, and, desc, inArray } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    console.log("🔍 [BALANCES] Iniciando API...");

    const session = await getServerSession(authOptions);
    console.log("🔍 [BALANCES] Sessão obtida:", {
      hasSession: !!session,
      hasUser: !!session?.user,
      userId: session?.user?.id,
      userRole: session?.user?.role,
    });

    if (!session?.user) {
      console.log("🔍 [BALANCES] Usuário não autenticado");
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    if (session.user.role !== "customer") {
      console.log("🔍 [BALANCES] Usuário não é cliente:", session.user.role);
      return NextResponse.json(
        { error: "Acesso negado. Apenas clientes podem acessar esta rota." },
        { status: 403 }
      );
    }

    console.log(
      `🔍 [BALANCES] Buscando saldos para usuário: ${session.user.id}`
    );

    // Primeiro, vamos verificar se existem transações para este usuário
    console.log("🔍 [BALANCES] Executando query de transações...");
    console.log("🔍 [BALANCES] User ID para busca:", session.user.id);

    let userTransactions;
    try {
      userTransactions = await db
        .select({
          id: point_transactions.id,
          store_id: point_transactions.store_id,
          type: point_transactions.type,
          amount: point_transactions.amount,
          created_at: point_transactions.created_at,
        })
        .from(point_transactions)
        .where(eq(point_transactions.user_id, session.user.id));

      console.log(
        `🔍 [BALANCES] Transações encontradas para usuário ${session.user.id}:`,
        userTransactions
      );

      if (userTransactions.length === 0) {
        console.log(
          `🔍 [BALANCES] Nenhuma transação encontrada para usuário ${session.user.id}`
        );
        return NextResponse.json({
          success: true,
          balances: [],
          totalPoints: 0,
          totalStores: 0,
        });
      }
    } catch (dbError) {
      console.error("🔍 [BALANCES] Erro na query de transações:", dbError);
      throw dbError;
    }

    // Calcular saldos de forma mais simples
    const validTransactions = userTransactions.filter(
      (t) => t && t.store_id && typeof t.amount === "number"
    );
    if (validTransactions.length !== userTransactions.length) {
      console.warn(
        "🔍 [BALANCES] Algumas transações inválidas foram filtradas:",
        {
          total: userTransactions.length,
          valid: validTransactions.length,
        }
      );
    }

    const storeIds = [...new Set(validTransactions.map((t) => t.store_id))];
    console.log(`🔍 [BALANCES] IDs das lojas encontradas:`, storeIds);

    // Buscar informações das lojas
    let storesInfo;
    if (storeIds.length > 0) {
      try {
        storesInfo = await db
          .select({
            id: stores.id,
            name: stores.name,
            logo_url: stores.logo_url,
            slug: stores.slug,
            address: stores.address,
            phone: stores.phone,
            website: stores.website,
            instagram: stores.instagram,
          })
          .from(stores)
          .where(inArray(stores.id, storeIds)); // Buscar todas as lojas

        console.log(
          `🔍 [BALANCES] Informações das lojas encontradas:`,
          storesInfo
        );
      } catch (storesError) {
        console.error(
          "🔍 [BALANCES] Erro ao buscar informações das lojas:",
          storesError
        );
        throw new Error(
          `Erro ao buscar informações das lojas: ${
            storesError instanceof Error
              ? storesError.message
              : "Erro desconhecido"
          }`
        );
      }
    } else {
      storesInfo = [];
    }

    // Calcular saldos por loja
    const balances = storesInfo
      .map((store) => {
        if (!store || !store.id) {
          console.warn("🔍 [BALANCES] Loja inválida encontrada:", store);
          return null;
        }

        const storeTransactions = validTransactions.filter(
          (t) => t.store_id === store.id
        );
        const totalPoints = storeTransactions.reduce((sum, t) => {
          if (t.type === "award" || t.type === "adjustment") {
            return sum + t.amount;
          } else if (t.type === "redeem" || t.type === "expire") {
            return sum - t.amount;
          }
          return sum;
        }, 0);

        return {
          id: store.id,
          store_id: store.id,
          points: totalPoints,
          reserved_points: 0,
          store_name: store.name || "Loja sem nome",
          store_logo: store.logo_url,
          store_slug: store.slug || "loja-sem-slug",
          store_address: store.address,
          store_phone: store.phone,
          store_website: store.website,
          store_instagram: store.instagram,
        };
      })
      .filter(Boolean); // Remove entradas nulas

    // Filtrar apenas lojas com pontos > 0
    const activeBalances = balances.filter((balance) => balance.points > 0);
    const totalPoints = activeBalances.reduce(
      (sum, balance) => sum + balance.points,
      0
    );

    console.log(`🔍 [BALANCES] Resposta final:`, {
      success: true,
      balances: activeBalances,
      totalPoints,
      totalStores: activeBalances.length,
      totalTransactions: validTransactions.length,
      totalStoresFound: storesInfo.length,
    });

    return NextResponse.json({
      success: true,
      balances: activeBalances,
      totalPoints,
      totalStores: activeBalances.length,
    });
  } catch (error) {
    console.error("🔍 [BALANCES] Erro ao buscar saldos do cliente:", error);

    // Log mais detalhado do erro
    if (error instanceof Error) {
      console.error("🔍 [BALANCES] Detalhes do erro:", {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
    }

    return NextResponse.json(
      {
        error: "Erro interno do servidor",
        details:
          process.env.NODE_ENV === "development"
            ? error instanceof Error
              ? error.message
              : "Erro desconhecido"
            : undefined,
      },
      { status: 500 }
    );
  }
}
