import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface ValidateRedemptionData {
  qr_code?: string;
  verification_code?: string;
  store_id: string;
  store_validation_metadata?: {
    validated_by: string;
    validation_location?: string;
    notes?: string;
  };
}

export function useValidateRedemption() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ValidateRedemptionData) => {
      const response = await fetch("/api/stores/validate-redemption", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao validar resgate");
      }

      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Resgate validado com sucesso!");
        queryClient.invalidateQueries({ queryKey: ["reward-redemptions"] });
        queryClient.invalidateQueries({ queryKey: ["rewards"] });
      } else {
        toast.error(data.error || "Erro ao validar resgate");
      }
    },
    onError: (error) => {
      console.error("Erro ao validar resgate:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Erro interno ao validar resgate"
      );
    },
  });
}
