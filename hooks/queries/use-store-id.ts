import { useQuery } from "@tanstack/react-query";
import { getStoreId } from "@/actions/store-config/get-store-id";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const storeIdQueryKey = (userId: string) => ["store-id", userId];

export function useStoreId() {
  const { user } = useAuth();
  const router = useRouter();

  console.log("=== DEBUG USE STORE ID ===");
  console.log("user:", user);
  console.log("user?.id:", user?.id);
  console.log("user?.role:", user?.role);
  console.log("user?.email:", user?.email);

  const result = useQuery({
    queryKey: storeIdQueryKey(user?.id || ""),
    queryFn: () => {
      console.log("=== DEBUG QUERY FUNCTION ===");
      console.log("Chamando getStoreId com userId:", user?.id || "");
      return getStoreId({ userId: user?.id || "" });
    },
    enabled: !!user?.id,
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Redirecionar para setup se não encontrar loja
  useEffect(() => {
    if (
      !result.isLoading &&
      !result.isError &&
      result.data &&
      !result.data.success &&
      result.data.message === "Loja não encontrada para este usuário"
    ) {
      console.log("Loja não encontrada, redirecionando para setup...");
      router.push("/dashboard-loja/setup");
    }
  }, [result, router]);

  console.log("=== DEBUG QUERY RESULT ===");
  console.log("result:", result);
  console.log("data:", result.data);
  console.log("isLoading:", result.isLoading);
  console.log("isError:", result.isError);
  console.log("error:", result.error);

  return result;
}
