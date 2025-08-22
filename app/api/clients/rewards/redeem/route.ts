import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  rewards,
  user_store_balances,
  point_transactions,
  reward_redemptions,
  reward_redemption_qr_codes,
  stores,
} from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import QRCode from "qrcode";
import { generateVerificationCode } from "@/lib/utils/verification-code";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const { rewardId, storeId } = body;

    if (!rewardId || !storeId) {
      return NextResponse.json(
        { error: "ID do prêmio e da loja são obrigatórios" },
        { status: 400 }
      );
    }

    const reward = await db.query.rewards.findFirst({
      where: eq(rewards.id, rewardId),
    });

    if (!reward) {
      return NextResponse.json(
        { error: "Prêmio não encontrado" },
        { status: 404 }
      );
    }

    if (!reward.active) {
      return NextResponse.json(
        { error: "Prêmio não está ativo" },
        { status: 400 }
      );
    }

    if (reward.quantity && reward.quantity <= 0) {
      return NextResponse.json(
        { error: "Prêmio indisponível" },
        { status: 400 }
      );
    }

    const [userBalance] = await db
      .select()
      .from(user_store_balances)
      .where(
        and(
          eq(user_store_balances.user_id, session.user.id),
          eq(user_store_balances.store_id, storeId)
        )
      );

    if (!userBalance || userBalance.points < reward.cost_points) {
      return NextResponse.json(
        { error: "Pontos insuficientes para resgatar este prêmio" },
        { status: 400 }
      );
    }

    await db.transaction(async (tx) => {
      await tx
        .update(user_store_balances)
        .set({
          points: userBalance.points - reward.cost_points,
        })
        .where(
          and(
            eq(user_store_balances.user_id, session.user.id),
            eq(user_store_balances.store_id, storeId)
          )
        );

      await tx.insert(point_transactions).values({
        user_id: session.user.id,
        store_id: storeId,
        type: "redeem",
        amount: -reward.cost_points,
        reference: `Resgate: ${reward.title}`,
        metadata: {
          reward_id: reward.id,
          reward_name: reward.title,
          reward_type: reward.type,
        },
      });

      const [redemption] = await tx
        .insert(reward_redemptions)
        .values({
          user_id: session.user.id,
          store_id: storeId,
          reward_id: reward.id,
          cost_points: reward.cost_points,
          status: "pending",
          validation_status: "pending",
          metadata: {
            reward_title: reward.title,
            reward_type: reward.type,
          },
        })
        .returning();

      const qrCodeData = {
        redemption_id: redemption.id,
        reward_id: reward.id,
        store_id: storeId,
        user_id: session.user.id,
        cost_points: reward.cost_points,
        timestamp: Date.now(),
      };

      const qrCodeString = await QRCode.toString(JSON.stringify(qrCodeData), {
        type: "svg",
        width: 200,
        margin: 2,
      });

      const expiresAt = new Date();
      expiresAt.setDate(
        expiresAt.getDate() + (reward.redemption_validity_days || 30)
      );

      // Buscar o nome da loja para gerar o código verificador
      const store = await tx.query.stores.findFirst({
        where: eq(stores.id, storeId),
        columns: { name: true },
      });

      const verificationCode = generateVerificationCode(
        store?.name || "LOJA",
        redemption.id
      );

      await tx.insert(reward_redemption_qr_codes).values({
        redemption_id: redemption.id,
        qr_code: qrCodeString,
        verification_code: verificationCode,
        expires_at: expiresAt,
      });

      await tx
        .update(reward_redemptions)
        .set({
          qr_code: qrCodeString,
          redeemed_at: new Date(),
        })
        .where(eq(reward_redemptions.id, redemption.id));

      if (reward.quantity) {
        await tx
          .update(rewards)
          .set({
            quantity: reward.quantity - 1,
          })
          .where(eq(rewards.id, rewardId));
      }
    });

    return NextResponse.json({
      success: true,
      message: "Prêmio resgatado com sucesso!",
      reward: {
        id: reward.id,
        name: reward.title,
        points_used: reward.cost_points,
        remaining_points: userBalance.points - reward.cost_points,
      },
    });
  } catch (error) {
    console.error("Erro ao resgatar prêmio:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
