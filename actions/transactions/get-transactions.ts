"use server";

import { db } from "@/lib/db";
import { getTransactionsSchema } from "./schema";
import { point_transactions, users, store_settings } from "@/lib/db/schema";
import { eq, desc, sql, and, like, gte, lte, or } from "drizzle-orm";
import { getStoreId } from "../store-config/get-store-id";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export interface TransactionWithDetails {
  id: string;
  cliente: string;
  valor: number;
  pontos: number;
  data: Date;
  status: string;
  tipo: string;
  referencia: string | null;
}

export interface TransactionsResponse {
  transactions: TransactionWithDetails[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export async function getTransactions(
  input: typeof getTransactionsSchema._type
): Promise<TransactionsResponse> {
  try {
    console.log("🚀 getTransactions chamada com input:", input);

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

    const validatedData = getTransactionsSchema.parse(input);
    const { page, limit, search, startDate, endDate } = validatedData;
    const offset = (page - 1) * limit;

    console.log("🔍 Buscando transações para storeId:", storeId);
    console.log("📊 Parâmetros:", { page, limit, search, startDate, endDate });

    // Buscar transações com informações do usuário (quando disponível)
    const transactionsWithUsers = await db
      .select({
        id: point_transactions.id,
        cliente: users.name,
        cpf: point_transactions.cpf,
        valor: point_transactions.metadata,
        pontos: point_transactions.amount,
        data: point_transactions.created_at,
        tipo: point_transactions.type,
        referencia: point_transactions.reference,
        hasUser: sql<boolean>`CASE WHEN ${point_transactions.user_id} IS NOT NULL THEN true ELSE false END`,
      })
      .from(point_transactions)
      .leftJoin(users, eq(point_transactions.user_id, users.id))
      .where(eq(point_transactions.store_id, storeId))
      .orderBy(desc(point_transactions.created_at))
      .limit(limit)
      .offset(offset);

    console.log("💳 Transações encontradas:", transactionsWithUsers.length);
    console.log("💳 Dados das transações:", transactionsWithUsers);

    const totalCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(point_transactions)
      .where(eq(point_transactions.store_id, storeId));

    const total = totalCount[0]?.count || 0;
    const totalPages = Math.ceil(total / limit);

    console.log("📈 Total de transações:", total);

    const transactionsWithDetails: TransactionWithDetails[] =
      transactionsWithUsers.map((t) => ({
        id: t.id,
        cliente: t.hasUser
          ? t.cliente || `Cliente por CPF: ${t.cpf}`
          : `Cliente por CPF: ${t.cpf}`,
        valor: (t.valor as any)?.purchaseValue || 0,
        pontos: t.pontos,
        data: t.data,
        status: "Concluída",
        tipo: t.tipo,
        referencia: t.referencia,
      }));

    console.log("🎯 Transações processadas:", transactionsWithDetails.length);
    console.log("🎯 Resultado final:", {
      transactions: transactionsWithDetails.length,
      total,
      totalPages,
      currentPage: page,
    });

    return {
      transactions: transactionsWithDetails,
      total,
      totalPages,
      currentPage: page,
    };
  } catch (error) {
    console.error("❌ Erro ao buscar transações:", error);
    throw new Error("Erro interno ao buscar transações");
  }
}
