"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  Eye,
  Users,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { useClientsPaginated } from "@/hooks/queries/use-clients-paginated";
import { useStoreConfig } from "@/hooks/queries/use-store-config";
import { getPlanById } from "@/lib/plans";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  migratePendingPoints,
  migratePointsForExistingUser,
} from "@/actions/clients";
import { useToast } from "@/hooks/use-toast";
import { ClientesSkeleton } from "@/components/ui/dashboard-skeleton";
import { useMigratePointsForExistingUser } from "@/hooks/mutations/use-migrate-points-for-existing-user";

export default function ClientesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [migratingPoints, setMigratingPoints] = useState<string | null>(null);

  const {
    data: clientsData,
    isLoading: isLoadingClients,
    refetch: refetchClients,
  } = useClientsPaginated({
    page: currentPage,
    limit: 20,
    search: searchTerm || undefined,
  });

  const { data: storeConfig, isLoading: isLoadingStoreConfig } =
    useStoreConfig();
  const { toast } = useToast();

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const migratePointsMutation = useMigratePointsForExistingUser();

  const handleMigratePoints = async (cpf: string) => {
    if (!storeConfig?.storeId) return;

    setMigratingPoints(cpf);
    try {
      const result = await migratePointsForExistingUser({ cpf });

      if (result.success && result.pointsMigrated > 0) {
        toast({
          title: "Pontos migrados com sucesso!",
          description: `${result.pointsMigrated} pontos foram migrados de ${
            result.storesMigrated
          } lojas para ${result.userInfo?.name || "o usuário"}.`,
        });
      } else {
        toast({
          title: "Nenhum ponto migrado",
          description: result.message,
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao migrar pontos pendentes",
        variant: "destructive",
      });
    } finally {
      setMigratingPoints(null);
    }
  };

  const formatDate = (date: Date) => {
    return format(new Date(date), "dd/MM/yyyy", { locale: ptBR });
  };

  const getPlanInfo = () => {
    if (!storeConfig?.planId) return null;
    return getPlanById(storeConfig.planId);
  };

  const plan = getPlanInfo();
  const clientLimit = plan?.limits.clientes || 0;
  const isUnlimited = clientLimit === -1;
  const currentClientCount = clientsData?.total || 0;
  const canAddMoreClients = isUnlimited || currentClientCount < clientLimit;

  // Se não há plano ativo, assumir plano básico como fallback
  const effectivePlan = plan || getPlanById("basico");
  const effectiveClientLimit = effectivePlan?.limits.clientes || 100;
  const effectiveIsUnlimited = effectiveClientLimit === -1;
  const effectiveCanAddMoreClients =
    effectiveIsUnlimited || currentClientCount < effectiveClientLimit;

  if (isLoadingClients || isLoadingStoreConfig) {
    return <ClientesSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-100">Clientes</h1>
          <p className="text-gray-600">
            Gerencie todos os seus clientes cadastrados
          </p>
        </div>
        <Link href="/dashboard-loja/clientes/novo">
          <Button disabled={!effectiveCanAddMoreClients}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Cliente
          </Button>
        </Link>
      </div>

      {!effectiveCanAddMoreClients && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <div>
                <h3 className="font-medium text-orange-800">
                  Limite de clientes atingido
                </h3>
                <p className="text-sm text-orange-700">
                  Você atingiu o limite de {effectiveClientLimit} clientes do
                  seu plano atual.
                  {effectivePlan && (
                    <Link
                      href="/dashboard-loja/assinatura"
                      className="underline ml-1"
                    >
                      Faça upgrade para o plano {effectivePlan.name}
                    </Link>
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Clientes
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentClientCount}</div>
            <p className="text-xs text-muted-foreground">
              {effectiveIsUnlimited
                ? "Ilimitado"
                : `${currentClientCount}/${effectiveClientLimit}`}
              <br />
              <span className="text-gray-500">
                {clientsData?.clients.filter((c) => !c.isRegistered).length ||
                  0}{" "}
                por CPF
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Clientes Ativos
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {clientsData?.clients.filter((c) => c.status === "active")
                .length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Últimos 30 dias (incluindo por CPF)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Plano Atual</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {effectivePlan?.name || "Básico"}
            </div>
            <p className="text-xs text-muted-foreground">
              {effectiveIsUnlimited
                ? "Clientes ilimitados"
                : `Até ${effectiveClientLimit} clientes`}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nome, email ou CPF..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch} className="w-full max-w-xs">
              Filtrar
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
          <CardDescription>
            {clientsData?.total || 0} cliente(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingClients ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-2" />
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                        <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
                        <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {clientsData?.clients && clientsData.clients.length > 0 ? (
                <div className="space-y-4">
                  {clientsData.clients.map((cliente) => (
                    <div
                      key={
                        cliente.id || cliente.cpf || `client-${Math.random()}`
                      }
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">
                              {cliente.name ||
                                `Cliente por CPF: ${cliente.cpf}`}
                            </h3>
                            <Badge
                              variant={
                                cliente.status === "active"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {cliente.status === "active"
                                ? "Ativo"
                                : "Inativo"}
                            </Badge>
                            {!cliente.isRegistered && (
                              <Badge
                                variant="outline"
                                className="text-orange-600"
                              >
                                Por CPF
                              </Badge>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Email: </span>
                              <span>{cliente.email || "Não informado"}</span>
                            </div>

                            <div>
                              <span className="font-medium">Telefone: </span>
                              <span>{cliente.phone || "Não informado"}</span>
                            </div>

                            <div>
                              <span className="font-medium">CPF: </span>
                              <span>{cliente.cpf || "Não informado"}</span>
                            </div>

                            <div>
                              <span className="font-medium">Pontos: </span>
                              <span className="text-purple-600 font-bold">
                                {cliente.points}
                              </span>
                            </div>
                          </div>

                          <div className="mt-2 text-xs text-gray-500">
                            {cliente.isRegistered ? (
                              <>
                                <span className="font-medium">
                                  Cadastrado em:{" "}
                                </span>
                                {formatDate(cliente.createdAt)}
                                {cliente.lastTransaction && (
                                  <>
                                    <span className="mx-2">•</span>
                                    <span className="font-medium">
                                      Última transação:{" "}
                                    </span>
                                    {formatDate(cliente.lastTransaction)}
                                  </>
                                )}
                              </>
                            ) : (
                              <>
                                <span className="font-medium">
                                  Pontos atribuídos por CPF em:{" "}
                                </span>
                                {formatDate(cliente.createdAt)}
                                {cliente.lastTransaction && (
                                  <>
                                    <span className="mx-2">•</span>
                                    <span className="font-medium">
                                      Última transação:{" "}
                                    </span>
                                    {formatDate(cliente.lastTransaction)}
                                  </>
                                )}
                              </>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {!cliente.isRegistered && cliente.cpf && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleMigratePoints(cliente.cpf!)}
                              disabled={
                                migratingPoints === cliente.cpf ||
                                migratePointsMutation.isPending
                              }
                              className="text-orange-600 hover:text-orange-700"
                            >
                              {migratingPoints === cliente.cpf ||
                              migratePointsMutation.isPending ? (
                                <RefreshCw className="h-4 w-4 animate-spin mr-1" />
                              ) : (
                                <RefreshCw className="h-4 w-4 mr-1" />
                              )}
                              Migrar Pontos
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhum cliente encontrado
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {clientsData?.total === 0
                      ? "Você ainda não tem clientes cadastrados ou que receberam pontos."
                      : "Nenhum cliente corresponde aos filtros aplicados."}
                  </p>
                  <Link href="/dashboard-loja/clientes/novo">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Cadastrar Primeiro Cliente
                    </Button>
                  </Link>
                </div>
              )}

              {clientsData && clientsData.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-700">
                    Página {clientsData.currentPage} de {clientsData.totalPages}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === clientsData.totalPages}
                    >
                      Próxima
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
