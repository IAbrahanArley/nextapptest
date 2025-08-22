"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useCreateStore } from "@/hooks/mutations/use-create-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Store, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SetupPage() {
  const [storeName, setStoreName] = useState("");
  const [storeSlug, setStoreSlug] = useState("");
  const [storeDescription, setStoreDescription] = useState("");
  const [storeEmail, setStoreEmail] = useState("");
  const [storePhone, setStorePhone] = useState("");

  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const createStoreMutation = useCreateStore();

  // Preencher dados iniciais com base no usuário
  useEffect(() => {
    if (user?.name) {
      setStoreName(`Loja de ${user.name}`);
      setStoreSlug(user.name.toLowerCase().replace(/[^a-z0-9]/g, "-"));
    }
    if (user?.email) {
      setStoreEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await createStoreMutation.mutateAsync({
        userId: user.id,
        userEmail: storeEmail,
        userName: user.name || "Usuário",
        storeName: storeName,
        storeSlug: storeSlug,
        storeDescription: storeDescription,
        storePhone: storePhone,
      });

      if (result.success) {
        toast({
          title: "Sucesso!",
          description: "Loja criada com sucesso",
        });
        router.push("/dashboard-loja");
      } else {
        toast({
          title: "Erro",
          description: result.message || "Erro ao criar loja",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro interno ao criar loja",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10 text-primary">
              <Store className="h-12 w-12" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">
            Configuração da Loja
          </CardTitle>
          <CardDescription>
            Configure sua loja para começar a usar o sistema de fidelidade
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="storeName">Nome da Loja *</Label>
                <Input
                  id="storeName"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="Nome da sua loja"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="storeSlug">Slug da Loja *</Label>
                <Input
                  id="storeSlug"
                  value={storeSlug}
                  onChange={(e) => setStoreSlug(e.target.value)}
                  placeholder="slug-da-loja"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="storeDescription">Descrição</Label>
              <Input
                id="storeDescription"
                value={storeDescription}
                onChange={(e) => setStoreDescription(e.target.value)}
                placeholder="Descreva sua loja"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="storeEmail">Email da Loja</Label>
                <Input
                  id="storeEmail"
                  type="email"
                  value={storeEmail}
                  onChange={(e) => setStoreEmail(e.target.value)}
                  placeholder="contato@loja.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="storePhone">Telefone da Loja</Label>
                <Input
                  id="storePhone"
                  value={storePhone}
                  onChange={(e) => setStorePhone(e.target.value)}
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={createStoreMutation.isPending}
            >
              {createStoreMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando Loja...
                </>
              ) : (
                <>
                  <Store className="mr-2 h-4 w-4" />
                  Criar Loja
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
