"use server";

import { db } from "@/lib/db";
import { subscriptions } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { getStoreId } from "./get-store-id";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getActiveSubscription() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new Error("Usuário não autenticado");
    }

    const storeIdResult = await getStoreId({ userId: session.user.id });
    if (!storeIdResult?.success || !storeIdResult?.data?.storeId) {
      throw new Error("Loja não encontrada");
    }

    const storeId = storeIdResult.data.storeId;
    const subscription = await db
      .select({
        planId: subscriptions.plan_id,
        status: subscriptions.status,
        currentPeriodEnd: subscriptions.current_period_end,
      })
      .from(subscriptions)
      .where(
        and(
          eq(subscriptions.store_id, storeId),
          eq(subscriptions.status, "active")
        )
      )
      .limit(1);

    if (!subscription.length) {
      return null;
    }

    return subscription[0];
  } catch (error) {
    console.error("Erro ao buscar assinatura ativa:", error);
    return null;
  }
}
