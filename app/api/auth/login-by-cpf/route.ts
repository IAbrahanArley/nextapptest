import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { cpf, password } = body;

    if (!cpf || !password) {
      return NextResponse.json(
        { error: "CPF e senha são obrigatórios" },
        { status: 400 }
      );
    }

    // Buscar usuário por CPF
    const user = await db.query.users.findFirst({
      where: eq(users.cpf, cpf),
    });

    if (!user) {
      return NextResponse.json(
        { error: "CPF não encontrado" },
        { status: 404 }
      );
    }

    if (user.role !== "customer") {
      return NextResponse.json(
        { error: "Este CPF não pertence a um cliente" },
        { status: 403 }
      );
    }

    // Verificar se o usuário tem senha (não é apenas OAuth)
    if (!user.password_hash) {
      return NextResponse.json(
        {
          error: "Este usuário não possui senha cadastrada. Use login social.",
        },
        { status: 400 }
      );
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Senha incorreta" }, { status: 401 });
    }

    // Retornar sucesso - o login será feito pelo cliente usando NextAuth
    return NextResponse.json({
      success: true,
      message: "Login realizado com sucesso",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Erro no login por CPF:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
