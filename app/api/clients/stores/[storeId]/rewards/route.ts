import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { rewards } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
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

    const { storeId } = params;

    if (!storeId) {
      return NextResponse.json(
        { error: "ID da loja é obrigatório" },
        { status: 400 }
      );
    }

    // Buscar prêmios da loja
    const storeRewards = await db
      .select({
        id: rewards.id,
        title: rewards.title,
        description: rewards.description,
        cost_points: rewards.cost_points,
        quantity: rewards.quantity,
        type: rewards.type,
        active: rewards.active,
        created_at: rewards.created_at,
      })
      .from(rewards)
      .where(and(eq(rewards.store_id, storeId), eq(rewards.active, true)))
      .orderBy(desc(rewards.created_at));

    // Mapear para o formato esperado pela interface
    const mappedRewards = storeRewards.map((reward) => ({
      id: reward.id,
      name: reward.title,
      description: reward.description || "",
      points_required: reward.cost_points,
      image_url: undefined, // Campo não existe no schema atual
      category: reward.type,
      available_quantity: reward.quantity || 999, // Se não tiver quantidade, assume ilimitado
      expiry_date: undefined, // Campo não existe no schema atual
      is_featured: false, // Campo não existe no schema atual
    }));

    return NextResponse.json({
      success: true,
      rewards: mappedRewards,
      totalRewards: mappedRewards.length,
      featuredRewards: mappedRewards.filter((r) => r.is_featured).length,
    });
  } catch (error) {
    console.error("Erro ao buscar prêmios da loja:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
