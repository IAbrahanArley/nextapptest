import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { deleteClient } from "@/actions/clients/delete-client";
import { getClientsQueryKey } from "./use-create-client";

const deleteClientMutationFn = async ({
  clientId,
  storeId,
}: {
  clientId: string;
  storeId: string;
}) => {
  return await deleteClient(clientId, storeId);
};

export const useDeleteClient = (storeId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteClientMutationFn,
    onSuccess: () => {
      toast({
        title: "Sucesso!",
        description: "Cliente removido com sucesso",
      });
      queryClient.invalidateQueries({ queryKey: getClientsQueryKey(storeId) });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao remover cliente",
        variant: "destructive",
      });
    },
  });
};

export const deleteClientMutationKey = ["delete-client"];

