"use server";

import { db } from "@/lib/db";
import { dashboardStatsSchema } from "./schema";
import {
  user_store_balances,
  point_transactions,
  rewards,
  reward_redemptions,
  users,
} from "@/lib/db/schema";
import { eq, and, gte, sql, count, sum } from "drizzle-orm";
import { startOfMonth, subMonths } from "date-fns";

export async function getDashboardStats(input: { storeId: string }) {
  try {
    const { storeId } = dashboardStatsSchema.parse(input);

    const currentMonth = startOfMonth(new Date());
    const lastMonth = startOfMonth(subMonths(new Date(), 1));

    const [
      totalClients,
      totalPointsDistributed,
      totalRewardsRedeemed,
      currentMonthStats,
      lastMonthStats,
      topClients,
      monthlyData,
    ] = await Promise.all([
      db
        .select({ count: count() })
        .from(user_store_balances)
        .where(eq(user_store_balances.store_id, storeId)),

      db
        .select({
          total: sum(point_transactions.amount),
        })
        .from(point_transactions)
        .where(
          and(
            eq(point_transactions.store_id, storeId),
            eq(point_transactions.type, "award")
          )
        ),

      db
        .select({
          count: count(),
        })
        .from(reward_redemptions)
        .where(
          and(
            eq(reward_redemptions.store_id, storeId),
            eq(reward_redemptions.status, "completed")
          )
        ),

      db
        .select({
          points: sum(point_transactions.amount),
          transactions: count(),
        })
        .from(point_transactions)
        .where(
          and(
            eq(point_transactions.store_id, storeId),
            eq(point_transactions.type, "award"),
            gte(point_transactions.created_at, currentMonth)
          )
        ),

      db
        .select({
          points: sum(point_transactions.amount),
          transactions: count(),
        })
        .from(point_transactions)
        .where(
          and(
            eq(point_transactions.store_id, storeId),
            eq(point_transactions.type, "award"),
            gte(point_transactions.created_at, lastMonth),
            sql`${point_transactions.created_at} < ${currentMonth}`
          )
        ),

      db
        .select({
          userName: users.name,
          points: user_store_balances.points,
          lastTransaction: sql<string>`MAX(${point_transactions.created_at})`,
        })
        .from(user_store_balances)
        .innerJoin(users, eq(users.id, user_store_balances.user_id))
        .leftJoin(
          point_transactions,
          and(
            eq(point_transactions.user_id, users.id),
            eq(point_transactions.store_id, storeId)
          )
        )
        .where(eq(user_store_balances.store_id, storeId))
        .groupBy(users.id, users.name, user_store_balances.points)
        .orderBy(sql`${user_store_balances.points} DESC`)
        .limit(5),

      db
        .select({
          month: sql<string>`TO_CHAR(${point_transactions.created_at}, 'Mon')`,
          points: sum(point_transactions.amount),
          transactions: count(),
        })
        .from(point_transactions)
        .where(
          and(
            eq(point_transactions.store_id, storeId),
            eq(point_transactions.type, "award"),
            gte(
              point_transactions.created_at,
              startOfMonth(subMonths(new Date(), 5))
            )
          )
        )
        .groupBy(sql`TO_CHAR(${point_transactions.created_at}, 'Mon')`)
        .orderBy(sql`MIN(${point_transactions.created_at})`),
    ]);

    const totalClientsCount = totalClients[0]?.count || 0;
    const totalPoints = Number(totalPointsDistributed[0]?.total || 0);
    const totalRewards = totalRewardsRedeemed[0]?.count || 0;

    const currentMonthPoints = Number(currentMonthStats[0]?.points || 0);
    const currentMonthTransactions = currentMonthStats[0]?.transactions || 0;
    const lastMonthPoints = Number(lastMonthStats[0]?.points || 0);
    const lastMonthTransactions = lastMonthStats[0]?.transactions || 0;

    const pointsGrowth =
      lastMonthPoints > 0
        ? ((currentMonthPoints - lastMonthPoints) / lastMonthPoints) * 100
        : 0;

    const clientsGrowth =
      lastMonthTransactions > 0
        ? ((currentMonthTransactions - lastMonthTransactions) /
            lastMonthTransactions) *
          100
        : 0;

    return {
      totalClients: totalClientsCount,
      totalPointsDistributed: totalPoints,
      totalRewardsRedeemed: totalRewards,
      currentMonthPoints,
      pointsGrowth: Math.round(pointsGrowth * 100) / 100,
      clientsGrowth: Math.round(clientsGrowth * 100) / 100,
      topClients: topClients.map((client) => ({
        nome: client.userName || "Cliente",
        pontos: client.points || 0,
        ultimaCompra: client.lastTransaction
          ? new Date(client.lastTransaction).toLocaleDateString("pt-BR")
          : "N/A",
      })),
      monthlyData: monthlyData.map((item) => ({
        name: item.month || "Jan",
        vendas: Number(item.transactions || 0),
        pontos: Number(item.points || 0),
      })),
    };
  } catch (error) {
    console.error("Erro ao buscar estatísticas do dashboard:", error);
    throw new Error("Falha ao carregar estatísticas do dashboard");
  }
}







