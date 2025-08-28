export interface StoreBalance {
  id: string;
  store_name: string;
  points: number;
  store_logo?: string;
  store_address?: string;
  store_phone?: string;
  store_website?: string;
  store_instagram?: string;
  last_transaction_date?: string;
}

export interface BalancesResponse {
  success: boolean;
  balances: StoreBalance[];
  totalPoints: number;
  totalStores: number;
}

export interface Transaction {
  id: string;
  store_name: string;
  type: "award" | "redeem" | "expire" | "adjustment";
  amount: number;
  reference: string;
  created_at: string;
  metadata?: any;
}


