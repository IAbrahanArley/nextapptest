import { z } from "zod";

const baseClientSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  phone: z
    .string()
    .min(10, "Telefone deve ter pelo menos 10 dígitos")
    .max(15, "Telefone deve ter no máximo 15 caracteres"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  cpf: z
    .string()
    .min(11, "CPF deve ter pelo menos 11 dígitos")
    .max(14, "CPF deve ter no máximo 14 caracteres"),
});

export const createClientSchema = baseClientSchema.transform((data) => ({
  ...data,
  // Remove formatação do CPF e telefone para armazenamento
  cpf: data.cpf.replace(/\D/g, ""),
  phone: data.phone.replace(/\D/g, ""),
}));

export const updateClientSchema = baseClientSchema
  .partial()
  .extend({
    id: z.string().uuid("ID inválido"),
  })
  .transform((data) => ({
    ...data,
    // Remove formatação do CPF e telefone para armazenamento
    cpf: data.cpf ? data.cpf.replace(/\D/g, "") : undefined,
    phone: data.phone ? data.phone.replace(/\D/g, "") : undefined,
  }));

export type CreateClientInput = z.infer<typeof createClientSchema>;
export type UpdateClientInput = z.infer<typeof updateClientSchema>;
