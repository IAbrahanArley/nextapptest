"use server";

import { db } from "@/lib/db";
import { rewards, reward_redemptions } from "@/lib/db/schema";
import { eq, count, desc } from "drizzle-orm";
import { z } from "zod";

const getRewardsSchema = z.object({
  store_id: z.string().uuid("ID da loja inválido"),
});

export type GetRewardsInput = z.infer<typeof getRewardsSchema>;

export async function getRewards(input: GetRewardsInput) {
  try {
    const validatedData = getRewardsSchema.parse(input);

    // Buscar prêmios da loja com contagem de resgates
    const rewardsWithRedemptions = await db
      .select({
        id: rewards.id,
        store_id: rewards.store_id,
        title: rewards.title,
        description: rewards.description,
        cost_points: rewards.cost_points,
        quantity: rewards.quantity,
        type: rewards.type,
        active: rewards.active,
        created_at: rewards.created_at,
        updated_at: rewards.updated_at,
        redemptions_count: count(reward_redemptions.id),
      })
      .from(rewards)
      .leftJoin(
        reward_redemptions,
        eq(rewards.id, reward_redemptions.reward_id)
      )
      .where(eq(rewards.store_id, validatedData.store_id))
      .groupBy(
        rewards.id,
        rewards.store_id,
        rewards.title,
        rewards.description,
        rewards.cost_points,
        rewards.quantity,
        rewards.type,
        rewards.active,
        rewards.created_at,
        rewards.updated_at
      )
      .orderBy(desc(rewards.created_at));

    return {
      success: true,
      data: rewardsWithRedemptions,
    };
  } catch (error) {
    console.error("Erro ao buscar prêmios:", error);
    return {
      success: false,
      error: "Erro interno ao buscar prêmios",
    };
  }
}
