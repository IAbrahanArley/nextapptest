"use server";

import { db } from "@/lib/db";
import { users, user_store_balances } from "@/lib/db/schema";
import { createClientSchema, type CreateClientInput } from "./schema";
import { eq, and } from "drizzle-orm";
import { sendWelcomeEmail, generateTemporaryPassword } from "@/lib/email";
import * as bcrypt from "bcryptjs";

export async function createClient(data: CreateClientInput, storeId: string) {
  try {
    const validatedData = createClientSchema.parse(data);

    let userId: string;
    let isNewUser = false;
    let existingUserByEmail = null;
    let existingUserByCpf = null;

    if (validatedData.email && validatedData.email.trim() !== "") {
      existingUserByEmail = await db
        .select()
        .from(users)
        .where(eq(users.email, validatedData.email))
        .limit(1);
    }

    existingUserByCpf = await db
      .select()
      .from(users)
      .where(eq(users.cpf, validatedData.cpf))
      .limit(1);

    if (existingUserByEmail && existingUserByEmail.length > 0) {
      userId = existingUserByEmail[0].id;

      await db
        .update(users)
        .set({
          name: validatedData.name,
          phone: validatedData.phone,
          updated_at: new Date(),
        })
        .where(eq(users.id, userId));

      return {
        success: false,
        error: "Cliente já cadastrado com este email",
        isExistingUser: true,
      };
    } else if (existingUserByCpf && existingUserByCpf.length > 0) {
      userId = existingUserByCpf[0].id;

      await db
        .update(users)
        .set({
          name: validatedData.name,
          phone: validatedData.phone,
          email: validatedData.email || existingUserByCpf[0].email,
          updated_at: new Date(),
        })
        .where(eq(users.id, userId));

      return {
        success: false,
        error: "Cliente já cadastrado com este CPF",
        isExistingUser: true,
      };
    } else {
      // Criar novo usuário
      const temporaryPassword = generateTemporaryPassword();
      console.log("🔧 [CLIENTE] Senha temporária gerada:", temporaryPassword); // DEBUG

      const hashedPassword = await bcrypt.hash(temporaryPassword, 12);
      console.log(
        "🔧 [CLIENTE] Hash da senha gerado:",
        hashedPassword.substring(0, 20) + "..."
      ); // DEBUG

      // Teste de verificação da senha
      const testVerification = await bcrypt.compare(
        temporaryPassword,
        hashedPassword
      );
      console.log(
        "🔧 [CLIENTE] Teste de verificação da senha:",
        testVerification
      ); // DEBUG

      const [newUser] = await db
        .insert(users)
        .values({
          name: validatedData.name,
          phone: validatedData.phone,
          email: validatedData.email || `sem-email-${Date.now()}@temp.com`,
          cpf: validatedData.cpf,
          role: "customer",
          password_hash: hashedPassword,
        })
        .returning({ id: users.id });

      userId = newUser.id;
      isNewUser = true;

      // Enviar email de boas-vindas com senha temporária (se email fornecido)
      if (validatedData.email && validatedData.email.trim() !== "") {
        console.log(
          "🔧 [CLIENTE] Tentando enviar email para:",
          validatedData.email
        );
        try {
          const emailResult = await sendWelcomeEmail(
            validatedData.email,
            validatedData.name,
            temporaryPassword
          );
          console.log("🔧 [CLIENTE] Resultado do email:", emailResult);
        } catch (emailError) {
          console.error(
            "❌ [CLIENTE] Erro ao enviar email de boas-vindas:",
            emailError
          );
          // Não falhar a criação do cliente se o email falhar
        }
      } else {
        console.log(
          "🔧 [CLIENTE] Cliente criado sem email, não será enviado email"
        );
      }
    }

    const existingBalance = await db
      .select()
      .from(user_store_balances)
      .where(
        and(
          eq(user_store_balances.user_id, userId),
          eq(user_store_balances.store_id, storeId)
        )
      )
      .limit(1);

    if (existingBalance.length === 0) {
      await db.insert(user_store_balances).values({
        user_id: userId,
        store_id: storeId,
        points: 0,
        reserved_points: 0,
      });
    }

    if (isNewUser) {
      return {
        success: true,
        data: {
          userId,
          message:
            "Cliente criado com sucesso! Senha temporária enviada por email.",
          isNewUser: true,
        },
      };
    } else {
      return {
        success: true,
        data: {
          userId,
          message: "Cliente atualizado com sucesso",
          isNewUser: false,
        },
      };
    }
  } catch (error) {
    console.error("Erro ao criar cliente:", error);

    if (
      error instanceof Error &&
      error.message.includes("duplicate key value violates unique constraint")
    ) {
      if (error.message.includes("users_email_unique")) {
        return {
          success: false,
          error: "Cliente já cadastrado com este email",
          isExistingUser: true,
        };
      }
    }

    return {
      success: false,
      error: "Erro interno ao criar cliente",
    };
  }
}
