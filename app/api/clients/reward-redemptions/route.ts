import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getRewardRedemptions } from "@/actions/rewards/get-reward-redemptions";

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

    // Usar a nova action para buscar resgates
    const result = await getRewardRedemptions({
      user_id: session.user.id,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Erro ao buscar resgates" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      redemptions: result.data,
      totalRedemptions: result.data.length,
      completedRedemptions: result.data.filter((r) => r.status === "completed")
        .length,
    });
  } catch (error) {
    console.error("Erro ao buscar resgates de prêmios:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
