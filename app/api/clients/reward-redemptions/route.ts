import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { reward_redemptions, stores, rewards } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    if (session.user.role !== "customer") {
      return NextResponse.json(
        { error: "Acesso negado. Apenas clientes podem acessar esta rota." },
        { status: 403 }
      );
    }

    // Buscar resgates de prêmios do usuário
    const userRedemptions = await db
      .select({
        id: reward_redemptions.id,
        store_id: reward_redemptions.store_id,
        reward_id: reward_redemptions.reward_id,
        cost_points: reward_redemptions.cost_points,
        status: reward_redemptions.status,
        created_at: reward_redemptions.created_at,
        metadata: reward_redemptions.metadata,
        store_name: stores.name,
        reward_title: rewards.title,
      })
      .from(reward_redemptions)
      .innerJoin(stores, eq(reward_redemptions.store_id, stores.id))
      .innerJoin(rewards, eq(reward_redemptions.reward_id, rewards.id))
      .where(eq(reward_redemptions.user_id, session.user.id))
      .orderBy(desc(reward_redemptions.created_at));

    // Mapear para o formato esperado pela interface
    const mappedRedemptions = userRedemptions.map((redemption) => ({
      id: redemption.id,
      store_name: redemption.store_name,
      reward_name: redemption.reward_title,
      cost_points: redemption.cost_points,
      status: redemption.status,
      created_at: redemption.created_at,
      metadata: redemption.metadata,
    }));

    return NextResponse.json({
      success: true,
      redemptions: mappedRedemptions,
      totalRedemptions: mappedRedemptions.length,
      completedRedemptions: mappedRedemptions.filter(
        (r) => r.status === "completed"
      ).length,
    });
  } catch (error) {
    console.error("Erro ao buscar resgates de prêmios:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}



