"use server";

import { db } from "@/lib/db";
import { users, user_store_balances } from "@/lib/db/schema";
import { updateClientSchema, type UpdateClientInput } from "./schema";
import { eq, and } from "drizzle-orm";

export async function updateClient(data: UpdateClientInput, storeId: string) {
  try {
    const validatedData = updateClientSchema.parse(data);

    // Verificar se o cliente pertence à loja
    const existingClient = await db
      .select({ id: users.id })
      .from(users)
      .innerJoin(user_store_balances, eq(users.id, user_store_balances.user_id))
      .where(
        and(
          eq(users.id, validatedData.id),
          eq(user_store_balances.store_id, storeId)
        )
      )
      .limit(1);

    if (existingClient.length === 0) {
      return {
        success: false,
        error: "Cliente não encontrado ou não pertence a esta loja",
      };
    }

    // Atualizar informações do cliente
    await db
      .update(users)
      .set({
        name: validatedData.name,
        phone: validatedData.phone,
        email: validatedData.email || null,
        updated_at: new Date(),
      })
      .where(eq(users.id, validatedData.id));

    return {
      success: true,
      data: { message: "Cliente atualizado com sucesso" },
    };
  } catch (error) {
    console.error("Erro ao atualizar cliente:", error);
    return {
      success: false,
      error: "Erro interno ao atualizar cliente",
    };
  }
}
