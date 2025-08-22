"use server";

import { db } from "@/lib/db";
import { stores, store_settings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const getStoreDataSchema = z.object({
  storeId: z.string().min(1, "ID da loja é obrigatório"),
});

export type GetStoreDataInput = z.infer<typeof getStoreDataSchema>;

export async function getStoreData(input: GetStoreDataInput) {
  try {
    // Validar input
    const validatedData = getStoreDataSchema.parse(input);

    // Buscar dados da loja
    const store = await db.query.stores.findFirst({
      where: eq(stores.id, validatedData.storeId),
    });

    if (!store) {
      return {
        success: false,
        message: "Loja não encontrada",
      };
    }

    // Buscar configurações da loja
    const storeSettings = await db.query.store_settings.findFirst({
      where: eq(store_settings.store_id, validatedData.storeId),
    });

    // Dados da loja
    const storeData = {
      id: store.id,
      name: store.name,
      description: store.description,
      cnpj: store.cnpj,
      email: store.email,
      phone: store.phone,
      address: store.address,
      website: store.website,
      instagram: store.instagram,
      facebook: store.facebook,
      whatsapp: store.whatsapp,
      profileImageUrl: store.banner_url,
    };

    // Configurações de pontuação - converter numeric para number
    const pointsData = storeSettings
      ? {
          points_per_currency_unit:
            Number(storeSettings.points_per_currency_unit) || 1,
          min_purchase_value_to_award:
            Number(storeSettings.min_purchase_value_to_award) || 0,
          points_validity_days: storeSettings.points_validity_days || 365,
        }
      : {
          points_per_currency_unit: 1,
          min_purchase_value_to_award: 0,
          points_validity_days: 365,
        };

    return {
      success: true,
      data: {
        store: storeData,
        points: pointsData,
      },
    };
  } catch (error) {
    console.error("Erro ao buscar dados da loja:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Dados inválidos",
        errors: error.errors,
      };
    }

    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Erro interno do servidor",
    };
  }
}
