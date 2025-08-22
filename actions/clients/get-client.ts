"use server";

import { db } from "@/lib/db";
import {
  users,
  user_store_balances,
  point_transactions,
} from "@/lib/db/schema";
import { eq, desc, sql } from "drizzle-orm";

export interface ClientDetails {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  cpf: string;
  points: number;
  reservedPoints: number;
  totalTransactions: number;
  lastTransaction: Date | null;
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
}

export async function getClient(
  clientId: string,
  storeId: string
): Promise<ClientDetails | null> {
  try {
    const client = await db
      .select({
        id: users.id,
        name: users.name,
        phone: users.phone,
        email: users.email,
        cpf: users.cpf,
        points: user_store_balances.points,
        reservedPoints: user_store_balances.reserved_points,
        createdAt: users.created_at,
        updatedAt: users.updated_at,
      })
      .from(users)
      .innerJoin(user_store_balances, eq(users.id, user_store_balances.user_id))
      .where(
        eq(users.id, clientId) && eq(user_store_balances.store_id, storeId)
      )
      .limit(1);

    if (client.length === 0) {
      return null;
    }

    const clientData = client[0];

    // Buscar última transação
    const lastTransaction = await db
      .select({ created_at: point_transactions.created_at })
      .from(point_transactions)
      .where(
        eq(point_transactions.user_id, clientId) &&
          eq(point_transactions.store_id, storeId)
      )
      .orderBy(desc(point_transactions.created_at))
      .limit(1);

    // Buscar total de transações
    const totalTransactions = await db
      .select({ count: sql<number>`count(*)` })
      .from(point_transactions)
      .where(
        eq(point_transactions.user_id, clientId) &&
          eq(point_transactions.store_id, storeId)
      );

    // Determinar status baseado na última transação (30 dias = inativo)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const lastTransactionDate = lastTransaction[0]?.created_at;
    const status: "active" | "inactive" =
      lastTransactionDate && lastTransactionDate > thirtyDaysAgo
        ? "active"
        : "inactive";

    return {
      ...clientData,
      totalTransactions: totalTransactions[0]?.count || 0,
      lastTransaction: lastTransactionDate || null,
      status,
    };
  } catch (error) {
    console.error("Erro ao buscar cliente:", error);
    throw new Error("Erro interno ao buscar cliente");
  }
}
