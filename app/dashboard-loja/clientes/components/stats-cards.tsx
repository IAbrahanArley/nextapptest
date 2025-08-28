import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

interface StatsCardsProps {
  currentClientCount: number;
  effectiveClientLimit: number;
  effectiveIsUnlimited: boolean;
  activeClientsCount: number;
  effectivePlan: any;
  clientsByCpfCount: number;
}

export function StatsCards({
  currentClientCount,
  effectiveClientLimit,
  effectiveIsUnlimited,
  activeClientsCount,
  effectivePlan,
  clientsByCpfCount,
}: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <Card className="shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Total de Clientes
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {currentClientCount}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {effectiveIsUnlimited
              ? "Ilimitado"
              : `${currentClientCount}/${effectiveClientLimit}`}
            <br />
            <span className="text-gray-500 dark:text-gray-400">
              {clientsByCpfCount} por CPF
            </span>
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Clientes Ativos
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {activeClientsCount}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Últimos 30 dias (incluindo por CPF)
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Plano Atual
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {effectivePlan?.name || "Básico"}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {effectiveIsUnlimited
              ? "Clientes ilimitados"
              : `Até ${effectiveClientLimit} clientes`}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
