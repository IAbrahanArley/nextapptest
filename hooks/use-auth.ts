"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { UserRole, LoginCredentials } from "@/types/auth";
import { useToast } from "@/hooks/use-toast";
import { useCallback } from "react";

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        const result = await signIn("credentials", {
          email: credentials.email,
          password: credentials.password,
          userType: credentials.userType,
          redirect: false,
        });

        if (result?.error) {
          toast({
            title: "Erro no login",
            description: "Credenciais inválidas",
            variant: "destructive",
          });
          return false;
        }

        toast({
          title: "Login realizado com sucesso!",
          description: "Redirecionando...",
        });

        const redirectPath =
          credentials.userType === "merchant" ? "/dashboard-loja" : "/cliente";

        router.push(redirectPath);
        return true;
      } catch (error) {
        toast({
          title: "Erro",
          description: "Ocorreu um erro inesperado",
          variant: "destructive",
        });
        return false;
      }
    },
    [router, toast]
  );

  const loginWithGoogle = useCallback(
    async (userType: UserRole) => {
      try {
        const result = await signIn("google", {
          callbackUrl: userType === "merchant" ? "/dashboard-loja" : "/cliente",
          redirect: false,
        });

        if (result?.error) {
          toast({
            title: "Erro no login",
            description: "Erro ao fazer login com Google",
            variant: "destructive",
          });
          return false;
        }

        return true;
      } catch (error) {
        toast({
          title: "Erro",
          description: "Ocorreu um erro inesperado",
          variant: "destructive",
        });
        return false;
      }
    },
    [toast]
  );

  const logout = useCallback(async () => {
    try {
      await signOut({
        redirect: false,
      });

      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso",
      });

      router.push("/");
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao fazer logout",
        variant: "destructive",
      });
    }
  }, [router, toast]);

  return {
    user: session?.user,
    status,
    login,
    loginWithGoogle,
    logout,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
  };
}
