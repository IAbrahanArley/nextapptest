"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { UserRole, LoginCredentials } from "@/types/auth";
import { useToast } from "@/hooks/use-toast";
import { useCallback, useEffect } from "react";

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

  // Efeito para redirecionar quando a sessão for estabelecida
  useEffect(() => {
    console.log("=== DEBUG USE_EFFECT ===");
    console.log("Status mudou para:", status);
    console.log("Session mudou para:", session);

    if (status === "authenticated" && session?.user) {
      console.log("=== SESSÃO ESTABELECIDA ===");
      console.log("User:", session.user);
      console.log("Role:", session.user.role);

      // Verificar se já está na rota correta
      const currentPath = window.location.pathname;
      const expectedPath =
        session.user.role === "merchant" ? "/dashboard-loja" : "/cliente";

      console.log("Rota atual:", currentPath);
      console.log("Rota esperada:", expectedPath);

      // Só redirecionar se não estiver na rota correta
      if (!currentPath.startsWith(expectedPath)) {
        console.log("Redirecionando para:", expectedPath);
        setTimeout(() => {
          router.push(expectedPath);
        }, 100);
      } else {
        console.log("Usuário já está na rota correta, não redirecionando");
      }
    }
  }, [status, session, router]);

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
