"use client";

import { useState } from "react";
import { useClientsPaginated } from "@/hooks/queries/use-clients-paginated";
import { useStoreConfig } from "@/hooks/queries/use-store-config";
import { getPlanById } from "@/lib/plans";
import { migratePointsForExistingUser } from "@/actions/clients";
import { useToast } from "@/hooks/use-toast";
import { useMigratePointsForExistingUser } from "@/hooks/mutations/use-migrate-points-for-existing-user";
import {
  Header,
  LimitWarning,
  StatsCards,
  SearchFilters,
  ClientsList,
  Pagination,
} from "./components";

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
        refetchClients();
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

  const activeClientsCount =
    clientsData?.clients?.filter((c) => c.status === "active").length || 0;
  const clientsByCpfCount =
    clientsData?.clients?.filter((c) => !c.isRegistered).length || 0;

  if (isLoadingClients || isLoadingStoreConfig) {
    return null; // O loading será gerenciado pelo componente ClientsList
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
        <Header canAddMoreClients={effectiveCanAddMoreClients} />

        {!effectiveCanAddMoreClients && (
          <LimitWarning
            effectiveClientLimit={effectiveClientLimit}
            effectivePlan={effectivePlan}
          />
        )}

        <StatsCards
          currentClientCount={currentClientCount}
          effectiveClientLimit={effectiveClientLimit}
          effectiveIsUnlimited={effectiveIsUnlimited}
          activeClientsCount={activeClientsCount}
          effectivePlan={effectivePlan}
          clientsByCpfCount={clientsByCpfCount}
        />

        <SearchFilters
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          onSearch={handleSearch}
        />

        <ClientsList
          clients={clientsData?.clients || []}
          total={clientsData?.total || 0}
          isLoading={isLoadingClients}
          onMigratePoints={handleMigratePoints}
          migratingPoints={migratingPoints}
          isMigrating={migratePointsMutation.isPending}
        />

        {clientsData && clientsData.totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={clientsData.totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}
