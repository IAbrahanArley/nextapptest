"use server";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import bcrypt from "bcryptjs";

// Schema de validação para troca de senha
const changePasswordSchema = z
  .object({
    userId: z.string().min(1, "ID do usuário é obrigatório"),
    currentPassword: z.string().min(1, "Senha atual é obrigatória"),
    newPassword: z
      .string()
      .min(6, "Nova senha deve ter pelo menos 6 caracteres")
      .max(128, "Nova senha deve ter no máximo 128 caracteres")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Nova senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número"
      ),
    confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

export async function changePassword(input: ChangePasswordInput) {
  try {
    // Validar input
    const validatedData = changePasswordSchema.parse(input);

    // Buscar usuário
    const user = await db.query.users.findFirst({
      where: eq(users.id, validatedData.userId),
    });

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    if (!user.password_hash) {
      throw new Error("Usuário não possui senha configurada");
    }

    // Verificar senha atual
    const isCurrentPasswordValid = await bcrypt.compare(
      validatedData.currentPassword,
      user.password_hash
    );

    if (!isCurrentPasswordValid) {
      return {
        success: false,
        message: "Senha atual incorreta",
      };
    }

    // Verificar se a nova senha é diferente da atual
    const isNewPasswordSame = await bcrypt.compare(
      validatedData.newPassword,
      user.password_hash
    );

    if (isNewPasswordSame) {
      return {
        success: false,
        message: "A nova senha deve ser diferente da senha atual",
      };
    }

    // Hash da nova senha
    const saltRounds = 12;
    const newPasswordHash = await bcrypt.hash(
      validatedData.newPassword,
      saltRounds
    );

    // Atualizar senha no banco
    await db
      .update(users)
      .set({
        password_hash: newPasswordHash,
        updated_at: new Date(),
      })
      .where(eq(users.id, validatedData.userId));

    // Revalidar cache
    revalidatePath("/dashboard-loja/configuracoes");

    return {
      success: true,
      message: "Senha alterada com sucesso",
    };
  } catch (error) {
    console.error("Erro ao alterar senha:", error);

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








