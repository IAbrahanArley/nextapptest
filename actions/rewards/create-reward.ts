"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { rewards, subscriptions } from "@/lib/db/schema";
import { eq, count } from "drizzle-orm";
import { createRewardSchema, type CreateRewardInput } from "./schema";
import { getPlanById, checkLimit } from "@/lib/plans";

export async function createReward(input: CreateRewardInput) {
  try {
    console.log("=== DEBUG CREATE REWARD ACTION ===");
    console.log("Input recebido:", input);
    console.log("Tipo do input:", typeof input);
    console.log("Keys do input:", Object.keys(input));

    const validatedData = createRewardSchema.parse(input);
    console.log("Dados validados:", validatedData);

    // Buscar a assinatura da loja
    console.log("Buscando assinatura da loja...");
    const subscription = await db.query.subscriptions.findFirst({
      where: eq(subscriptions.store_id, validatedData.store_id),
    });

    console.log("Assinatura encontrada:", subscription);

    // Se não houver assinatura, permitir criação (para desenvolvimento)
    if (!subscription) {
      console.log(
        "Nenhuma assinatura encontrada, permitindo criação para desenvolvimento"
      );
      // return {
      //   success: false,
      //   error: "Loja não possui assinatura ativa",
      // };
    }

    // Se houver assinatura, verificar se está ativa
    if (subscription) {
      if (
        subscription.status !== "active" &&
        subscription.status !== "trialing"
      ) {
        console.log("ERRO: Assinatura não está ativa");
        return {
          success: false,
          error: "Assinatura não está ativa",
        };
      }

      // Obter o plano atual
      const currentPlan = getPlanById(subscription.plan_id);
      console.log("Plano atual:", currentPlan);

      if (!currentPlan) {
        console.log("ERRO: Plano não encontrado");
        return {
          success: false,
          error: "Plano não encontrado",
        };
      }

      // Contar prêmios existentes da loja
      console.log("Contando prêmios existentes...");
      const rewardsCount = await db
        .select({ count: count() })
        .from(rewards)
        .where(eq(rewards.store_id, validatedData.store_id));

      const currentRewardsCount = rewardsCount[0]?.count || 0;
      console.log("Quantidade atual de prêmios:", currentRewardsCount);

      // Verificar limite de prêmios do plano
      if (!checkLimit(currentPlan, "premios", currentRewardsCount)) {
        console.log("ERRO: Limite de prêmios atingido");
        return {
          success: false,
          error: `Seu plano atual (${currentPlan.name}) permite apenas ${currentPlan.limits.premios} prêmios. Você já possui ${currentRewardsCount} prêmios.`,
        };
      }
    }

    // Preparar dados para inserção
    console.log("Preparando dados para inserção...");
    const rewardData: any = {
      store_id: validatedData.store_id,
      title: validatedData.title,
      description: validatedData.description,
      cost_points: validatedData.cost_points,
      type: validatedData.type,
      active: validatedData.active,
      redemption_validity_days: validatedData.redemption_validity_days,
    };

    // Adicionar quantity apenas se for um número válido
    if (validatedData.quantity && typeof validatedData.quantity === "number") {
      rewardData.quantity = validatedData.quantity;
    }

    console.log("Dados para inserção:", rewardData);

    // Criar o prêmio no banco de dados
    console.log("Inserindo prêmio no banco...");
    const [newReward] = await db.insert(rewards).values(rewardData).returning();
    console.log("Prêmio criado:", newReward);

    console.log("Revalidando cache...");
    revalidatePath("/dashboard-loja/premios");

    console.log("SUCESSO: Prêmio criado com sucesso!");
    return {
      success: true,
      data: newReward,
      message: "Prêmio criado com sucesso",
    };
  } catch (error) {
    console.error("ERRO na action createReward:", error);
    console.error("Tipo do erro:", typeof error);
    console.error("Stack trace:", error instanceof Error ? error.stack : "N/A");

    return {
      success: false,
      error: "Erro interno ao criar prêmio",
    };
  }
}
