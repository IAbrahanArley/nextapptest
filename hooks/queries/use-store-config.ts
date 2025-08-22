import { useQuery } from "@tanstack/react-query";
import { getStoreData, getActiveSubscription } from "@/actions/store-config";
import { useStoreId } from "./use-store-id";

export interface StoreConfig {
  storeId: string;
  planId?: string;
  pointsPerCurrency: number;
  minPurchaseValue: number;
  pointsValidityDays: number;
}

export function useStoreConfig() {
  const { data: storeIdData } = useStoreId();
  const storeId = storeIdData?.data?.storeId;

  return useQuery({
    queryKey: ["store-config", storeId],
    queryFn: async () => {
      if (!storeId) return null;

      const [storeDataResult, subscriptionResult] = await Promise.all([
        getStoreData({ storeId }),
        getActiveSubscription(),
      ]);

      if (!storeDataResult.success || !storeDataResult.data) {
        throw new Error(
          storeDataResult.message || "Erro ao buscar configuração da loja"
        );
      }

      return {
        storeId,
        planId: subscriptionResult?.planId,
        pointsPerCurrency: storeDataResult.data.points.points_per_currency_unit,
        minPurchaseValue:
          storeDataResult.data.points.min_purchase_value_to_award,
        pointsValidityDays: storeDataResult.data.points.points_validity_days,
      } as StoreConfig;
    },
    enabled: !!storeId,
    staleTime: 1000 * 60 * 5,
  });
}
