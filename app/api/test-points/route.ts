import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { pending_points } from "@/lib/db/schema";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { cpf, points, storeId } = body;

    if (!cpf || !points || !storeId) {
      return NextResponse.json(
        { error: "CPF, pontos e storeId são obrigatórios" },
        { status: 400 }
      );
    }

    // Criar pontos pendentes
    const [newPendingPoints] = await db
      .insert(pending_points)
      .values({
        cpf: cpf.replace(/\D/g, ""),
        store_id: storeId,
        amount: points,
        migrated: false,
      })
      .returning();

    return NextResponse.json({
      success: true,
      message: "Pontos pendentes criados com sucesso",
      data: newPendingPoints,
    });
  } catch (error) {
    console.error("Erro ao criar pontos pendentes:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}



