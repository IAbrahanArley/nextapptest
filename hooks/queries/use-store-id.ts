import { useQuery } from "@tanstack/react-query";
import { getStoreId } from "@/actions/store-config/get-store-id";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect, useCallback } from "react";

export const storeIdQueryKey = (userId: string) => ["store-id", userId];

export function useStoreId() {
  const { user } = useAuth();
  const router = useRouter();

  const result = useQuery({
    queryKey: storeIdQueryKey(user?.id || ""),
    queryFn: () => getStoreId({ userId: user?.id || "" }),
    enabled: !!user?.id,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Redirecionar para setup se não encontrar loja
  const handleRedirect = useCallback(() => {
    if (
      !result.isLoading &&
      !result.isError &&
      result.data &&
      !result.data.success &&
      result.data.message === "Loja não encontrada para este usuário"
    ) {
      router.push("/dashboard-loja/setup");
    }
  }, [result, router]);

  useEffect(() => {
    handleRedirect();
  }, [handleRedirect]);

  return result;
}
