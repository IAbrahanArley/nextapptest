import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRedemptionQr } from "@/actions/rewards/create-redemption-qr";
import { toast } from "sonner";

export function useCreateRedemptionQr() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRedemptionQr,
    onSuccess: (data) => {
      if (data.success) {
        toast.success("QR code gerado com sucesso!");
        queryClient.invalidateQueries({ queryKey: ["reward-redemptions"] });
      } else {
        toast.error(data.error || "Erro ao gerar QR code");
      }
    },
    onError: (error) => {
      console.error("Erro ao gerar QR code:", error);
      toast.error("Erro interno ao gerar QR code");
    },
  });
}
