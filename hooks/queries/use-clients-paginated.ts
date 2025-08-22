import { useQuery } from "@tanstack/react-query";
import { getClients } from "@/actions/clients";
import { useStoreConfig } from "./use-store-config";
import { getPlanById } from "@/lib/plans";

export interface UseClientsPaginatedInput {
  page?: number;
  limit?: number;
  search?: string;
}

export function useClientsPaginated(input: UseClientsPaginatedInput = {}) {
  const { data: storeConfig } = useStoreConfig();
  const { page = 1, limit = 20, search } = input;

  return useQuery({
    queryKey: ["clients-paginated", { page, limit, search }],
    queryFn: async () => {
      if (!storeConfig?.storeId) {
        return { clients: [], total: 0, totalPages: 0, currentPage: page };
      }

      const clients = await getClients(storeConfig.storeId);

      let filteredClients = clients;
      if (search) {
        filteredClients = clients.filter(
          (client) =>
            client.name?.toLowerCase().includes(search.toLowerCase()) ||
            client.email?.toLowerCase().includes(search.toLowerCase()) ||
            client.cpf?.includes(search)
        );
      }

      const total = filteredClients.length;
      const totalPages = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedClients = filteredClients.slice(startIndex, endIndex);

      return {
        clients: paginatedClients,
        total,
        totalPages,
        currentPage: page,
      };
    },
    enabled: !!storeConfig?.storeId,
    staleTime: 1000 * 60 * 5,
  });
}
