"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { UserRole, LoginCredentials } from "@/types/auth";
import { useToast } from "@/hooks/use-toast";

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  console.log("=== DEBUG USE AUTH ===");
  console.log("session:", session);
  console.log("status:", status);
  console.log("session?.user:", session?.user);
  console.log("session?.user?.id:", session?.user?.id);
  console.log("session?.user?.role:", session?.user?.role);

  const login = async (credentials: LoginCredentials) => {
    console.log("=== DEBUG LOGIN ===");
    console.log("Credentials:", credentials);

    try {
      const result = await signIn("credentials", {
        email: credentials.email,
        password: credentials.password,
        userType: credentials.userType,
        redirect: false,
      });

      console.log("SignIn result:", result);

      if (result?.error) {
        console.log("Erro no login:", result.error);
        toast({
          title: "Erro no login",
          description: "Credenciais inválidas",
          variant: "destructive",
        });
        return false;
      }

      console.log("Login bem-sucedido, redirecionando...");

      toast({
        title: "Login realizado com sucesso!",
        description: "Redirecionando...",
      });

      const redirectPath =
        credentials.userType === "merchant" ? "/dashboard-loja" : "/cliente";

      console.log("Redirecionando para:", redirectPath);
      router.push(redirectPath);
      return true;
    } catch (error) {
      console.error("Erro no login:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro inesperado",
        variant: "destructive",
      });
      return false;
    }
  };

  const loginWithGoogle = async (userType: UserRole) => {
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
  };

  const logout = async () => {
    try {
      console.log("=== DEBUG LOGOUT ===");
      console.log("Iniciando logout...");

      await signOut({
        redirect: false,
        callbackUrl: "/",
      });

      console.log("SignOut executado, aguardando limpeza da sessão...");

      // Aguarda um pouco para garantir que a sessão seja limpa
      await new Promise((resolve) => setTimeout(resolve, 200));

      console.log("Redirecionando para página inicial...");

      // Redireciona para a página inicial
      router.push("/");

      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso",
      });
    } catch (error) {
      console.error("Erro no logout:", error);
      toast({
        title: "Erro no logout",
        description: "Erro ao desconectar",
        variant: "destructive",
      });
    }
  };

  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";
  const user = session?.user;

  console.log("=== DEBUG USE AUTH RESULT ===");
  console.log("isAuthenticated:", isAuthenticated);
  console.log("isLoading:", isLoading);
  console.log("user final:", user);

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    loginWithGoogle,
    logout,
  };
}
