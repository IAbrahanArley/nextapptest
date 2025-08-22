import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  reward_redemptions,
  reward_redemption_qr_codes,
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: { redemptionId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const redemptionId = params.redemptionId;

    if (!redemptionId) {
      return NextResponse.json(
        { error: "ID do resgate é obrigatório" },
        { status: 400 }
      );
    }

    const redemption = await db.query.reward_redemptions.findFirst({
      where: eq(reward_redemptions.id, redemptionId),
      with: {
        user: {
          columns: {
            id: true,
            name: true,
            email: true,
          },
        },
        reward: {
          columns: {
            id: true,
            title: true,
            description: true,
            type: true,
          },
        },
        store: {
          columns: {
            id: true,
            name: true,
            address: true,
          },
        },
      },
    });

    if (!redemption) {
      return NextResponse.json(
        { error: "Resgate não encontrado" },
        { status: 404 }
      );
    }

    const qrCode = await db.query.reward_redemption_qr_codes.findFirst({
      where: eq(reward_redemption_qr_codes.redemption_id, redemptionId),
      columns: {
        id: true,
        expires_at: true,
        is_used: true,
        validated_by_store: true,
      },
    });

    return NextResponse.json({
      redemption,
      qrCode,
    });
  } catch (error) {
    console.error("Erro ao buscar detalhes do resgate:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
