import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import type { CreateClientInput } from "@/actions/clients/schema";
import { createClient } from "@/actions/clients/create-client";

const createClientMutationFn = async ({
  data,
  storeId,
}: {
  data: CreateClientInput;
  storeId: string;
}) => {
  return await createClient(data, storeId);
};

export const useCreateClient = (storeId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createClientMutationFn,
    onSuccess: () => {
      toast({
        title: "Sucesso!",
        description: "Cliente criado com sucesso",
      });
      queryClient.invalidateQueries({ queryKey: getClientsQueryKey(storeId) });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar cliente",
        variant: "destructive",
      });
    },
  });
};

export const createClientMutationKey = ["create-client"];

// Função auxiliar para gerar a query key
export const getClientsQueryKey = (storeId: string) => ["clients", storeId];
