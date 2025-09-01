export interface Transaction {
  id: string;
  store_name: string;
  type: "award" | "redeem" | "expire" | "adjustment";
  amount: number;
  reference: string;
  created_at: string;
  metadata?: any;
}

export interface RewardRedemption {
  id: string;
  store_name: string;
  reward_name: string;
  cost_points: number;
  status: "pending" | "completed" | "cancelled";
  created_at: string;
  metadata?: any;
}





