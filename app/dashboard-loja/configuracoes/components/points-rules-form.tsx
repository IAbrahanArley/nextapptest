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
import { Percent } from "lucide-react";
import { useUpdatePointsRules } from "@/hooks/mutations/use-update-points-rules";
import { useToast } from "@/hooks/use-toast";

const pointsSchema = z.object({
  points_per_currency_unit: z
    .number()
    .min(0.01, "Valor mínimo é 0.01")
    .max(100, "Valor máximo é 100"),
  min_purchase_value_to_award: z
    .number()
    .min(0, "Valor mínimo é 0")
    .max(10000, "Valor máximo é R$ 10.000,00"),
  points_validity_days: z
    .number()
    .min(1, "Validade mínima é 1 dia")
    .max(3650, "Validade máxima é 10 anos"),
});

type PointsForm = z.infer<typeof pointsSchema>;

interface PointsRulesFormProps {
  initialData: PointsForm;
  onSuccess?: () => void;
}

export function PointsRulesForm({
  initialData,
  onSuccess,
}: PointsRulesFormProps) {
  const { toast } = useToast();
  const updatePointsRulesMutation = useUpdatePointsRules();

  const form = useForm<PointsForm>({
    resolver: zodResolver(pointsSchema),
    defaultValues: initialData,
  });

  const onSubmit = async (data: PointsForm) => {
    try {
      await updatePointsRulesMutation.mutateAsync(data);
      toast({
        title: "Sucesso",
        description: "Regras de pontuação atualizadas com sucesso!",
      });
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar regras de pontuação",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card className="shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <Percent className="h-5 w-5" />
            Regras de Pontuação
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Configure como os clientes ganham e perdem pontos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label
                htmlFor="points_per_currency_unit"
                className="text-gray-700 dark:text-gray-300"
              >
                Pontos por Real *
              </Label>
              <Input
                id="points_per_currency_unit"
                type="number"
                step="0.01"
                min="0.01"
                max="100"
                {...form.register("points_per_currency_unit", {
                  valueAsNumber: true,
                })}
                placeholder="1.00"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder:text-gray-400"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Quantos pontos o cliente ganha por R$ 1,00 gasto
              </p>
              {form.formState.errors.points_per_currency_unit && (
                <p className="text-sm text-red-500 dark:text-red-400">
                  {form.formState.errors.points_per_currency_unit.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="min_purchase_value_to_award"
                className="text-gray-700 dark:text-gray-300"
              >
                Valor Mínimo para Pontos *
              </Label>
              <Input
                id="min_purchase_value_to_award"
                type="number"
                step="0.01"
                min="0"
                max="10000"
                {...form.register("min_purchase_value_to_award", {
                  valueAsNumber: true,
                })}
                placeholder="0.00"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder:text-gray-400"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Valor mínimo da compra para ganhar pontos
              </p>
              {form.formState.errors.min_purchase_value_to_award && (
                <p className="text-sm text-red-500 dark:text-red-400">
                  {form.formState.errors.min_purchase_value_to_award.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="points_validity_days"
                className="text-gray-700 dark:text-gray-300"
              >
                Validade dos Pontos (dias) *
              </Label>
              <Input
                id="points_validity_days"
                type="number"
                min="1"
                max="3650"
                {...form.register("points_validity_days", {
                  valueAsNumber: true,
                })}
                placeholder="365"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder:text-gray-400"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Quantos dias os pontos ficam válidos
              </p>
              {form.formState.errors.points_validity_days && (
                <p className="text-sm text-red-500 dark:text-red-400">
                  {form.formState.errors.points_validity_days.message}
                </p>
              )}
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Como Funciona
            </h4>
            <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <p>
                • Cliente gasta R$ 50,00 → Ganha{" "}
                {form.watch("points_per_currency_unit") * 50} pontos
              </p>
              <p>
                • Pontos válidos por {form.watch("points_validity_days")} dias
              </p>
              <p>
                • Valor mínimo para ganhar pontos: R${" "}
                {form.watch("min_purchase_value_to_award")}
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={updatePointsRulesMutation.isPending}
              className="dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white hover:bg-blue-700"
            >
              {updatePointsRulesMutation.isPending
                ? "Salvando..."
                : "Salvar Regras"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
