import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift } from "lucide-react";

interface StatsCardsProps {
  totalRewards: number;
  activeRewards: number;
  monthlyRedemptions: number;
  remainingRewards: string | number;
  planName: string;
}

export function StatsCards({
  totalRewards,
  activeRewards,
  monthlyRedemptions,
  remainingRewards,
  planName,
}: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <Card className="shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Total de Prêmios
          </CardTitle>
          <Gift className="h-4 w-4 text-gray-600 dark:text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {totalRewards}
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            {activeRewards} disponíveis
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Prêmios Ativos
          </CardTitle>
          <Gift className="h-4 w-4 text-gray-600 dark:text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {activeRewards}
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Disponíveis
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Resgates (Este Mês)
          </CardTitle>
          <Gift className="h-4 w-4 text-gray-600 dark:text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {monthlyRedemptions}
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Total de resgates
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Prêmios Restantes
          </CardTitle>
          <Gift className="h-4 w-4 text-gray-600 dark:text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {remainingRewards}
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            {planName}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
