import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import type { UpdateClientInput } from "@/actions/clients/schema";
import { updateClient } from "@/actions/clients/update-client";
import { getClientsQueryKey } from "./use-create-client";

const updateClientMutationFn = async ({
  data,
  storeId,
}: {
  data: UpdateClientInput;
  storeId: string;
}) => {
  return await updateClient(data, storeId);
};

export const useUpdateClient = (storeId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateClientMutationFn,
    onSuccess: () => {
      toast({
        title: "Sucesso!",
        description: "Cliente atualizado com sucesso",
      });
      queryClient.invalidateQueries({ queryKey: getClientsQueryKey(storeId) });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar cliente",
        variant: "destructive",
      });
    },
  });
};

export const updateClientMutationKey = ["update-client"];

