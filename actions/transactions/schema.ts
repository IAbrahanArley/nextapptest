import { z } from "zod";

export const createTransactionSchema = z.object({
  clienteId: z.string().optional(),
  cpf: z.string().min(11).max(14).optional(),
  valor: z.number().positive("Valor deve ser maior que zero"),
  descricao: z.string().optional(),
});

export const getTransactionsSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  search: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type GetTransactionsInput = z.infer<typeof getTransactionsSchema>;
