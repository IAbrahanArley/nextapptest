import { useQuery } from "@tanstack/react-query";
import {
  getStoreData,
  GetStoreDataInput,
} from "@/actions/store-config/get-store-data";

export const storeDataQueryKey = (storeId: string) => ["store-data", storeId];

export function useStoreData(storeId: string) {
  return useQuery({
    queryKey: storeDataQueryKey(storeId),
    queryFn: () => getStoreData({ storeId }),
    enabled: !!storeId,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
}




