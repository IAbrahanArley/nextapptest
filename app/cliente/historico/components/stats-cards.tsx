import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History, TrendingUp, Gift, Award } from "lucide-react";

interface StatsCardsProps {
  totalTransactions: number;
  totalPointsEarned: number;
  totalPointsSpent: number;
  totalRewardsRedeemed: number;
}

export function StatsCards({
  totalTransactions,
  totalPointsEarned,
  totalPointsSpent,
  totalRewardsRedeemed,
}: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
      <Card className="shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Total de Transações
          </CardTitle>
          <History className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {totalTransactions}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Transações realizadas
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Pontos Ganhos
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {totalPointsEarned.toLocaleString()}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Total acumulado
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Pontos Gastos
          </CardTitle>
          <Gift className="h-4 w-4 text-purple-600 dark:text-purple-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {totalPointsSpent.toLocaleString()}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Total utilizado
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Prêmios Resgatados
          </CardTitle>
          <Award className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {totalRewardsRedeemed}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Resgates concluídos
          </p>
        </CardContent>
      </Card>
    </div>
  );
}





