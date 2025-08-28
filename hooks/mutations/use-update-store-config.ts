import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateStoreConfig } from "@/actions/store-config/update-store-data";
import { StoreConfigFormData } from "@/actions/store-config/schema";

export const useUpdateStoreConfig = (storeId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: StoreConfigFormData) =>
      updateStoreConfig({ storeId, ...data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["store-config", storeId] });
      queryClient.invalidateQueries({ queryKey: ["store-data", storeId] });
    },
  });
};
