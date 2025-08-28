"use server";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { migratePendingPoints } from "./migrate-pending-points";

export interface MigratePointsForExistingUserInput {
  cpf: string;
}

export async function migratePointsForExistingUser(
  input: MigratePointsForExistingUserInput
) {
  try {
    const { cpf } = input;

    // Buscar usuário existente pelo CPF
    const existingUser = await db
      .select({ id: users.id, name: users.name, email: users.email })
      .from(users)
      .where(eq(users.cpf, cpf))
      .limit(1);

    if (existingUser.length === 0) {
      return {
        success: false,
        message: "Usuário com este CPF não encontrado na plataforma",
        pointsMigrated: 0,
        storesMigrated: 0,
      };
    }

    const userId = existingUser[0].id;

    // Migrar pontos pendentes
    const migrationResult = await migratePendingPoints({
      cpf,
      userId,
    });

    if (migrationResult.success) {
      return {
        success: true,
        message: migrationResult.message,
        pointsMigrated: migrationResult.pointsMigrated,
        storesMigrated: migrationResult.storesMigrated,
        userInfo: {
          id: userId,
          name: existingUser[0].name,
          email: existingUser[0].email,
        },
      };
    } else {
      return {
        success: false,
        message: migrationResult.message,
        pointsMigrated: 0,
        storesMigrated: 0,
      };
    }
  } catch (error) {
    console.error("❌ Erro ao migrar pontos para usuário existente:", error);
    return {
      success: false,
      message: "Erro interno ao migrar pontos",
      pointsMigrated: 0,
      storesMigrated: 0,
    };
  }
}




