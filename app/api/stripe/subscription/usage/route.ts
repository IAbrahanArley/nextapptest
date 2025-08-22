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
import { eq, and, gte, lte, sql } from "drizzle-orm";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Buscar a loja do usuário
    const store = await db.query.stores.findFirst({
      where: eq(stores.owner_id, session.user.id),
    });

    if (!store) {
      return NextResponse.json(
        { error: "Loja não encontrada" },
        { status: 404 }
      );
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Contar clientes únicos
    const clientsCount = await db
      .select({
        count: sql<number>`count(distinct ${user_store_balances.user_id})`,
      })
      .from(user_store_balances)
      .where(eq(user_store_balances.store_id, store.id));

    // Contar prêmios ativos
    const rewardsCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(rewards)
      .where(eq(rewards.store_id, store.id));

    // Contar transações do mês atual
    const transactionsCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(point_transactions)
      .where(
        and(
          eq(point_transactions.store_id, store.id),
          gte(point_transactions.created_at, startOfMonth),
          lte(point_transactions.created_at, endOfMonth)
        )
      );

    // Para mensagens de WhatsApp, vamos simular um contador
    // Em uma implementação real, isso viria de uma tabela de logs ou métricas
    const whatsappMessagesCount = Math.floor(Math.random() * 50) + 10; // Simulação

    return NextResponse.json({
      usage: {
        clientes: clientsCount[0]?.count || 0,
        premios: rewardsCount[0]?.count || 0,
        transacoesMes: transactionsCount[0]?.count || 0,
        mensagensWhatsApp: whatsappMessagesCount,
        estabelecimentos: 1, // Por enquanto, uma loja por usuário
      },
      period: {
        start: startOfMonth,
        end: endOfMonth,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar uso:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}



