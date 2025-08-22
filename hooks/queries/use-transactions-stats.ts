import { useQuery } from "@tanstack/react-query";
import { getTransactionsStats } from "@/actions/transactions";

export function useTransactionsStats() {
  return useQuery({
    queryKey: ["transactions-stats"],
    queryFn: getTransactionsStats,
    staleTime: 1000 * 60 * 5,
  });
}
