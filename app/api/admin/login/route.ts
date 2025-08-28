import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "admin-secret-key-change-in-production";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email e senha são obrigatórios" },
        { status: 400 }
      );
    }

    // Buscar usuário no banco
    const user = await db.query.users.findFirst({
      where: (users, { eq, and }) =>
        and(eq(users.email, email), eq(users.role, "admin")),
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado ou não é administrador" },
        { status: 401 }
      );
    }

    // Verificar senha (se tiver password_hash)
    if (user.password_hash) {
      const isValidPassword = await bcrypt.compare(
        password,
        user.password_hash
      );
      if (!isValidPassword) {
        return NextResponse.json({ error: "Senha incorreta" }, { status: 401 });
      }
    } else {
      // Se não tiver senha cadastrada, permitir acesso com qualquer senha (temporário)
      console.log("⚠️ Usuário admin sem senha cadastrada - permitindo acesso");
    }

    // Gerar token JWT
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Retornar dados do usuário (sem senha)
    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    return NextResponse.json({
      success: true,
      message: "Login realizado com sucesso",
      user: userData,
      token,
    });
  } catch (error) {
    console.error("Erro no login admin:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}


