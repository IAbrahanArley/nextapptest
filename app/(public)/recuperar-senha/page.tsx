"use client";

import { ForgotPasswordForm } from "@/components/auth/forgot-password";
import AuthSidePanel from "@/components/auth/auth-side-panel";
import { useIsMobile } from "@/hooks/use-mobile";

type UserType = "customer" | "merchant";

export default function ForgotPasswordPage() {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen flex">
      {/* Lado esquerdo - Formulário */}
      <div
        className={`${
          isMobile ? "w-full" : "w-1/3"
        } flex items-center justify-center p-8`}
      >
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Recuperar Senha
            </h1>
            <p className="text-gray-600">
              Digite seu email para receber instruções de recuperação
            </p>
          </div>

          <ForgotPasswordForm userType="customer" />
        </div>
      </div>

      {/* Lado direito - Painel lateral (oculto no mobile) */}
      {!isMobile && <AuthSidePanel />}
    </div>
  );
}
