"use server";

import { db } from "@/lib/db";
import { point_transactions, store_settings } from "@/lib/db/schema";
import { eq, sql, gte, and } from "drizzle-orm";
import { getStoreId } from "../store-config/get-store-id";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export interface TransactionStats {
  totalVendas: number;
  totalPontos: number;
  transacoesHoje: number;
  transacoesMes: number;
  mediaPontosPorTransacao: number;
  crescimentoHoje: number;
}

export async function getTransactionsStats(): Promise<TransactionStats> {
  try {
    console.log("🚀 getTransactionsStats chamada");

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      console.log("❌ Usuário não autenticado");
      throw new Error("Usuário não autenticado");
    }

    console.log("✅ Usuário autenticado:", session.user.id);

    const storeIdResult = await getStoreId({ userId: session.user.id });
    if (!storeIdResult?.success || !storeIdResult?.data?.storeId) {
      console.log("❌ Loja não encontrada:", storeIdResult);
      throw new Error("Loja não encontrada");
    }

    const storeId = storeIdResult.data.storeId;
    console.log("✅ Store ID encontrado:", storeId);

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const ontem = new Date(hoje);
    ontem.setDate(ontem.getDate() - 1);

    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);

    console.log("📅 Datas calculadas:", { hoje, ontem, inicioMes });

    const [totalStats, hojeStats, ontemStats, mesStats] = await Promise.all([
      db
        .select({
          totalVendas: sql<number>`COALESCE(SUM(CAST(metadata->>'purchaseValue' AS DECIMAL)), 0)`,
          totalPontos: sql<number>`COALESCE(SUM(amount), 0)`,
          totalTransacoes: sql<number>`count(*)`,
        })
        .from(point_transactions)
        .where(eq(point_transactions.store_id, storeId)),

      db
        .select({
          count: sql<number>`count(*)`,
          valor: sql<number>`COALESCE(SUM(CAST(metadata->>'purchaseValue' AS DECIMAL)), 0)`,
        })
        .from(point_transactions)
        .where(
          and(
            eq(point_transactions.store_id, storeId),
            gte(point_transactions.created_at, hoje)
          )
        ),

      db
        .select({
          count: sql<number>`count(*)`,
        })
        .from(point_transactions)
        .where(
          and(
            eq(point_transactions.store_id, storeId),
            gte(point_transactions.created_at, ontem),
            gte(point_transactions.created_at, hoje)
          )
        ),

      db
        .select({
          count: sql<number>`count(*)`,
        })
        .from(point_transactions)
        .where(
          and(
            eq(point_transactions.store_id, storeId),
            gte(point_transactions.created_at, inicioMes)
          )
        ),
    ]);

    console.log("📊 Estatísticas brutas:", {
      totalStats,
      hojeStats,
      ontemStats,
      mesStats,
    });

    const totalVendas = Number(totalStats[0]?.totalVendas || 0);
    const totalPontos = Number(totalStats[0]?.totalPontos || 0);
    const totalTransacoes = Number(totalStats[0]?.totalTransacoes || 0);
    const transacoesHoje = Number(hojeStats[0]?.count || 0);
    const transacoesOntem = Number(ontemStats[0]?.count || 0);
    const transacoesMes = Number(mesStats[0]?.count || 0);

    const mediaPontosPorTransacao =
      totalTransacoes > 0 ? totalPontos / totalTransacoes : 0;
    const crescimentoHoje =
      transacoesOntem > 0 ? transacoesHoje - transacoesOntem : 0;

    const result = {
      totalVendas,
      totalPontos,
      transacoesHoje,
      transacoesMes,
      mediaPontosPorTransacao: Math.round(mediaPontosPorTransacao),
      crescimentoHoje,
    };

    console.log("🎯 Resultado final das estatísticas:", result);

    return result;
  } catch (error) {
    console.error("❌ Erro ao buscar estatísticas das transações:", error);
    throw new Error("Erro interno ao buscar estatísticas");
  }
}
