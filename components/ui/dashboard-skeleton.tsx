import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardSkeletonProps {
  title?: string;
  subtitle?: string;
  showStats?: boolean;
  showFilters?: boolean;
  showTable?: boolean;
  showCards?: boolean;
  cardsCount?: number;
  tableRows?: number;
}

export function DashboardSkeleton({
  title = "Carregando...",
  subtitle = "Aguarde enquanto carregamos os dados",
  showStats = true,
  showFilters = true,
  showTable = true,
  showCards = false,
  cardsCount = 6,
  tableRows = 5,
}: DashboardSkeletonProps) {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-5 w-64" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Cards de Estatísticas Skeleton */}
      {showStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <Card key={index} className="shadow-sm border-border bg-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-3 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Filtros Skeleton */}
      {showFilters && (
        <Card className="shadow-sm border-border bg-card">
          <CardHeader className="pb-4">
            <Skeleton className="h-6 w-20" />
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-32" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cards Grid Skeleton */}
      {showCards && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(cardsCount)].map((_, index) => (
            <Card key={index} className="border-border bg-card">
              <CardHeader className="pb-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-5 w-20" />
                </div>
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent className="space-y-4">
                {[...Array(4)].map((_, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="flex justify-between items-center"
                  >
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
                <div className="flex gap-2 pt-2">
                  <Skeleton className="h-8 flex-1" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Tabela Skeleton */}
      {showTable && (
        <Card className="shadow-sm border-border bg-card">
          <CardHeader className="pb-4">
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-40" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Header da tabela */}
              <div className="grid grid-cols-4 gap-4 pb-3 border-b border-border">
                {[...Array(4)].map((_, index) => (
                  <Skeleton key={index} className="h-4 w-20" />
                ))}
              </div>
              {/* Linhas da tabela */}
              {[...Array(tableRows)].map((_, index) => (
                <div key={index} className="grid grid-cols-4 gap-4 py-3">
                  {[...Array(4)].map((_, colIndex) => (
                    <Skeleton key={colIndex} className="h-4 w-full" />
                  ))}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Componentes específicos para diferentes tipos de página
export function PremiosSkeleton() {
  return (
    <DashboardSkeleton
      title="Prêmios"
      subtitle="Gerencie os prêmios disponíveis para resgate"
      showStats={true}
      showFilters={true}
      showCards={true}
      cardsCount={6}
    />
  );
}

export function TransacoesSkeleton() {
  return (
    <DashboardSkeleton
      title="Transações"
      subtitle="Gerencie todas as transações de pontos dos seus clientes"
      showStats={true}
      showFilters={true}
      showTable={true}
      tableRows={5}
    />
  );
}

export function ClientesSkeleton() {
  return (
    <DashboardSkeleton
      title="Clientes"
      subtitle="Gerencie todos os seus clientes cadastrados"
      showStats={true}
      showFilters={true}
      showTable={true}
      tableRows={8}
    />
  );
}

export function DashboardHomeSkeleton() {
  return (
    <DashboardSkeleton
      title="Dashboard"
      subtitle="Visão geral da sua loja"
      showStats={true}
      showFilters={false}
      showTable={false}
      showCards={true}
      cardsCount={4}
    />
  );
}

export function ConfiguracoesSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-5 w-96" />
      </div>

      {/* Tabs Skeleton */}
      <div className="space-y-6">
        <div className="grid w-full grid-cols-4 gap-2">
          {[...Array(4)].map((_, index) => (
            <Skeleton key={index} className="h-10 w-full" />
          ))}
        </div>

        {/* Tab Content Skeleton */}
        <div className="space-y-6">
          {/* Dados da Loja Tab */}
          <Card className="bg-card border-border">
            <CardHeader className="space-y-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-6 w-32" />
              </div>
              <Skeleton className="h-4 w-80" />
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Foto de Perfil */}
              <div className="space-y-4">
                <Skeleton className="h-6 w-24" />
                <div className="flex items-center gap-6">
                  <Skeleton className="w-24 h-24 rounded-full" />
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                </div>
              </div>

              {/* Formulário */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(8)].map((_, index) => (
                  <div key={index} className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>

              {/* Botão Salvar */}
              <div className="flex justify-end">
                <Skeleton className="h-10 w-24" />
              </div>
            </CardContent>
          </Card>

          {/* Regras de Pontuação Tab */}
          <Card className="bg-card border-border">
            <CardHeader className="space-y-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-6 w-32" />
              </div>
              <Skeleton className="h-4 w-80" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
              <div className="flex justify-end">
                <Skeleton className="h-10 w-24" />
              </div>
            </CardContent>
          </Card>

          {/* Alterar Senha Tab */}
          <Card className="bg-card border-border">
            <CardHeader className="space-y-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-6 w-32" />
              </div>
              <Skeleton className="h-4 w-80" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
              <div className="flex justify-end">
                <Skeleton className="h-10 w-24" />
              </div>
            </CardContent>
          </Card>

          {/* Notificações Tab */}
          <Card className="bg-card border-border">
            <CardHeader className="space-y-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-6 w-32" />
              </div>
              <Skeleton className="h-4 w-80" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {[...Array(3)].map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                    <Skeleton className="h-6 w-12" />
                  </div>
                ))}
              </div>
              <div className="flex justify-end">
                <Skeleton className="h-10 w-24" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
