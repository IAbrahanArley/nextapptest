import { useQuery } from "@tanstack/react-query";
import { getClient } from "@/actions/clients/get-client";

export const useClient = (clientId: string, storeId: string) => {
  return useQuery({
    queryKey: getClientQueryKey(clientId, storeId),
    queryFn: () => getClient(clientId, storeId),
    enabled: !!clientId && !!storeId,
  });
};

export const getClientQueryKey = (clientId: string, storeId: string) => [
  "client",
  clientId,
  storeId,
];

