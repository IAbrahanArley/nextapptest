import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createStore } from "@/actions/store-config/create-store";
import type { CreateStoreInput } from "@/actions/store-config/create-store";

export const useCreateStore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateStoreInput) => createStore(data),
    onSuccess: (result) => {
      if (result.success) {
        // Invalidar queries relacionadas à loja
        queryClient.invalidateQueries({ queryKey: ["store-id"] });
        queryClient.invalidateQueries({ queryKey: ["store-data"] });
      }
    },
  });
};

export const createStoreMutationKey = ["create-store"];
