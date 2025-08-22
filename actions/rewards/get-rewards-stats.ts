"use server";

import { db } from "@/lib/db";
import { rewards, reward_redemptions, subscriptions } from "@/lib/db/schema";
import { eq, count, desc, and, gte } from "drizzle-orm";
import { z } from "zod";
import { getPlanById } from "@/lib/plans";

const getRewardsStatsSchema = z.object({
  store_id: z.string().uuid("ID da loja inválido"),
});

export type GetRewardsStatsInput = z.infer<typeof getRewardsStatsSchema>;

export async function getRewardsStats(input: GetRewardsStatsInput) {
  try {
    const validatedData = getRewardsStatsSchema.parse(input);

    // Buscar assinatura da loja
    const subscription = await db.query.subscriptions.findFirst({
      where: eq(subscriptions.store_id, validatedData.store_id),
    });

    let planLimits = null;
    if (subscription) {
      const plan = getPlanById(subscription.plan_id);
      if (plan) {
        planLimits = {
          max_rewards: plan.limits.premios,
          plan_name: plan.name,
        };
      }
    }

    // Contar total de prêmios
    const totalRewards = await db
      .select({ count: count() })
      .from(rewards)
      .where(eq(rewards.store_id, validatedData.store_id));

    // Contar prêmios ativos
    const activeRewards = await db
      .select({ count: count() })
      .from(rewards)
      .where(
        and(
          eq(rewards.store_id, validatedData.store_id),
          eq(rewards.active, true)
        )
      );

    // Contar total de resgates (este mês)
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    const monthlyRedemptions = await db
      .select({ count: count() })
      .from(reward_redemptions)
      .where(
        and(
          eq(reward_redemptions.store_id, validatedData.store_id),
          gte(reward_redemptions.created_at, currentMonth)
        )
      );

    // Buscar prêmio mais popular (mais resgatado)
    const popularReward = await db
      .select({
        reward_id: reward_redemptions.reward_id,
        count: count(),
      })
      .from(reward_redemptions)
      .where(eq(reward_redemptions.store_id, validatedData.store_id))
      .groupBy(reward_redemptions.reward_id)
      .orderBy(desc(count()))
      .limit(1);

    let mostPopularReward = null;
    if (popularReward.length > 0) {
      const reward = await db.query.rewards.findFirst({
        where: eq(rewards.id, popularReward[0].reward_id),
      });
      if (reward) {
        mostPopularReward = {
          title: reward.title,
          redemptions: popularReward[0].count,
        };
      }
    }

    return {
      success: true,
      data: {
        total_rewards: totalRewards[0]?.count || 0,
        active_rewards: activeRewards[0]?.count || 0,
        monthly_redemptions: monthlyRedemptions[0]?.count || 0,
        most_popular_reward: mostPopularReward,
        plan_limits: planLimits,
      },
    };
  } catch (error) {
    console.error("Erro ao buscar estatísticas dos prêmios:", error);
    return {
      success: false,
      error: "Erro interno ao buscar estatísticas",
    };
  }
}

