import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

// Verificar se estamos no servidor
if (typeof window !== "undefined") {
  throw new Error("Database connection can only be used on the server side");
}

// Verificar se a variável de ambiente está definida
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// Criar pool de conexões PostgreSQL
const pool = new Pool({
  connectionString,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

// Criar instância do Drizzle
const db = drizzle(pool, { schema });

export { db };

// Função para fechar o pool (útil para testes)
export const closePool = async () => {
  await pool.end();
};
