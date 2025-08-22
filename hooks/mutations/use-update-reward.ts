import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { updateReward } from "@/actions/rewards/update-reward";
import type { UpdateRewardInput } from "@/actions/rewards/schema";

export const useUpdateReward = (storeId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<UpdateRewardInput, "store_id">) =>
      updateReward({ ...data, store_id: storeId }),
    onSuccess: (result) => {
      if (result.success) {
        toast({
          title: "Sucesso!",
          description: result.message,
        });
        queryClient.invalidateQueries({ queryKey: ["rewards", storeId] });
        queryClient.invalidateQueries({ queryKey: ["rewards-stats", storeId] });
      } else {
        toast({
          title: "Erro",
          description: result.error || "Erro ao atualizar prêmio",
          variant: "destructive",
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar prêmio",
        variant: "destructive",
      });
    },
  });
};

export const updateRewardMutationKey = ["update-reward"];
