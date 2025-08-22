import { useQuery } from "@tanstack/react-query";
import { getRewards } from "@/actions/rewards/get-rewards";

interface GetRewardsInput {
  store_id: string;
}

export const useRewards = (input: GetRewardsInput) => {
  return useQuery({
    queryKey: ["rewards", input.store_id],
    queryFn: () => getRewards(input),
    enabled: !!input.store_id,
  });
};

export const rewardsQueryKey = (storeId: string) => ["rewards", storeId];
