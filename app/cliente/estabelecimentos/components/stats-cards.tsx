import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Store, Users, Gift, Star } from "lucide-react";

interface StatsCardsProps {
  stores: any[];
}

export function StatsCards({ stores }: StatsCardsProps) {
  const totalStores = stores.length;
  const partnerStores = stores.filter((store) => store.is_partner).length;
  const storesWithRewards = stores.filter(
    (store) => store.rewards && store.rewards.length > 0
  ).length;
  const totalRewards = stores.reduce((total, store) => {
    return total + (store.rewards ? store.rewards.length : 0);
  }, 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
      <Card className="shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Total de Lojas
          </CardTitle>
          <Store className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-500">
            {totalStores}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Estabelecimentos cadastrados
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Lojas Parceiras
          </CardTitle>
          <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600 dark:text-green-500">
            {partnerStores}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Com programa de fidelidade
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Lojas com Prêmios
          </CardTitle>
          <Gift className="h-4 w-4 text-purple-600 dark:text-purple-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-500">
            {storesWithRewards}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Oferecendo recompensas
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Total de Prêmios
          </CardTitle>
          <Star className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-500">
            {totalRewards}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Recompensas disponíveis
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
