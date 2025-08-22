import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  reward_redemptions,
  reward_redemption_qr_codes,
  rewards,
} from "@/lib/db/schema";
import { eq, or } from "drizzle-orm";
import { validateVerificationCode } from "@/lib/utils/verification-code";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { qr_code, verification_code, store_id, store_validation_metadata } =
      body;

    if (!store_id) {
      return NextResponse.json(
        { error: "ID da loja é obrigatório" },
        { status: 400 }
      );
    }

    if (!qr_code && !verification_code) {
      return NextResponse.json(
        {
          error: "QR code ou código verificador é obrigatório",
        },
        { status: 400 }
      );
    }

    let qrCodeRecord;

    if (verification_code) {
      // Validar formato do código verificador
      if (!validateVerificationCode(verification_code)) {
        return NextResponse.json(
          {
            error: "Formato do código verificador inválido",
          },
          { status: 400 }
        );
      }

      // Buscar por código verificador
      qrCodeRecord = await db.query.reward_redemption_qr_codes.findFirst({
        where: eq(
          reward_redemption_qr_codes.verification_code,
          verification_code
        ),
        with: {
          redemption: {
            with: {
              reward: true,
              user: true,
              store: true,
            },
          },
        },
      });
    } else {
      // Buscar por QR code
      qrCodeRecord = await db.query.reward_redemption_qr_codes.findFirst({
        where: eq(reward_redemption_qr_codes.qr_code, qr_code),
        with: {
          redemption: {
            with: {
              reward: true,
              user: true,
              store: true,
            },
          },
        },
      });
    }

    if (!qrCodeRecord) {
      return NextResponse.json(
        { error: "Código não encontrado" },
        { status: 404 }
      );
    }

    if (qrCodeRecord.redemption.store_id !== store_id) {
      return NextResponse.json(
        { error: "Código não pertence a esta loja" },
        { status: 403 }
      );
    }

    if (qrCodeRecord.is_used) {
      return NextResponse.json(
        { error: "Código já foi utilizado" },
        { status: 400 }
      );
    }

    if (new Date() > qrCodeRecord.expires_at) {
      return NextResponse.json({ error: "Código expirado" }, { status: 400 });
    }

    if (qrCodeRecord.validated_by_store) {
      return NextResponse.json(
        { error: "Código já foi validado" },
        { status: 400 }
      );
    }

    const now = new Date();

    await db.transaction(async (tx) => {
      await tx
        .update(reward_redemption_qr_codes)
        .set({
          is_used: true,
          used_at: now,
          validated_by_store: true,
          validated_at: now,
          store_validation_metadata: store_validation_metadata || {},
        })
        .where(eq(reward_redemption_qr_codes.id, qrCodeRecord.id));

      await tx
        .update(reward_redemptions)
        .set({
          status: "completed",
          validation_status: "validated",
        })
        .where(eq(reward_redemptions.id, qrCodeRecord.redemption_id));

      if (qrCodeRecord.redemption.reward.quantity) {
        await tx
          .update(rewards)
          .set({
            quantity: qrCodeRecord.redemption.reward.quantity - 1,
          })
          .where(eq(rewards.id, qrCodeRecord.redemption.reward_id));
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        redemption: qrCodeRecord.redemption,
        qrCode: qrCodeRecord,
      },
    });
  } catch (error) {
    console.error("Erro ao validar resgate:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
