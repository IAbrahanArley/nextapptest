"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import RegisterForm from "@/components/auth/register-form";
import ClientRegisterForm from "@/components/auth/client-register-form";
import { UserRole } from "@/types/auth";
import AuthSidePanel from "@/components/auth/auth-side-panel";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function CadastroPage() {
  const searchParams = useSearchParams();
  const [userType, setUserType] = useState<UserRole>("customer");
  const [isMounted, setIsMounted] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const type = (searchParams.get("type") as UserRole) || "customer";
    setUserType(type);
    setIsMounted(true);
  }, [searchParams]);

  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <div className="min-h-screen flex">
        {/* Lado esquerdo - Formulário */}
        <div
          className={`${
            isMobile ? "w-full" : "w-1/3"
          } flex items-center justify-center p-8`}
        >
          <div className="w-full max-w-md">
            {!isMounted ? (
              <div className="animate-pulse space-y-4">
                <div className="h-10 bg-muted rounded-md"></div>
                <div className="h-10 bg-muted rounded-md"></div>
                <div className="h-10 bg-muted rounded-md"></div>
                <div className="h-10 bg-muted rounded-md"></div>
              </div>
            ) : userType === "customer" ? (
              <ClientRegisterForm />
            ) : (
              <RegisterForm userType={userType} />
            )}
          </div>
        </div>

        {/* Lado direito - Painel lateral (oculto no mobile) */}
        {!isMobile && <AuthSidePanel />}
      </div>
    </Suspense>
  );
}
