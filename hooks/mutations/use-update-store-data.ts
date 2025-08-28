import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateStoreData,
  UpdateStoreDataInput,
} from "@/actions/store-config/update-store-data";
import { storeDataQueryKey } from "@/hooks/queries/use-store-data";
import { useToast } from "@/hooks/use-toast";

export const updateStoreDataMutationKey = () => ["update-store-data"];

export function useUpdateStoreData() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationKey: updateStoreDataMutationKey(),
    mutationFn: (input: UpdateStoreDataInput) => updateStoreData(input),
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "Sucesso!",
          description: data.message,
        });

        // Invalidar queries relacionadas
        queryClient.invalidateQueries({
          queryKey: ["store-data"],
        });
      } else {
        toast({
          title: "Erro",
          description: data.message,
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      console.error("Erro na mutação:", error);
      toast({
        title: "Erro",
        description: "Erro interno do servidor",
        variant: "destructive",
      });
    },
  });
}








