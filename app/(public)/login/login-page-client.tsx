"use client";
import { useSearchParams } from "next/navigation";
import { UserRole } from "@/types/auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Store, Users } from "lucide-react";
import LoginForm from "@/components/auth/login-form";
import ClientLoginForm from "@/components/auth/client-login-form";
import { useEffect, useState } from "react";

export default function LoginPageClient() {
  const searchParams = useSearchParams();
  const [userType, setUserType] = useState<UserRole>("customer");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const type = (searchParams.get("type") as UserRole) || "customer";
    setUserType(type);
    setIsMounted(true);
  }, [searchParams]);

  // Não renderizar nada até que o componente esteja montado no cliente
  if (!isMounted) {
    return (
      <div className="w-full">
        <div className="grid w-full grid-cols-2 mb-6">
          <div className="flex items-center justify-center gap-2 p-3 bg-muted rounded-md">
            <Store className="h-4 w-4" />
            Loja
          </div>
          <div className="flex items-center justify-center gap-2 p-3 bg-muted rounded-md">
            <Users className="h-4 w-4" />
            Cliente
          </div>
        </div>
        <div className="mt-6">
          <div className="animate-pulse">
            <div className="h-10 bg-muted rounded-md mb-4"></div>
            <div className="h-10 bg-muted rounded-md mb-4"></div>
            <div className="h-10 bg-muted rounded-md"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Tabs value={userType} className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="merchant" asChild>
          <a href="/login?type=merchant" className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            Loja
          </a>
        </TabsTrigger>
        <TabsTrigger value="customer" asChild>
          <a href="/login?type=customer" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Cliente
          </a>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="merchant">
        <LoginForm userType="merchant" />
      </TabsContent>
      <TabsContent value="customer">
        <ClientLoginForm />
      </TabsContent>
    </Tabs>
  );
}
