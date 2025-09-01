export interface Reward {
  id: string;
  title: string;
  description: string;
  cost_points: number;
  type: string;
  active: boolean;
  image_url?: string;
  available_quantity?: number;
  is_featured?: boolean;
}

export interface Store {
  id: string;
  name: string;
  description?: string;
  logo_url?: string;
  address?: string;
  phone?: string;
  website?: string;
  instagram?: string;
  points: number;
  category: string;
  rating: number;
  total_customers: number;
  is_partner: boolean;
  rewards?: Reward[];
}





