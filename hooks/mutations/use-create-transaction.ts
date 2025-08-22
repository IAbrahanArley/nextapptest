import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createTransaction,
  type CreateTransactionInput,
} from "@/actions/transactions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const router = useRouter();

  return useMutation({
    mutationFn: createTransaction,
    onSuccess: (data) => {
      toast({
        title: "Transação criada com sucesso!",
        description: `${data.pointsAwarded} pontos foram atribuídos.`,
      });

      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["transactions-stats"] });
      queryClient.invalidateQueries({ queryKey: ["clients"] });

      router.push("/dashboard-loja/transacoes");
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar transação",
        description: error.message || "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    },
  });
}
