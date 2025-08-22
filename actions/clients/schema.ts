import { z } from "zod";

export const createClientSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  phone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  cpf: z.string().min(11, "CPF deve ter pelo menos 11 dígitos"),
});

export const updateClientSchema = createClientSchema.partial().extend({
  id: z.string().uuid("ID inválido"),
});

export type CreateClientInput = z.infer<typeof createClientSchema>;
export type UpdateClientInput = z.infer<typeof updateClientSchema>;
