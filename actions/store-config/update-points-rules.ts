"use server";

import { db } from "@/lib/db";
import { store_settings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Schema de validação para regras de pontuação
const updatePointsRulesSchema = z.object({
  storeId: z.string().min(1, "ID da loja é obrigatório"),
  points_per_currency_unit: z
    .number()
    .min(0.01, "Valor mínimo é 0.01")
    .max(100, "Valor máximo é 100"),
  min_purchase_value_to_award: z
    .number()
    .min(0, "Valor mínimo é 0")
    .max(10000, "Valor máximo é R$ 10.000,00"),
  points_validity_days: z
    .number()
    .min(1, "Validade mínima é 1 dia")
    .max(3650, "Validade máxima é 10 anos"),
});

export type UpdatePointsRulesInput = z.infer<typeof updatePointsRulesSchema>;

export async function updatePointsRules(input: UpdatePointsRulesInput) {
  try {
    // Validar input
    const validatedData = updatePointsRulesSchema.parse(input);

    console.log("Dados validados:", validatedData);

    // Verificar se as configurações da loja existem
    const existingSettings = await db.query.store_settings.findFirst({
      where: eq(store_settings.store_id, validatedData.storeId),
    });

    console.log("Configurações existentes:", existingSettings);

    if (!existingSettings) {
      // Criar configurações se não existirem
      console.log("Criando novas configurações...");

      const newSettings = await db
        .insert(store_settings)
        .values({
          store_id: validatedData.storeId,
          points_per_currency_unit:
            validatedData.points_per_currency_unit.toString(),
          min_purchase_value_to_award:
            validatedData.min_purchase_value_to_award.toString(),
          points_validity_days: validatedData.points_validity_days,
          notification_whatsapp: false,
          notification_email: false,
          notification_expiration: false,
        })
        .returning();

      console.log("Configurações criadas:", newSettings);
    } else {
      // Atualizar configurações existentes
      console.log("Atualizando configurações existentes...");

      const updatedSettings = await db
        .update(store_settings)
        .set({
          points_per_currency_unit:
            validatedData.points_per_currency_unit.toString(),
          min_purchase_value_to_award:
            validatedData.min_purchase_value_to_award.toString(),
          points_validity_days: validatedData.points_validity_days,
          updated_at: new Date(),
        })
        .where(eq(store_settings.store_id, validatedData.storeId))
        .returning();

      console.log("Configurações atualizadas:", updatedSettings);
    }

    // Revalidar cache
    revalidatePath("/dashboard-loja/configuracoes");

    return {
      success: true,
      message: "Regras de pontuação atualizadas com sucesso",
    };
  } catch (error) {
    console.error("Erro ao atualizar regras de pontuação:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Dados inválidos",
        errors: error.errors,
      };
    }

    // Log detalhado do erro para debug
    if (error instanceof Error) {
      console.error("Mensagem de erro:", error.message);
      console.error("Stack trace:", error.stack);
    }

    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Erro interno do servidor",
    };
  }
}
