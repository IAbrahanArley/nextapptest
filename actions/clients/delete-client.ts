"use server";

import { db } from "@/lib/db";
import {
  users,
  user_store_balances,
  point_transactions,
} from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function deleteClient(clientId: string, storeId: string) {
  try {
    // Verificar se o cliente pertence à loja
    const existingClient = await db
      .select({ id: users.id })
      .from(users)
      .innerJoin(user_store_balances, eq(users.id, user_store_balances.user_id))
      .where(
        and(eq(users.id, clientId), eq(user_store_balances.store_id, storeId))
      )
      .limit(1);

    if (existingClient.length === 0) {
      return {
        success: false,
        error: "Cliente não encontrado ou não pertence a esta loja",
      };
    }

    // Deletar transações de pontos
    await db
      .delete(point_transactions)
      .where(
        and(
          eq(point_transactions.user_id, clientId),
          eq(point_transactions.store_id, storeId)
        )
      );

    // Deletar balance do usuário na loja
    await db
      .delete(user_store_balances)
      .where(
        and(
          eq(user_store_balances.user_id, clientId),
          eq(user_store_balances.store_id, storeId)
        )
      );

    // Nota: Não deletamos o usuário completamente pois pode ter pontos em outras lojas
    // Apenas removemos a associação com esta loja específica

    return {
      success: true,
      data: { message: "Cliente removido da loja com sucesso" },
    };
  } catch (error) {
    console.error("Erro ao deletar cliente:", error);
    return {
      success: false,
      error: "Erro interno ao deletar cliente",
    };
  }
}
