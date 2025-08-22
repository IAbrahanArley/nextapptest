"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCreateReward } from "@/hooks/mutations/use-create-reward";
import { useToast } from "@/hooks/use-toast";
import { useStoreId } from "@/hooks/queries/use-store-id";
import { RewardForm } from "./components/reward-form";

export default function NovoPremioPage() {
  const router = useRouter();
  const { toast } = useToast();
  const {
    data: storeIdData,
    isLoading: isLoadingStoreId,
    error: storeIdError,
  } = useStoreId();
  const storeId = storeIdData?.data?.storeId;

  console.log("=== DEBUG NOVO PREMIO PAGE ===");
  console.log("storeIdData:", storeIdData);
  console.log("storeId:", storeId);
  console.log("isLoadingStoreId:", isLoadingStoreId);
  console.log("storeIdError:", storeIdError);

  const createRewardMutation = useCreateReward(storeId || "");

  console.log("=== DEBUG CREATE REWARD MUTATION ===");
  console.log("createRewardMutation:", createRewardMutation);
  console.log("isPending:", createRewardMutation.isPending);
  console.log("isError:", createRewardMutation.isError);
  console.log("error:", createRewardMutation.error);

  const handleSubmit = async (data: any) => {
    console.log("=== DEBUG SUBMIT ===");
    console.log("data recebida:", data);
    console.log("storeId atual:", storeId);
    console.log("createRewardMutation:", createRewardMutation);

    if (!storeId) {
      console.log("ERRO: Store ID não encontrado!");
      toast({
        title: "Erro",
        description: "ID da loja não encontrado",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("Chamando createRewardMutation.mutateAsync...");
      console.log("Payload sendo enviado:", { ...data, store_id: storeId });

      const result = await createRewardMutation.mutateAsync(data);
      console.log("Resultado da mutation:", result);

      if (result.success) {
        console.log("SUCESSO: Prêmio criado!");
        toast({
          title: "Sucesso!",
          description: result.message,
        });
        router.push("/dashboard-loja/premios");
      } else {
        console.log("ERRO na mutation:", result.error);
        toast({
          title: "Erro",
          description: result.error || "Erro ao criar prêmio",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("ERRO EXCEPTION ao criar prêmio:", error);
      console.error("Tipo do erro:", typeof error);
      console.error(
        "Stack trace:",
        error instanceof Error ? error.stack : "N/A"
      );

      toast({
        title: "Erro",
        description: "Erro inesperado ao criar prêmio",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    console.log("=== DEBUG USE EFFECT ===");
    console.log("Componente montado, storeId:", storeId);
    console.log("storeIdData:", storeIdData);
  }, [storeId, storeIdData]);

  if (isLoadingStoreId) {
    console.log("=== DEBUG LOADING ===");
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard-loja/premios">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Novo Prêmio</h1>
            <p className="text-gray-600">Carregando...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!storeId) {
    console.log("=== DEBUG NO STORE ID ===");
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard-loja/premios">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Novo Prêmio</h1>
            <p className="text-gray-600">Erro: Loja não encontrada</p>
            <p className="text-sm text-red-500">
              Store ID Data: {JSON.stringify(storeIdData)}
            </p>
            {storeIdError && (
              <p className="text-sm text-red-500">
                Erro: {JSON.stringify(storeIdError)}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  console.log("=== DEBUG RENDER FINAL ===");
  console.log("Renderizando formulário com storeId:", storeId);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/dashboard-loja/premios">
          <Button
            variant="outline"
            size="sm"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Novo Prêmio</h1>
          <p className="text-gray-600 mt-1">
            Crie um novo prêmio para seus clientes resgatarem
          </p>
          <p className="text-sm text-gray-500 mt-1">Store ID: {storeId}</p>
        </div>
      </div>

      <Card className="shadow-sm border-gray-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold text-gray-900">
            Dados do Prêmio
          </CardTitle>
          <CardDescription className="text-gray-600">
            Configure as informações do prêmio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RewardForm
            onSubmit={handleSubmit}
            isLoading={createRewardMutation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}
