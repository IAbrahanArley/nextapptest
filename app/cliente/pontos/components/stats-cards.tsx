import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Store, Gift, TrendingUp, Star } from "lucide-react";

interface StatsCardsProps {
  totalPoints: number;
  activeStores: number;
  recentTransactions: number;
}

export function StatsCards({
  totalPoints,
  activeStores,
  recentTransactions,
}: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
      <Card className="shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Total de Pontos
          </CardTitle>
          <Star className="h-4 w-4 text-yellow-500 dark:text-yellow-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-500">
            {totalPoints.toLocaleString()}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Disponíveis para resgate
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Estabelecimentos
          </CardTitle>
          <Store className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {activeStores}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Com pontos ativos
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Transações Recentes
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {recentTransactions}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Últimas 30 dias
          </p>
        </CardContent>
      </Card>
    </div>
  );
}





