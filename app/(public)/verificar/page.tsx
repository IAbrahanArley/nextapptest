"use client";

import { Suspense } from "react";
import VerifyAccountForm from "@/components/auth/verify-account";
import VerifyAccountClient from "./verificar-client";
import AuthSidePanel from "@/components/auth/auth-side-panel";
import { useIsMobile } from "@/hooks/use-mobile";

export default function VerifyAccountPage() {
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
              Verificar Conta
            </h1>
            <p className="text-gray-600">
              Digite o código de verificação enviado para seu email
            </p>
          </div>

          <Suspense fallback={<div>Carregando...</div>}>
            <VerifyAccountClient />
          </Suspense>
        </div>
      </div>

      {/* Lado direito - Painel lateral (oculto no mobile) */}
      {!isMobile && <AuthSidePanel />}
    </div>
  );
}
