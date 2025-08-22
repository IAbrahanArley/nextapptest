import { z } from "zod";
import { db } from "@/lib/db";
import {
  reward_redemptions,
  reward_redemption_qr_codes,
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import QRCode from "qrcode";

const createRedemptionQrSchema = z.object({
  redemption_id: z.string().uuid("ID do resgate inválido"),
  store_id: z.string().uuid("ID da loja inválido"),
});

export async function createRedemptionQr(
  data: z.infer<typeof createRedemptionQrSchema>
) {
  try {
    const validatedData = createRedemptionQrSchema.parse(data);

    const redemption = await db.query.reward_redemptions.findFirst({
      where: eq(reward_redemptions.id, validatedData.redemption_id),
      with: {
        reward: true,
      },
    });

    if (!redemption) {
      throw new Error("Resgate não encontrado");
    }

    if (redemption.store_id !== validatedData.store_id) {
      throw new Error("Acesso negado");
    }

    const qrCodeData = {
      redemption_id: redemption.id,
      reward_id: redemption.reward_id,
      store_id: redemption.store_id,
      user_id: redemption.user_id,
      cost_points: redemption.cost_points,
      timestamp: Date.now(),
    };

    const qrCodeString = await QRCode.toString(JSON.stringify(qrCodeData), {
      type: "svg",
      width: 200,
      margin: 2,
    });

    const expiresAt = new Date();
    expiresAt.setDate(
      expiresAt.getDate() + (redemption.reward?.redemption_validity_days || 30)
    );

    const qrCodeRecord = await db
      .insert(reward_redemption_qr_codes)
      .values({
        redemption_id: redemption.id,
        qr_code: qrCodeString,
        expires_at: expiresAt,
      })
      .returning();

    await db
      .update(reward_redemptions)
      .set({
        qr_code: qrCodeString,
        status: "validated",
        validation_status: "pending",
        redeemed_at: new Date(),
      })
      .where(eq(reward_redemptions.id, redemption.id));

    return { success: true, data: qrCodeRecord[0] };
  } catch (error) {
    console.error("Erro ao criar QR code de resgate:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro interno",
    };
  }
}
