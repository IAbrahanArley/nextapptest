import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, action } = body;

    if (!email || !action) {
      return NextResponse.json(
        { error: "Email e ação são obrigatórios" },
        { status: 400 }
      );
    }

    if (action === "makeAdmin") {
      // Tornar usuário admin
      const result = await db
        .update(users)
        .set({ role: "admin" })
        .where(eq(users.email, email))
        .returning();

      if (result.length === 0) {
        return NextResponse.json(
          { error: "Usuário não encontrado" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: `Usuário ${email} agora é admin`,
        user: result[0],
      });
    }

    if (action === "checkRole") {
      // Verificar role do usuário
      const user = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.email, email),
      });

      if (!user) {
        return NextResponse.json(
          { error: "Usuário não encontrado" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        user: {
          email: user.email,
          name: user.name,
          role: user.role,
        },
      });
    }

    return NextResponse.json({ error: "Ação inválida" }, { status: 400 });
  } catch (error) {
    console.error("Erro ao configurar admin:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}


