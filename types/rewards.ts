export interface Reward {
  id: string;
  store_id: string;
  title: string;
  description: string | null;
  cost_points: number;
  quantity: number | null;
  type: "product" | "discount" | "coupon";
  active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface RewardWithRedemptions extends Reward {
  redemptions_count: number;
}

export interface RewardStats {
  total_rewards: number;
  active_rewards: number;
  monthly_redemptions: number;
  most_popular_reward: {
    title: string;
    redemptions: number;
  } | null;
  plan_limits: {
    max_rewards: number;
    plan_name: string;
  } | null;
}

export interface CreateRewardData {
  title: string;
  description: string;
  cost_points: number;
  quantity?: number;
  type: "product" | "discount" | "coupon";
  active: boolean;
}

export interface UpdateRewardData extends CreateRewardData {
  id: string;
}

