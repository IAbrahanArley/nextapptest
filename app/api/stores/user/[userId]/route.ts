import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { stores, store_settings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;

    let store = await db.query.stores.findFirst({
      where: eq(stores.owner_id, userId),
    });

    // Se não existir loja, criar uma padrão
    if (!store) {
      const newStore = await db
        .insert(stores)
        .values({
          owner_id: userId,
          name: "Minha Loja",
          slug: `loja-${userId.slice(0, 8)}`,
          description: "Descrição da minha loja",
          currency: "BRL",
        })
        .returning();

      store = newStore[0];

      // Criar configurações padrão da loja
      await db.insert(store_settings).values({
        store_id: store.id,
        points_per_currency_unit: 1,
        min_purchase_value_to_award: 0,
        points_validity_days: 365,
        notification_whatsapp: false,
        notification_email: false,
        notification_expiration: false,
      });
    }

    return NextResponse.json({ store });
  } catch (error) {
    console.error("Erro ao buscar/criar loja:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
