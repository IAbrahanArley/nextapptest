import { NextRequest, NextResponse } from "next/server";
import { updatePointsRules } from "@/actions/store-config/update-points-rules";
import { getStoreData } from "@/actions/store-config/get-store-data";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case "test-update-points":
        const result = await updatePointsRules({
          storeId: "test-store-id",
          points_per_currency_unit: 2.5,
          min_purchase_value_to_award: 10.5,
          points_validity_days: 180,
        });
        return NextResponse.json(result);

      case "test-get-store-data":
        const storeData = await getStoreData({
          storeId: "test-store-id",
        });
        return NextResponse.json(storeData);

      default:
        return NextResponse.json(
          { error: "Ação não reconhecida" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Erro no teste:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}








