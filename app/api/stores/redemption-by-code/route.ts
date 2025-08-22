import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { reward_redemption_qr_codes } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { verification_code, store_id } = body;

    if (!verification_code || !store_id) {
      return NextResponse.json(
        { error: "Código verificador e ID da loja são obrigatórios" },
        { status: 400 }
      );
    }

    const qrCodeRecord = await db.query.reward_redemption_qr_codes.findFirst({
      where: eq(
        reward_redemption_qr_codes.verification_code,
        verification_code
      ),
      with: {
        redemption: {
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
        },
      },
    });

    if (!qrCodeRecord) {
      return NextResponse.json(
        { error: "Código verificador não encontrado" },
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

    return NextResponse.json({
      redemption: qrCodeRecord.redemption,
      qrCode: qrCodeRecord,
    });
  } catch (error) {
    console.error("Erro ao buscar resgate por código:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
