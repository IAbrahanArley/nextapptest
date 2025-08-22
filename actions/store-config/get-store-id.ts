"use server";

import { db } from "@/lib/db";
import { stores } from "@/lib/db/schema";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const getStoreIdSchema = z.object({
  userId: z.string().min(1, "ID do usuário é obrigatório"),
});

export type GetStoreIdInput = z.infer<typeof getStoreIdSchema>;

export async function getStoreId(input: GetStoreIdInput) {
  try {
    console.log("=== DEBUG GET STORE ID ACTION ===");
    console.log("input recebido:", input);

    const validatedData = getStoreIdSchema.parse(input);
    console.log("dados validados:", validatedData);

    console.log("Buscando usuário no banco...");
    const user = await db.query.users.findFirst({
      where: eq(users.id, validatedData.userId),
    });

    console.log("usuário encontrado:", user);

    if (!user) {
      console.log("ERRO: Usuário não encontrado");
      return {
        success: false,
        message: "Usuário não encontrado",
      };
    }

    console.log("Buscando loja no banco...");
    const store = await db.query.stores.findFirst({
      where: eq(stores.owner_id, validatedData.userId),
    });

    console.log("loja encontrada:", store);

    if (!store) {
      console.log("ERRO: Loja não encontrada para este usuário");
      return {
        success: false,
        message: "Loja não encontrada para este usuário",
      };
    }

    console.log("SUCESSO: Loja encontrada com ID:", store.id);
    return {
      success: true,
      data: {
        storeId: store.id,
      },
    };
  } catch (error) {
    console.error("ERRO na action getStoreId:", error);
    console.error("Tipo do erro:", typeof error);
    console.error("Stack trace:", error instanceof Error ? error.stack : "N/A");

    if (error instanceof z.ZodError) {
      console.log("Erro de validação Zod:", error.errors);
      return {
        success: false,
        message: "Dados inválidos",
        errors: error.errors,
      };
    }

    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Erro interno do servidor",
    };
  }
}
