import { z } from "zod";

export const storeConfigSchema = z.object({
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
  points_per_currency_unit: z
    .number()
    .min(0.01, "Valor mínimo é 0.01")
    .max(100, "Valor máximo é 100"),
  min_purchase_value_to_award: z.number().min(0, "Valor mínimo é 0"),
  points_validity_days: z
    .number()
    .min(1, "Validade mínima é 1 dia")
    .max(3650, "Validade máxima é 10 anos"),
  notification_whatsapp: z.boolean(),
  notification_email: z.boolean(),
  notification_expiration: z.boolean(),
});

export type StoreConfigFormData = z.infer<typeof storeConfigSchema>;

