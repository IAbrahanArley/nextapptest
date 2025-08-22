import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
      role: "customer" | "merchant" | "admin";
      cpf?: string;
    };
  }

  interface User {
    id: string;
    email: string;
    name?: string;
    role: "customer" | "merchant" | "admin";
    cpf?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "customer" | "merchant" | "admin";
    cpf?: string;
  }
}
