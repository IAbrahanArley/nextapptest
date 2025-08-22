import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  user_store_balances,
  stores,
  point_transactions,
} from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    if (session.user.role !== "customer") {
      return NextResponse.json(
        { error: "Acesso negado. Apenas clientes podem acessar esta rota." },
        { status: 403 }
      );
    }

    // Buscar saldos do usuário em todas as lojas
    const balances = await db
      .select({
        id: user_store_balances.id,
        store_id: user_store_balances.store_id,
        points: user_store_balances.points,
        reserved_points: user_store_balances.reserved_points,
        store_name: stores.name,
        store_logo: stores.logo_url,
        store_slug: stores.slug,
        store_address: stores.address,
        store_phone: stores.phone,
        store_website: stores.website,
        store_instagram: stores.instagram,
      })
      .from(user_store_balances)
      .innerJoin(stores, eq(user_store_balances.store_id, stores.id))
      .where(eq(user_store_balances.user_id, session.user.id));

    // Para cada loja, buscar a data da última transação
    const balancesWithLastTransaction = await Promise.all(
      balances.map(async (balance) => {
        const lastTransaction = await db
          .select({
            created_at: point_transactions.created_at,
          })
          .from(point_transactions)
          .where(
            and(
              eq(point_transactions.user_id, session.user.id!),
              eq(point_transactions.store_id, balance.store_id)
            )
          )
          .orderBy(desc(point_transactions.created_at))
          .limit(1);

        return {
          ...balance,
          last_transaction_date: lastTransaction[0]?.created_at || null,
        };
      })
    );

    // Filtrar apenas lojas com pontos > 0
    const activeBalances = balancesWithLastTransaction.filter(
      (balance) => balance.points > 0
    );

    return NextResponse.json({
      success: true,
      balances: activeBalances,
      totalPoints: activeBalances.reduce(
        (sum, balance) => sum + balance.points,
        0
      ),
      totalStores: activeBalances.length,
    });
  } catch (error) {
    console.error("Erro ao buscar saldos do cliente:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
