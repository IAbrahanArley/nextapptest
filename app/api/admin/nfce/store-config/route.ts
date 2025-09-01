import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { store_settings, stores } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const storeId = searchParams.get("storeId");

    if (!storeId) {
      return NextResponse.json(
        {
          success: false,
          error: "ID da loja é obrigatório",
          message: "ID da loja é obrigatório",
        },
        { status: 400 }
      );
    }

    // Buscar configurações da loja
    const storeConfig = await db.query.store_settings.findFirst({
      where: (settings, { eq }) => eq(settings.store_id, storeId),
    });

    // Buscar informações básicas da loja
    const store = await db.query.stores.findFirst({
      where: (stores, { eq }) => eq(stores.id, storeId),
    });

    if (!store) {
      return NextResponse.json(
        {
          success: false,
          error: "Loja não encontrada",
          message: "Loja não encontrada",
        },
        { status: 404 }
      );
    }

    // Configurações padrão se não existirem
    const defaultConfig = {
      points_per_currency_unit: "1",
      min_purchase_value_to_award: "0",
      points_validity_days: 365,
    };

    const config = storeConfig || defaultConfig;

    // Calcular exemplo de pontuação
    const exampleValues = [10, 25, 50, 100, 200];
    const pointsExamples = exampleValues.map((valor) => {
      const pointsPerCurrency = Number(config.points_per_currency_unit) || 1;
      const minValue = Number(config.min_purchase_value_to_award) || 0;

      if (valor < minValue) {
        return { valor, pontos: 0, motivo: "Abaixo do valor mínimo" };
      }

      const pontos = Math.floor(valor * pointsPerCurrency);
      return {
        valor,
        pontos,
        motivo: `${pointsPerCurrency} ponto(s) por R$ 1,00`,
      };
    });

    const response = {
      success: true,
      data: {
        store: {
          id: store.id,
          name: store.name,
          cnpj: store.cnpj,
        },
        config: {
          points_per_currency_unit:
            Number(config.points_per_currency_unit) || 1,
          min_purchase_value_to_award:
            Number(config.min_purchase_value_to_award) || 0,
          points_validity_days: config.points_validity_days || 365,
          hasCustomConfig: !!storeConfig,
        },
        examples: pointsExamples,
        formula: {
          description: `Pontos = Valor da Compra × ${
            config.points_per_currency_unit || 1
          }`,
          minValueNote:
            config.min_purchase_value_to_award > 0
              ? `Apenas compras acima de R$ ${Number(
                  config.min_purchase_value_to_award
                ).toFixed(2)} geram pontos`
              : "Todas as compras geram pontos",
        },
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("❌ Erro ao buscar configurações da loja:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Erro interno do servidor",
        message: "Erro interno do servidor",
      },
      { status: 500 }
    );
  }
}




