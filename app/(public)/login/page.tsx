"use client";
import { Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Store, Users } from "lucide-react";
import LoginForm from "@/components/auth/login-form";
import LoginPageClient from "./login-page-client";
import AuthSidePanel from "@/components/auth/auth-side-panel";
import { useIsMobile } from "@/hooks/use-mobile";

export default function LoginPage() {
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
          <Suspense fallback={<div>Carregando...</div>}>
            <LoginPageClient />
          </Suspense>
        </div>
      </div>

      {/* Lado direito - Painel lateral (oculto no mobile) */}
      {!isMobile && <AuthSidePanel />}
    </div>
  );
}
