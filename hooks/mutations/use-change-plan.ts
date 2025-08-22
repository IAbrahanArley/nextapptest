import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface ChangePlanParams {
  newPlanId: string;
}

async function changePlan(params: ChangePlanParams) {
  const response = await fetch("/api/stripe/subscription/change-plan", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Falha ao alterar plano");
  }

  return response.json();
}

export function useChangePlan() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: changePlan,
    onSuccess: (data) => {
      toast({
        title: "Sucesso!",
        description: data.message,
      });

      // Invalidar queries relacionadas à assinatura
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
      queryClient.invalidateQueries({ queryKey: ["subscription-usage"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}



