"use server";

import { db } from "@/lib/db";
import {
  reward_redemptions,
  rewards,
  stores,
  reward_redemption_qr_codes,
} from "@/lib/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { z } from "zod";

const getRewardRedemptionsSchema = z.object({
  user_id: z.string().uuid("ID do usuário inválido"),
});

export type GetRewardRedemptionsInput = z.infer<
  typeof getRewardRedemptionsSchema
>;

export async function getRewardRedemptions(input: GetRewardRedemptionsInput) {
  try {
    const validatedData = getRewardRedemptionsSchema.parse(input);

    // Buscar resgates do usuário com informações completas
    const redemptions = await db
      .select({
        id: reward_redemptions.id,
        cost_points: reward_redemptions.cost_points,
        status: reward_redemptions.status,
        validation_status: reward_redemptions.validation_status,
        redeemed_at: reward_redemptions.redeemed_at,
        created_at: reward_redemptions.created_at,
        metadata: reward_redemptions.metadata,
        reward: {
          title: rewards.title,
          description: rewards.description,
          type: rewards.type,
        },
        store: {
          name: stores.name,
          address: stores.address,
        },
        qr_code: reward_redemption_qr_codes.qr_code,
        verification_code: reward_redemption_qr_codes.verification_code,
      })
      .from(reward_redemptions)
      .innerJoin(rewards, eq(reward_redemptions.reward_id, rewards.id))
      .innerJoin(stores, eq(reward_redemptions.store_id, stores.id))
      .innerJoin(
        reward_redemption_qr_codes,
        eq(reward_redemptions.id, reward_redemption_qr_codes.redemption_id)
      )
      .where(eq(reward_redemptions.user_id, validatedData.user_id))
      .orderBy(desc(reward_redemptions.created_at));

    // Mapear os dados para usar redeemed_at ou created_at como fallback
    const mappedRedemptions = redemptions.map((redemption) => ({
      ...redemption,
      redeemed_at: redemption.redeemed_at || redemption.created_at,
    }));

    return {
      success: true,
      data: mappedRedemptions,
    };
  } catch (error) {
    console.error("Erro ao buscar resgates de prêmios:", error);
    return {
      success: false,
      error: "Erro interno ao buscar resgates de prêmios",
    };
  }
}
