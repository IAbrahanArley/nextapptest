import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface CancelSubscriptionParams {
  cancelAtPeriodEnd?: boolean;
}

async function cancelSubscription(params: CancelSubscriptionParams) {
  const response = await fetch("/api/stripe/subscription/cancel", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Falha ao cancelar assinatura");
  }

  return response.json();
}

export function useCancelSubscription() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: cancelSubscription,
    onSuccess: (data) => {
      toast({
        title: "Sucesso!",
        description: data.message,
      });

      // Invalidar queries relacionadas à assinatura
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
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



