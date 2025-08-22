import { useQuery } from "@tanstack/react-query";
import {
  getTransactions,
  type GetTransactionsInput,
} from "@/actions/transactions";

export function useTransactions(input: GetTransactionsInput) {
  return useQuery({
    queryKey: ["transactions", input],
    queryFn: () => getTransactions(input),
    staleTime: 1000 * 60 * 5,
  });
}
