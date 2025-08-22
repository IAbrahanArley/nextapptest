"use server";

import { db } from "@/lib/db";
import {
  users,
  user_store_balances,
  point_transactions,
  pending_points,
} from "@/lib/db/schema";
import { eq, desc, sql, or, and, isNotNull, isNull } from "drizzle-orm";

export interface ClientWithBalance {
  id: string | null;
  name: string | null;
  phone: string | null;
  email: string | null;
  cpf: string | null;
  points: number;
  totalTransactions: number;
  lastTransaction: Date | null;
  status: "active" | "inactive";
  createdAt: Date;
  isRegistered: boolean;
}

export async function getClients(
  storeId: string
): Promise<ClientWithBalance[]> {
  try {
    console.log("🔍 Buscando clientes para storeId:", storeId);

    // Buscar clientes cadastrados que têm pontos na loja
    const registeredClientsWithBalance = await db
      .select({
        id: users.id,
        name: users.name,
        phone: users.phone,
        email: users.email,
        cpf: users.cpf,
        points: user_store_balances.points,
        createdAt: users.created_at,
        isRegistered: sql<boolean>`true`,
      })
      .from(users)
      .innerJoin(user_store_balances, eq(users.id, user_store_balances.user_id))
      .where(eq(user_store_balances.store_id, storeId));

    console.log("📊 Clientes com pontos:", registeredClientsWithBalance.length);

    // Buscar clientes cadastrados que fizeram transações mas podem não ter pontos atuais
    const registeredClientsFromTransactions = await db
      .select({
        id: point_transactions.user_id,
        name: users.name,
        phone: users.phone,
        email: users.email,
        cpf: users.cpf,
        points: sql<number>`0`,
        createdAt: users.created_at,
        isRegistered: sql<boolean>`true`,
      })
      .from(point_transactions)
      .innerJoin(users, eq(point_transactions.user_id, users.id))
      .where(
        and(
          eq(point_transactions.store_id, storeId),
          isNotNull(point_transactions.user_id)
        )
      );

    console.log(
      "💳 Clientes com transações:",
      registeredClientsFromTransactions.length
    );

    // Buscar clientes que receberam pontos por CPF (pending_points)
    const pendingClients = await db
      .select({
        id: sql<string>`NULL`,
        name: sql<string>`NULL`,
        phone: sql<string>`NULL`,
        email: sql<string>`NULL`,
        cpf: pending_points.cpf,
        points: pending_points.amount,
        createdAt: pending_points.issued_at,
        isRegistered: sql<boolean>`false`,
      })
      .from(pending_points)
      .where(
        and(
          eq(pending_points.store_id, storeId),
          eq(pending_points.migrated, false)
        )
      );

    console.log("🆔 Clientes por CPF:", pendingClients.length);

    // Combinar todos os clientes
    const allClients = [
      ...registeredClientsWithBalance,
      ...registeredClientsFromTransactions,
      ...pendingClients,
    ];

    console.log(
      "🔗 Total de clientes antes de remover duplicatas:",
      allClients.length
    );

    // Remover duplicatas baseado no ID ou CPF
    const uniqueClients = allClients.reduce((acc, client) => {
      const key = client.id || client.cpf;
      if (!key || (client.id && client.id.trim() === "")) return acc;

      const existing = acc.find((c) => (c.id || c.cpf) === key);
      if (!existing) {
        acc.push(client);
      } else {
        // Se já existe, manter o que tem mais informações
        if (client.name && !existing.name) {
          existing.name = client.name;
          existing.phone = client.phone;
          existing.email = client.email;
        }
        if (client.points > existing.points) {
          existing.points = client.points;
        }
        if (client.isRegistered) {
          existing.isRegistered = true;
        }
        // Manter a data de criação mais antiga (quando foi cadastrado)
        if (client.createdAt < existing.createdAt) {
          existing.createdAt = client.createdAt;
        }
      }
      return acc;
    }, [] as typeof allClients);

    console.log(
      "✨ Clientes únicos após remoção de duplicatas:",
      uniqueClients.length
    );

    // Buscar informações adicionais para cada cliente
    const clientsWithDetails = await Promise.all(
      uniqueClients.map(async (client) => {
        // Buscar última transação
        const lastTransaction = await db
          .select({ created_at: point_transactions.created_at })
          .from(point_transactions)
          .where(
            and(
              eq(point_transactions.store_id, storeId),
              or(
                client.id
                  ? eq(point_transactions.user_id, client.id)
                  : sql`false`,
                client.cpf ? eq(point_transactions.cpf, client.cpf) : sql`false`
              )
            )
          )
          .orderBy(desc(point_transactions.created_at))
          .limit(1);

        // Buscar total de transações
        const totalTransactions = await db
          .select({ count: sql<number>`count(*)` })
          .from(point_transactions)
          .where(
            and(
              eq(point_transactions.store_id, storeId),
              or(
                client.id
                  ? eq(point_transactions.user_id, client.id)
                  : sql`false`,
                client.cpf ? eq(point_transactions.cpf, client.cpf) : sql`false`
              )
            )
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
          ...client,
          totalTransactions: totalTransactions[0]?.count || 0,
          lastTransaction: lastTransactionDate || null,
          status,
        };
      })
    );

    console.log("🎯 Clientes finais com detalhes:", clientsWithDetails.length);

    // Ordenar por data de criação (mais recentes primeiro)
    return clientsWithDetails.sort((a, b) => {
      const dateA = a.createdAt || new Date(0);
      const dateB = b.createdAt || new Date(0);
      return dateB.getTime() - dateA.getTime();
    });
  } catch (error) {
    console.error("❌ Erro ao buscar clientes:", error);
    throw new Error("Erro interno ao buscar clientes");
  }
}
