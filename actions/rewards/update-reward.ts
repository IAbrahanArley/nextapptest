"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { rewards } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { updateRewardSchema, type UpdateRewardInput } from "./schema";

export async function updateReward(input: UpdateRewardInput) {
  try {
    const validatedData = updateRewardSchema.parse(input);

    // Verificar se o prêmio pertence à loja
    const existingReward = await db.query.rewards.findFirst({
      where: and(
        eq(rewards.id, validatedData.id),
        eq(rewards.store_id, validatedData.store_id)
      ),
    });

    if (!existingReward) {
      return {
        success: false,
        error: "Prêmio não encontrado ou não pertence à loja",
      };
    }

    // Atualizar o prêmio
    const [updatedReward] = await db
      .update(rewards)
      .set({
        title: validatedData.title,
        description: validatedData.description,
        cost_points: validatedData.cost_points,
        quantity: validatedData.quantity,
        type: validatedData.type,
        active: validatedData.active,
        updated_at: new Date(),
      })
      .where(
        and(
          eq(rewards.id, validatedData.id),
          eq(rewards.store_id, validatedData.store_id)
        )
      )
      .returning();

    revalidatePath("/dashboard-loja/premios");

    return {
      success: true,
      data: updatedReward,
      message: "Prêmio atualizado com sucesso",
    };
  } catch (error) {
    console.error("Erro ao atualizar prêmio:", error);
    return {
      success: false,
      error: "Erro interno ao atualizar prêmio",
    };
  }
}

