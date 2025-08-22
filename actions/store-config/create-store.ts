"use server";

import { db } from "@/lib/db";
import { stores } from "@/lib/db/schema";
import { z } from "zod";

const createStoreSchema = z.object({
  userId: z.string().min(1, "ID do usuário é obrigatório"),
  userEmail: z.string().email("Email inválido"),
  userName: z.string().min(1, "Nome é obrigatório"),
  storeName: z.string().min(1, "Nome da loja é obrigatório").optional(),
  storeSlug: z.string().min(1, "Slug da loja é obrigatório").optional(),
  storeDescription: z.string().optional(),
  storePhone: z.string().optional(),
});

export type CreateStoreInput = z.infer<typeof createStoreSchema>;

export async function createStore(input: CreateStoreInput) {
  try {
    console.log("=== DEBUG CREATE STORE ACTION ===");
    console.log("input recebido:", input);

    const validatedData = createStoreSchema.parse(input);
    console.log("dados validados:", validatedData);

    // Gerar slug único se não fornecido
    let finalSlug = validatedData.storeSlug;
    if (!finalSlug) {
      const baseSlug = validatedData.userName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

      const timestamp = Date.now();
      finalSlug = `${baseSlug}-${timestamp}`;
    }

    // Gerar nome da loja se não fornecido
    const finalStoreName =
      validatedData.storeName || `Loja de ${validatedData.userName}`;

    console.log("Criando loja com slug:", finalSlug);

    // Criar a loja
    const [newStore] = await db
      .insert(stores)
      .values({
        owner_id: validatedData.userId,
        name: finalStoreName,
        slug: finalSlug,
        description:
          validatedData.storeDescription || "Loja criada automaticamente",
        email: validatedData.userEmail,
        phone: validatedData.storePhone,
        currency: "BRL",
      })
      .returning({ id: stores.id });

    console.log("SUCESSO: Loja criada com ID:", newStore.id);
    return {
      success: true,
      data: {
        storeId: newStore.id,
        message: "Loja criada com sucesso",
      },
    };
  } catch (error) {
    console.error("ERRO na action createStore:", error);
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
