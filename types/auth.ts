export type UserRole = "customer" | "merchant" | "admin";

export interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  cpf?: string;
  avatar_url?: string;
  storeId?: string;
  created_at: Date;
  updated_at: Date;
}

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  cpf?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  userType: UserRole;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  userType: UserRole;
  cpf?: string;
  storeName?: string;
  plan?: string;
}
