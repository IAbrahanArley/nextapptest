import { useMutation } from "@tanstack/react-query";
import {
  changePassword,
  ChangePasswordInput,
} from "@/actions/store-config/change-password";
import { useToast } from "@/hooks/use-toast";

export const changePasswordMutationKey = () => ["change-password"];

export function useChangePassword() {
  const { toast } = useToast();

  return useMutation({
    mutationKey: changePasswordMutationKey(),
    mutationFn: (input: ChangePasswordInput) => changePassword(input),
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "Sucesso!",
          description: data.message,
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











