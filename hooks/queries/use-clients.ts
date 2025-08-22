import { useQuery } from "@tanstack/react-query";
import { getClients } from "@/actions/clients/get-clients";

export const useClients = (storeId: string) => {
  return useQuery({
    queryKey: getClientsQueryKey(storeId),
    queryFn: () => getClients(storeId),
    enabled: !!storeId,
  });
};

export const getClientsQueryKey = (storeId: string) => ["clients", storeId];

