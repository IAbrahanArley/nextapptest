import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { point_transactions, stores } from "@/lib/db/schema";
import { eq, and, desc, gte } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    // Buscar transações dos últimos 90 dias (mais histórico)
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const transactions = await db
      .select({
        id: point_transactions.id,
        store_id: point_transactions.store_id,
        type: point_transactions.type,
        amount: point_transactions.amount,
        reference: point_transactions.reference,
        created_at: point_transactions.created_at,
        metadata: point_transactions.metadata,
        store_name: stores.name,
      })
      .from(point_transactions)
      .innerJoin(stores, eq(point_transactions.store_id, stores.id))
      .where(
        and(
          eq(point_transactions.user_id, session.user.id),
          gte(point_transactions.created_at, ninetyDaysAgo)
        )
      )
      .orderBy(desc(point_transactions.created_at))
      .limit(50); // Mais transações para o histórico

    return NextResponse.json({
      success: true,
      transactions: transactions.map((t) => ({
        id: t.id,
        store_name: t.store_name,
        type: t.type,
        amount: t.amount,
        reference: t.reference,
        created_at: t.created_at,
        metadata: t.metadata,
      })),
    });
  } catch (error) {
    console.error("Erro ao buscar transações recentes:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
