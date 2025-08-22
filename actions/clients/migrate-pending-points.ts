"use server";

import { db } from "@/lib/db";
import {
  pending_points,
  point_transactions,
  user_store_balances,
  stores,
} from "@/lib/db/schema";
import { eq, and, sql } from "drizzle-orm";

export interface MigratePendingPointsInput {
  cpf: string;
  userId: string;
}

export async function migratePendingPoints(input: MigratePendingPointsInput) {
  try {
    const { cpf, userId } = input;

    // Buscar todos os pontos pendentes para o CPF em todas as lojas
    const pendingPoints = await db
      .select({
        id: pending_points.id,
        store_id: pending_points.store_id,
        amount: pending_points.amount,
        metadata: pending_points.metadata,
        extras: pending_points.extras,
        store_name: stores.name,
      })
      .from(pending_points)
      .innerJoin(stores, eq(pending_points.store_id, stores.id))
      .where(
        and(eq(pending_points.cpf, cpf), eq(pending_points.migrated, false))
      );

    if (pendingPoints.length === 0) {
      return {
        success: true,
        message: "Nenhum ponto pendente encontrado",
        pointsMigrated: 0,
        storesMigrated: 0,
      };
    }

    let totalPointsMigrated = 0;
    const storesMigrated = new Set<string>();

    // Migrar cada ponto pendente
    for (const pendingPoint of pendingPoints) {
      try {
        // Criar transação de migração
        await db.insert(point_transactions).values({
          user_id: userId,
          store_id: pendingPoint.store_id,
          type: "award",
          amount: pendingPoint.amount,
          reference: `Migração de pontos pendentes - ${
            pendingPoint.metadata?.description || "Compra anterior"
          }`,
          metadata: {
            ...pendingPoint.metadata,
            migratedFrom: pendingPoint.id,
            migrationDate: new Date().toISOString(),
            storeName: pendingPoint.store_name,
          },
        });

        // Marcar como migrado
        await db
          .update(pending_points)
          .set({
            migrated: true,
            migrated_to_user_id: userId,
            extras: {
              ...pendingPoint.extras,
              migratedAt: new Date().toISOString(),
            },
          })
          .where(eq(pending_points.id, pendingPoint.id));

        totalPointsMigrated += pendingPoint.amount;
        storesMigrated.add(pendingPoint.store_id);

        console.log(
          `✅ ${pendingPoint.amount} pontos migrados da loja ${pendingPoint.store_name} para usuário ${userId}`
        );
      } catch (error) {
        console.error(
          `❌ Erro ao migrar pontos da loja ${pendingPoint.store_id}:`,
          error
        );
        // Continuar com outras migrações mesmo se uma falhar
      }
    }

    // Atualizar ou criar saldos do usuário em todas as lojas migradas
    for (const storeId of storesMigrated) {
      try {
        // Calcular total de pontos para esta loja
        const storePoints = pendingPoints
          .filter((p) => p.store_id === storeId)
          .reduce((sum, p) => sum + p.amount, 0);

        // Verificar se já existe saldo para esta loja
        const existingBalance = await db
          .select()
          .from(user_store_balances)
          .where(
            and(
              eq(user_store_balances.user_id, userId),
              eq(user_store_balances.store_id, storeId)
            )
          )
          .limit(1);

        if (existingBalance.length > 0) {
          // Atualizar saldo existente
          await db
            .update(user_store_balances)
            .set({
              points: sql`${user_store_balances.points} + ${storePoints}`,
              updated_at: new Date(),
            })
            .where(
              and(
                eq(user_store_balances.user_id, userId),
                eq(user_store_balances.store_id, storeId)
              )
            );
        } else {
          // Criar novo saldo
          await db.insert(user_store_balances).values({
            user_id: userId,
            store_id: storeId,
            points: storePoints,
            reserved_points: 0,
          });
        }
      } catch (error) {
        console.error(`❌ Erro ao atualizar saldo da loja ${storeId}:`, error);
      }
    }

    console.log(
      `✅ ${totalPointsMigrated} pontos migrados para usuário ${userId} em ${storesMigrated.size} lojas`
    );

    return {
      success: true,
      message: `${totalPointsMigrated} pontos migrados com sucesso de ${storesMigrated.size} lojas`,
      pointsMigrated: totalPointsMigrated,
      storesMigrated: storesMigrated.size,
    };
  } catch (error) {
    console.error("❌ Erro ao migrar pontos pendentes:", error);
    return {
      success: false,
      message: "Erro interno ao migrar pontos pendentes",
      pointsMigrated: 0,
      storesMigrated: 0,
    };
  }
}
