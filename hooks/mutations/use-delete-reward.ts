import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { deleteReward } from "@/actions/rewards/delete-reward";
import type { DeleteRewardInput } from "@/actions/rewards/schema";

export const useDeleteReward = (storeId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<DeleteRewardInput, "store_id">) =>
      deleteReward({ ...data, store_id: storeId }),
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
          description: result.error || "Erro ao excluir prêmio",
          variant: "destructive",
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao excluir prêmio",
        variant: "destructive",
      });
    },
  });
};

export const deleteRewardMutationKey = ["delete-reward"];
