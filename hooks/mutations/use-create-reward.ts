import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { createReward } from "@/actions/rewards/index";
import type { CreateRewardInput } from "@/actions/rewards/schema";

export const useCreateReward = (storeId: string) => {
  const queryClient = useQueryClient();

  console.log("=== DEBUG USE CREATE REWARD ===");
  console.log("storeId recebido:", storeId);
  console.log("queryClient:", queryClient);

  return useMutation({
    mutationFn: (data: Omit<CreateRewardInput, "store_id">) => {
      console.log("=== DEBUG MUTATION FUNCTION ===");
      console.log("data recebida:", data);
      console.log("storeId:", storeId);
      console.log("payload completo:", { ...data, store_id: storeId });

      return createReward({ ...data, store_id: storeId });
    },
    onSuccess: (result) => {
      console.log("=== DEBUG MUTATION SUCCESS ===");
      console.log("result:", result);

      if (result.success) {
        console.log("SUCESSO: Prêmio criado com sucesso!");
        toast({
          title: "Sucesso!",
          description: result.message,
        });
        queryClient.invalidateQueries({ queryKey: ["rewards", storeId] });
        queryClient.invalidateQueries({ queryKey: ["rewards-stats", storeId] });
      } else {
        console.log("ERRO na mutation (onSuccess):", result.error);
        toast({
          title: "Erro",
          description: result.error || "Erro ao criar prêmio",
          variant: "destructive",
        });
      }
    },
    onError: (error: Error) => {
      console.log("=== DEBUG MUTATION ERROR ===");
      console.log("error:", error);
      console.log("error.message:", error.message);
      console.log("error.stack:", error.stack);

      toast({
        title: "Erro",
        description: error.message || "Erro ao criar prêmio",
        variant: "destructive",
      });
    },
    onMutate: (data) => {
      console.log("=== DEBUG MUTATION START ===");
      console.log("Iniciando mutation com data:", data);
    },
    onSettled: (data, error, variables, context) => {
      console.log("=== DEBUG MUTATION SETTLED ===");
      console.log("data:", data);
      console.log("error:", error);
      console.log("variables:", variables);
      console.log("context:", context);
    },
  });
};

export const createRewardMutationKey = ["create-reward"];
