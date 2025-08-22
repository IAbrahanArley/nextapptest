"use server";

import { db } from "@/lib/db";
import { store_settings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function setupDefaultStoreSettings(storeId: string) {
  try {
    // Verificar se já existem configurações
    const existingSettings = await db
      .select()
      .from(store_settings)
      .where(eq(store_settings.store_id, storeId))
      .limit(1);

    if (existingSettings.length > 0) {
      console.log("🔧 Configurações já existem para a loja:", storeId);
      return { success: true, message: "Configurações já existem" };
    }

    // Criar configurações padrão
    const defaultSettings = {
      store_id: storeId,
      points_per_currency_unit: "1.00", // 1 ponto por R$ 1,00
      min_purchase_value_to_award: "0.00",
      points_validity_days: 365,
      notification_whatsapp: false,
      notification_email: false,
      notification_expiration: false,
      extras: null,
    };

    await db.insert(store_settings).values(defaultSettings);

    console.log("✅ Configurações padrão criadas para a loja:", storeId);
    return {
      success: true,
      message: "Configurações padrão criadas com sucesso",
    };
  } catch (error) {
    console.error("❌ Erro ao criar configurações padrão:", error);
    return {
      success: false,
      message: "Erro ao criar configurações padrão",
    };
  }
}
