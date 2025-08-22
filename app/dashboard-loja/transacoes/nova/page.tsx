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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save, Calculator, User, CreditCard } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useClientsPaginated } from "@/hooks/queries/use-clients-paginated";
import { useStoreConfig } from "@/hooks/queries/use-store-config";
import { useCreateTransaction } from "@/hooks/mutations/use-create-transaction";
import { useToast } from "@/hooks/use-toast";
import { NumericFormat } from "react-number-format";

export default function NovaTransacaoPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    clienteId: "",
    cpf: "",
    valor: "",
    descricao: "",
  });
  const [useCpf, setUseCpf] = useState(false);

  const { data: clientsData, isLoading: isLoadingClients } =
    useClientsPaginated({
      limit: 100,
    });

  const { data: storeConfig, isLoading: isLoadingStoreConfig } =
    useStoreConfig();
  const createTransactionMutation = useCreateTransaction();

  const valor = (() => {
    if (!formData.valor) return 0;
    const cleanValue = formData.valor.replace(/[^\d,]/g, "").replace(",", ".");
    return Number.parseFloat(cleanValue) || 0;
  })();

  const pontosCalculados = (() => {
    if (!storeConfig?.pointsPerCurrency || valor <= 0) return 0;
    return Math.floor(valor * storeConfig.pointsPerCurrency);
  })();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.valor || valor <= 0) {
      toast({
        title: "Erro de validação",
        description: "Por favor, insira um valor válido maior que zero.",
        variant: "destructive",
      });
      return;
    }

    if (!useCpf && !formData.clienteId) {
      toast({
        title: "Erro de validação",
        description: "Por favor, selecione um cliente ou insira um CPF.",
        variant: "destructive",
      });
      return;
    }

    if (useCpf && !formData.cpf) {
      toast({
        title: "Erro de validação",
        description: "Por favor, insira um CPF válido.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createTransactionMutation.mutateAsync({
        clienteId: useCpf ? undefined : formData.clienteId,
        cpf: useCpf ? formData.cpf : undefined,
        valor,
        descricao: formData.descricao || undefined,
      });
    } catch (error) {
      console.error("Erro ao criar transação:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCpfChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      cpf: value,
    }));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  if (isLoadingStoreConfig) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard-loja/transacoes">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Nova Transação</h1>
            <p className="text-gray-600">
              Registre uma nova venda e gere pontos automaticamente
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Dados da Transação</CardTitle>
                <CardDescription>
                  Preencha as informações da venda
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                      <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard-loja/transacoes">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nova Transação</h1>
          <p className="text-gray-600">
            Registre uma nova venda e gere pontos automaticamente
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Dados da Transação</CardTitle>
              <CardDescription>
                Preencha as informações da venda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Button
                      type="button"
                      variant={!useCpf ? "default" : "outline"}
                      onClick={() => setUseCpf(false)}
                      className="flex items-center gap-2"
                    >
                      <User className="h-4 w-4" />
                      Cliente Cadastrado
                    </Button>
                    <Button
                      type="button"
                      variant={useCpf ? "default" : "outline"}
                      onClick={() => setUseCpf(true)}
                      className="flex items-center gap-2"
                    >
                      <CreditCard className="h-4 w-4" />
                      Por CPF
                    </Button>
                  </div>

                  {!useCpf ? (
                    <div className="space-y-2">
                      <Label htmlFor="clienteId">Cliente *</Label>
                      <Select
                        value={formData.clienteId}
                        onValueChange={(value) =>
                          setFormData((prev) => ({ ...prev, clienteId: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um cliente" />
                        </SelectTrigger>
                        <SelectContent>
                          {isLoadingClients ? (
                            <SelectItem value="loading" disabled>
                              Carregando clientes...
                            </SelectItem>
                          ) : clientsData?.clients &&
                            clientsData.clients.length > 0 ? (
                            clientsData.clients
                              .filter(
                                (cliente) =>
                                  cliente.isRegistered &&
                                  cliente.id &&
                                  cliente.id.trim() !== ""
                              )
                              .map((cliente) => (
                                <SelectItem
                                  key={cliente.id}
                                  value={cliente.id || ""}
                                >
                                  {cliente.name ||
                                    `Cliente por CPF: ${cliente.cpf}`}{" "}
                                  -{" "}
                                  {cliente.phone ||
                                    cliente.email ||
                                    cliente.cpf}
                                </SelectItem>
                              ))
                          ) : (
                            <SelectItem value="no-clients" disabled>
                              Nenhum cliente cadastrado encontrado
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label htmlFor="cpf">CPF do Cliente *</Label>
                      <NumericFormat
                        customInput={Input}
                        thousandSeparator="."
                        decimalSeparator="-"
                        value={formData.cpf}
                        onValueChange={(values) =>
                          handleCpfChange(values.value)
                        }
                        placeholder="000.000.000-00"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="valor">Valor da Compra *</Label>
                  <NumericFormat
                    customInput={Input}
                    thousandSeparator="."
                    decimalSeparator=","
                    prefix="R$ "
                    value={formData.valor}
                    onValueChange={(values) =>
                      handleChange({
                        target: { name: "valor", value: values.value },
                      } as React.ChangeEvent<HTMLInputElement>)
                    }
                    placeholder="R$ 0,00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descricao">Descrição (opcional)</Label>
                  <Input
                    id="descricao"
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleChange}
                    placeholder="Ex: Compra de produtos diversos"
                  />
                </div>

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    disabled={
                      createTransactionMutation.isPending ||
                      !formData.valor ||
                      valor <= 0 ||
                      (!useCpf &&
                        (!formData.clienteId ||
                          formData.clienteId === "loading" ||
                          formData.clienteId === "no-clients")) ||
                      (useCpf && !formData.cpf)
                    }
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {createTransactionMutation.isPending
                      ? "Criando..."
                      : "Registrar Transação"}
                  </Button>
                  <Link href="/dashboard-loja/transacoes">
                    <Button variant="outline">Cancelar</Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Cálculo dos Pontos
              </CardTitle>
              <CardDescription>
                Pontos que serão creditados ao cliente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">
                  Valor da Compra
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(valor)}
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-600 mb-1">
                  Taxa de Conversão
                </div>
                <div className="text-lg font-bold text-blue-600">
                  {storeConfig?.pointsPerCurrency || 1} ponto por R$ 1,00
                </div>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="text-sm text-purple-600 mb-1">
                  Pontos a Conceder
                </div>
                <div className="text-2xl font-bold text-purple-600">
                  {pontosCalculados} pontos
                </div>
              </div>

              <div className="text-xs text-gray-500 mt-4">
                * Os pontos serão creditados automaticamente na conta do cliente
                após a confirmação da transação.
                {useCpf && (
                  <span className="block mt-1">
                    ** Pontos serão atribuídos por CPF e migrados quando o
                    cliente se cadastrar.
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
