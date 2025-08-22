"use server";

import { db } from "@/lib/db";
import { stores } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Schema de validação para dados da loja
const updateStoreDataSchema = z.object({
  storeId: z.string().min(1, "ID da loja é obrigatório"),
  name: z
    .string()
    .min(1, "Nome da loja é obrigatório")
    .max(256, "Nome muito longo"),
  description: z.string().optional(),
  cnpj: z
    .string()
    .regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, "CNPJ inválido")
    .optional(),
  email: z.string().email("E-mail inválido").optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  website: z.string().url("URL inválida").optional().or(z.literal("")),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  whatsapp: z.string().optional(),
  profileImageUrl: z.string().optional(),
});

export type UpdateStoreDataInput = z.infer<typeof updateStoreDataSchema>;

export async function updateStoreData(input: UpdateStoreDataInput) {
  try {
    // Validar input
    const validatedData = updateStoreDataSchema.parse(input);

    // Verificar se a loja existe
    const existingStore = await db.query.stores.findFirst({
      where: eq(stores.id, validatedData.storeId),
    });

    if (!existingStore) {
      throw new Error("Loja não encontrada");
    }

    // Atualizar dados da loja
    await db
      .update(stores)
      .set({
        name: validatedData.name,
        description: validatedData.description || null,
        cnpj: validatedData.cnpj || null,
        email: validatedData.email || null,
        phone: validatedData.phone || null,
        address: validatedData.address || null,
        website: validatedData.website || null,
        instagram: validatedData.instagram || null,
        facebook: validatedData.facebook || null,
        whatsapp: validatedData.whatsapp || null,
        banner_url: validatedData.profileImageUrl || null,
        updated_at: new Date(),
      })
      .where(eq(stores.id, validatedData.storeId));

    // Revalidar cache
    revalidatePath("/dashboard-loja/configuracoes");

    return {
      success: true,
      message: "Dados da loja atualizados com sucesso",
    };
  } catch (error) {
    console.error("Erro ao atualizar dados da loja:", error);

    if (error instanceof z.ZodError) {
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




