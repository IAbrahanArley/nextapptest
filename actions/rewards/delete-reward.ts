"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { rewards, reward_redemptions } from "@/lib/db/schema";
import { eq, and, count } from "drizzle-orm";
import { deleteRewardSchema, type DeleteRewardInput } from "./schema";

export async function deleteReward(input: DeleteRewardInput) {
  try {
    const validatedData = deleteRewardSchema.parse(input);

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

    // Verificar se há resgates ativos para este prêmio
    const activeRedemptions = await db
      .select({ count: count() })
      .from(reward_redemptions)
      .where(eq(reward_redemptions.reward_id, validatedData.id));

    if (activeRedemptions[0]?.count && activeRedemptions[0].count > 0) {
      return {
        success: false,
        error: "Não é possível excluir um prêmio que possui resgates ativos",
      };
    }

    // Deletar o prêmio
    await db
      .delete(rewards)
      .where(
        and(
          eq(rewards.id, validatedData.id),
          eq(rewards.store_id, validatedData.store_id)
        )
      );

    revalidatePath("/dashboard-loja/premios");

    return {
      success: true,
      message: "Prêmio excluído com sucesso",
    };
  } catch (error) {
    console.error("Erro ao excluir prêmio:", error);
    return {
      success: false,
      error: "Erro interno ao excluir prêmio",
    };
  }
}

