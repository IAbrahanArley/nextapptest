import { useQuery } from "@tanstack/react-query";
import { getRewardRedemptions } from "@/actions/rewards/get-reward-redemptions";

interface UseRewardRedemptionsInput {
  user_id: string;
}

export const useRewardRedemptions = (input: UseRewardRedemptionsInput) => {
  return useQuery({
    queryKey: ["reward-redemptions", input.user_id],
    queryFn: () => getRewardRedemptions(input),
    enabled: !!input.user_id,
  });
};

export const rewardRedemptionsQueryKey = (userId: string) => [
  "reward-redemptions",
  userId,
];
