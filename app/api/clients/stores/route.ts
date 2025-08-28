import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  stores,
  user_store_balances,
  rewards,
  point_transactions,
} from "@/lib/db/schema";
import { eq, desc, and, sql } from "drizzle-orm";

export async function GET() {
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

    // Buscar todos os estabelecimentos
    const allStores = await db
      .select({
        id: stores.id,
        name: stores.name,
        description: stores.description,
        logo_url: stores.logo_url,
        slug: stores.slug,
        address: stores.address,
        phone: stores.phone,
        website: stores.website,
        instagram: stores.instagram,
        created_at: stores.created_at,
      })
      .from(stores)
      .orderBy(desc(stores.created_at));

    // Buscar transações do usuário para calcular pontos por loja
    const userTransactions = await db
      .select({
        store_id: point_transactions.store_id,
        type: point_transactions.type,
        amount: point_transactions.amount,
      })
      .from(point_transactions)
      .where(eq(point_transactions.user_id, session.user.id));

    // Calcular pontos por loja baseado nas transações
    const pointsByStore = new Map();
    userTransactions.forEach((transaction) => {
      const currentPoints = pointsByStore.get(transaction.store_id) || 0;
      if (transaction.type === "award" || transaction.type === "adjustment") {
        pointsByStore.set(
          transaction.store_id,
          currentPoints + transaction.amount
        );
      } else if (
        transaction.type === "redeem" ||
        transaction.type === "expire"
      ) {
        pointsByStore.set(
          transaction.store_id,
          currentPoints - transaction.amount
        );
      }
    });

    // Buscar prêmios para cada loja
    const allRewards = await db
      .select({
        store_id: rewards.store_id,
        id: rewards.id,
        title: rewards.title,
        description: rewards.description,
        cost_points: rewards.cost_points,
        type: rewards.type,
        active: rewards.active,
      })
      .from(rewards)
      .where(eq(rewards.active, true));

    // Buscar estatísticas de clientes por loja
    const storeStats = await db
      .select({
        store_id: point_transactions.store_id,
        total_customers: sql<number>`COUNT(DISTINCT ${point_transactions.user_id})`,
        total_transactions: sql<number>`COUNT(*)`,
      })
      .from(point_transactions)
      .groupBy(point_transactions.store_id);

    // Criar mapas para facilitar o acesso
    const balanceMap = pointsByStore;

    const rewardsMap = new Map();
    allRewards.forEach((reward) => {
      if (!rewardsMap.has(reward.store_id)) {
        rewardsMap.set(reward.store_id, []);
      }
      rewardsMap.get(reward.store_id).push({
        id: reward.id,
        title: reward.title,
        description: reward.description,
        cost_points: reward.cost_points,
        type: reward.type,
        active: reward.active,
      });
    });

    const statsMap = new Map(storeStats.map((stat) => [stat.store_id, stat]));

    // Combinar dados das lojas com todas as informações
    const storesWithBalances = allStores.map((store) => {
      const storeRewards = rewardsMap.get(store.id) || [];
      const storeStats = statsMap.get(store.id);

      return {
        id: store.id,
        name: store.name,
        description: store.description,
        logo_url: store.logo_url,
        slug: store.slug,
        address: store.address,
        phone: store.phone,
        website: store.website,
        instagram: store.instagram,
        points: balanceMap.get(store.id) || 0,
        rewards: storeRewards,
        category: "Geral", // Pode ser implementado depois
        rating: 4.5, // Pode ser implementado depois
        total_customers: storeStats?.total_customers || 0,
        is_partner: storeRewards.length > 0, // É parceira se tiver prêmios
      };
    });

    return NextResponse.json({
      success: true,
      stores: storesWithBalances,
      totalStores: storesWithBalances.length,
      partnerStores: storesWithBalances.filter((s) => s.is_partner).length,
    });
  } catch (error) {
    console.error("Erro ao buscar estabelecimentos:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
