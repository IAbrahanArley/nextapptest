import { NextResponse } from "next/server";
import { migratePendingPoints } from "@/actions/clients/migrate-pending-points";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { cpf, userId } = body;

    if (!cpf || !userId) {
      return NextResponse.json(
        { error: "CPF e userId são obrigatórios" },
        { status: 400 }
      );
    }

    // Migrar pontos pendentes
    const result = await migratePendingPoints({
      cpf: cpf.replace(/\D/g, ""),
      userId,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Erro ao migrar pontos:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}



