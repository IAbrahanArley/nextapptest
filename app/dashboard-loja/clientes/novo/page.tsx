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
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCreateClient } from "@/hooks/mutations/use-create-client";
import { useToast } from "@/hooks/use-toast";
import { useStoreId } from "@/hooks/queries/use-store-id";
import { ClientForm } from "./components/client-form";

export default function NovoClientePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const { data: storeIdData, isLoading: isLoadingStoreId } = useStoreId();
  const storeId = storeIdData?.data?.storeId;

  useEffect(() => {
    setMounted(true);
  }, []);

  const createClientMutation = useCreateClient(storeId || "");

  // Não renderizar até que o componente esteja montado no cliente
  if (!mounted) {
    return null;
  }

  if (isLoadingStoreId) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard-loja/clientes">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Novo Cliente</h1>
            <p className="text-muted-foreground">Carregando...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!storeId) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard-loja/clientes">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Novo Cliente</h1>
            <p className="text-muted-foreground">Erro: Loja não encontrada</p>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (data: any) => {
    try {
      const result = await createClientMutation.mutateAsync({ data, storeId });

      if (result.success) {
        if (result.data?.isNewUser) {
          toast({
            title: "Cliente criado com sucesso! 🎉",
            description:
              result.data?.message ||
              "Cliente criado com sucesso! Senha temporária enviada por email.",
          });
        } else {
          toast({
            title: "Cliente atualizado! ✏️",
            description:
              result.data?.message || "Cliente atualizado com sucesso",
          });
        }
        router.push("/dashboard-loja/clientes");
      } else {
        // Verificar se é um cliente já existente
        if (result.isExistingUser) {
          toast({
            title: "Cliente já cadastrado",
            description:
              result.error || "Este cliente já está cadastrado no sistema",
            variant: "default",
          });
        } else {
          toast({
            title: "Erro",
            description: result.error || "Erro ao criar cliente",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro inesperado ao criar cliente",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard-loja/clientes">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Novo Cliente</h1>
          <p className="text-muted-foreground">
            Cadastre um novo cliente no sistema
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dados do Cliente</CardTitle>
          <CardDescription>
            Preencha as informações básicas do cliente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ClientForm
            onSubmit={handleSubmit}
            isLoading={createClientMutation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}
