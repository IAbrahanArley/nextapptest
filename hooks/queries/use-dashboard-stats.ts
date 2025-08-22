import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "@/actions/dashboard-stats";

export function useDashboardStats(storeId: string) {
  return useQuery({
    queryKey: ["dashboard-stats", storeId],
    queryFn: () => getDashboardStats({ storeId }),
    enabled: !!storeId,
    refetchInterval: 5 * 60 * 1000,
  });
}



