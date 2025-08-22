"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Save, User, Store, Coins } from "lucide-react";
import { useCreateTransaction } from "@/hooks/mutations/use-create-transaction";

const transactionSchema = z.object({
  userId: z.string().min(1, "Usuário é obrigatório"),
  storeId: z.string().min(1, "Loja é obrigatória"),
  amount: z.number().min(0.01, "Valor deve ser maior que zero"),
  points: z.number().min(1, "Pontos devem ser pelo menos 1"),
  type: z.enum(["award", "redeem", "expire", "adjustment"]),
  description: z.string().optional(),
});

type TransactionInput = z.infer<typeof transactionSchema>;

export function TransactionForm() {
  const [isLoading, setIsLoading] = useState(false);
  const createTransaction = useCreateTransaction();

  const form = useForm<TransactionInput>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      userId: "",
      storeId: "",
      amount: 0,
      points: 0,
      type: "award",
      description: "",
    },
  });

  const onSubmit = async (data: TransactionInput) => {
    setIsLoading(true);
    try {
      await createTransaction.mutateAsync(data);
      form.reset();
    } catch (error) {
      console.error("Erro ao criar transação:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins className="h-5 w-5" />
          Nova Transação
        </CardTitle>
        <CardDescription>
          Registre uma nova transação de pontos para um cliente
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="userId" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Cliente
              </Label>
              <Input
                id="userId"
                placeholder="ID do usuário"
                {...form.register("userId")}
                className={form.formState.errors.userId ? "border-red-500" : ""}
              />
              {form.formState.errors.userId && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.userId.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="storeId" className="flex items-center gap-2">
                <Store className="h-4 w-4" />
                Loja
              </Label>
              <Input
                id="storeId"
                placeholder="ID da loja"
                {...form.register("storeId")}
                className={
                  form.formState.errors.storeId ? "border-red-500" : ""
                }
              />
              {form.formState.errors.storeId && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.storeId.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Valor (R$)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...form.register("amount", { valueAsNumber: true })}
                className={form.formState.errors.amount ? "border-red-500" : ""}
              />
              {form.formState.errors.amount && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.amount.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="points">Pontos</Label>
              <Input
                id="points"
                type="number"
                placeholder="0"
                {...form.register("points", { valueAsNumber: true })}
                className={form.formState.errors.points ? "border-red-500" : ""}
              />
              {form.formState.errors.points && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.points.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Transação</Label>
              <Select
                value={form.watch("type")}
                onValueChange={(value) => form.setValue("type", value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="award">Conceder Pontos</SelectItem>
                  <SelectItem value="redeem">Resgatar Pontos</SelectItem>
                  <SelectItem value="expire">Expirar Pontos</SelectItem>
                  <SelectItem value="adjustment">Ajuste</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.type && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.type.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição (opcional)</Label>
              <Input
                id="description"
                placeholder="Descrição da transação"
                {...form.register("description")}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? "Criando..." : "Criar Transação"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
