import { z } from "zod";

export const createRewardSchema = z.object({
  title: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  description: z
    .string()
    .min(10, "Descrição deve ter pelo menos 10 caracteres"),
  cost_points: z.number().min(1, "Pontos devem ser pelo menos 1"),
  quantity: z.number().min(1, "Quantidade deve ser pelo menos 1").optional(),
  type: z.enum(["product", "discount", "coupon"]).default("product"),
  active: z.boolean().default(true),
  redemption_validity_days: z
    .number()
    .min(1, "Validade deve ser pelo menos 1 dia")
    .max(365, "Validade máxima é 365 dias")
    .default(30),
  store_id: z.string().min(1, "ID da loja é obrigatório"),
});

// Função de validação com logs
export function validateCreateReward(data: any) {
  console.log("=== DEBUG SCHEMA VALIDATION ===");
  console.log("Data recebida para validação:", data);
  console.log("Tipo da data:", typeof data);
  console.log("Keys da data:", Object.keys(data));

  try {
    const result = createRewardSchema.parse(data);
    console.log("Validação bem-sucedida:", result);
    return { success: true, data: result };
  } catch (error) {
    console.error("Erro de validação:", error);
    if (error instanceof z.ZodError) {
      console.log("Erros de validação:", error.errors);
    }
    return { success: false, error };
  }
}

export const updateRewardSchema = createRewardSchema.extend({
  id: z.string().uuid("ID do prêmio inválido"),
});

export const deleteRewardSchema = z.object({
  id: z.string().uuid("ID do prêmio inválido"),
  store_id: z.string().uuid("ID da loja inválido"),
});

export type CreateRewardInput = z.infer<typeof createRewardSchema>;
export type UpdateRewardInput = z.infer<typeof updateRewardSchema>;
export type DeleteRewardInput = z.infer<typeof deleteRewardSchema>;
