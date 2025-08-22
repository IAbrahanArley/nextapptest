import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, userType, cpf, storeName, plan } = body;

    console.log("Dados recebidos na API:", {
      name,
      email,
      userType,
      cpf,
      plan,
      storeName,
    });

    // Validações específicas para clientes
    if (userType === "customer") {
      if (!cpf) {
        return NextResponse.json(
          { error: "CPF é obrigatório para clientes" },
          { status: 400 }
        );
      }

      // Validar formato do CPF (11 dígitos)
      const cleanCpf = cpf.replace(/\D/g, "");
      if (cleanCpf.length !== 11) {
        return NextResponse.json(
          { error: "CPF deve ter 11 dígitos numéricos" },
          { status: 400 }
        );
      }

      // Verificar se já existe usuário com este CPF
      const existingUserByCpf = await db.query.users.findFirst({
        where: eq(users.cpf, cleanCpf),
      });

      if (existingUserByCpf) {
        return NextResponse.json(
          { error: "Já existe um usuário cadastrado com este CPF" },
          { status: 400 }
        );
      }
    }

    // Verificar se o usuário já existe por email
    const existingUserByEmail = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUserByEmail) {
      return NextResponse.json(
        { error: "Usuário já existe com este email" },
        { status: 400 }
      );
    }

    // Hash da senha
    const passwordHash = await bcrypt.hash(password, 12);

    // Criar usuário
    const newUser = await db
      .insert(users)
      .values({
        name,
        email,
        password_hash: passwordHash,
        role: userType,
        cpf: userType === "customer" ? cpf.replace(/\D/g, "") : cpf,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning();

    const user = newUser[0];

    console.log("Usuário criado:", user);
    console.log("Tipo de usuário:", userType);
    console.log("Plano selecionado:", plan);

    // Se for lojista e tiver plano selecionado, redirecionar para Stripe
    if (userType === "merchant" && plan && plan !== "enterprise") {
      console.log("Redirecionando para Stripe com plano:", plan);
      // Redirecionar para checkout do Stripe
      return NextResponse.json({
        success: true,
        userId: user.id,
        redirectToStripe: true,
        plan,
        storeName,
      });
    }

    // Para clientes ou planos enterprise, retornar sucesso direto
    console.log("Cadastro direto - não redirecionando para Stripe");
    return NextResponse.json({
      success: true,
      userId: user.id,
      redirectToStripe: false,
    });
  } catch (error) {
    console.error("Erro no cadastro:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
