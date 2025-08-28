import { useMutation, useQueryClient } from "@tanstack/react-query";
import { migratePointsForExistingUser } from "@/actions/clients";
import { useToast } from "@/hooks/use-toast";

export function useMigratePointsForExistingUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: migratePointsForExistingUser,
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "Pontos migrados com sucesso!",
          description: `${data.pointsMigrated} pontos foram migrados de ${
            data.storesMigrated
          } lojas para ${data.userInfo?.name || "o usuário"}.`,
        });

        // Invalidar queries relacionadas
        queryClient.invalidateQueries({ queryKey: ["clients"] });
        queryClient.invalidateQueries({ queryKey: ["transactions"] });
        queryClient.invalidateQueries({ queryKey: ["transactions-stats"] });
      } else {
        toast({
          title: "Nenhum ponto migrado",
          description: data.message,
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Erro ao migrar pontos",
        description: error.message || "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    },
  });
}




