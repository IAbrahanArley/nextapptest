import { useQuery } from "@tanstack/react-query";
import { getRewardsStats } from "@/actions/rewards/get-rewards-stats";

interface GetRewardsStatsInput {
  store_id: string;
}

export const useRewardsStats = (input: GetRewardsStatsInput) => {
  return useQuery({
    queryKey: ["rewards-stats", input.store_id],
    queryFn: () => getRewardsStats(input),
    enabled: !!input.store_id,
  });
};

export const rewardsStatsQueryKey = (storeId: string) => [
  "rewards-stats",
  storeId,
];
