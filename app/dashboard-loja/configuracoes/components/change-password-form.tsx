import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock } from "lucide-react";
import { useChangePassword } from "@/hooks/mutations/use-change-password";
import { useToast } from "@/hooks/use-toast";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Senha atual é obrigatória"),
    newPassword: z
      .string()
      .min(6, "Nova senha deve ter pelo menos 6 caracteres")
      .max(128, "Nova senha deve ter no máximo 128 caracteres")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Nova senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número"
      ),
    confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type PasswordForm = z.infer<typeof passwordSchema>;

interface ChangePasswordFormProps {
  onSuccess?: () => void;
}

export function ChangePasswordForm({ onSuccess }: ChangePasswordFormProps) {
  const { toast } = useToast();
  const changePasswordMutation = useChangePassword();

  const form = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: PasswordForm) => {
    try {
      await changePasswordMutation.mutateAsync({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast({
        title: "Sucesso",
        description: "Senha alterada com sucesso!",
      });
      form.reset();
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao alterar senha",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card className="shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <Lock className="h-5 w-5" />
            Alterar Senha
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Altere sua senha de acesso ao sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="currentPassword"
                className="text-gray-700 dark:text-gray-300"
              >
                Senha Atual *
              </Label>
              <Input
                id="currentPassword"
                type="password"
                {...form.register("currentPassword")}
                placeholder="Digite sua senha atual"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder:text-gray-400"
              />
              {form.formState.errors.currentPassword && (
                <p className="text-sm text-red-500 dark:text-red-400">
                  {form.formState.errors.currentPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="newPassword"
                className="text-gray-700 dark:text-gray-300"
              >
                Nova Senha *
              </Label>
              <Input
                id="newPassword"
                type="password"
                {...form.register("newPassword")}
                placeholder="Digite a nova senha"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder:text-gray-400"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Mínimo de 6 caracteres, deve conter maiúscula, minúscula e
                número
              </p>
              {form.formState.errors.newPassword && (
                <p className="text-sm text-red-500 dark:text-red-400">
                  {form.formState.errors.newPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-gray-700 dark:text-gray-300"
              >
                Confirmar Nova Senha *
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                {...form.register("confirmPassword")}
                placeholder="Confirme a nova senha"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder:text-gray-400"
              />
              {form.formState.errors.confirmPassword && (
                <p className="text-sm text-red-500 dark:text-red-400">
                  {form.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-950/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
              Requisitos da Senha
            </h4>
            <div className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
              <p>• Mínimo de 6 caracteres</p>
              <p>• Pelo menos uma letra maiúscula</p>
              <p>• Pelo menos uma letra minúscula</p>
              <p>• Pelo menos um número</p>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={changePasswordMutation.isPending}
              className="dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white hover:bg-blue-700"
            >
              {changePasswordMutation.isPending
                ? "Alterando..."
                : "Alterar Senha"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
