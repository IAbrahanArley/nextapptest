import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, CreditCard } from "lucide-react";

interface StatsCardsProps {
  totalPontos: number;
  totalVendas: number;
  transacoesHoje: number;
}

export function StatsCards({
  totalPontos,
  totalVendas,
  transacoesHoje,
}: StatsCardsProps) {
  const formatCurrency = (value: number | null | undefined) => {
    if (value === null || value === undefined || isNaN(value)) {
      return "R$ 0,00";
    }

    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <Card className="shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Total de Pontos
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {totalPontos?.toLocaleString() || "0"}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Total de Vendas
          </CardTitle>
          <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {formatCurrency(totalVendas || 0)}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Transações Hoje
          </CardTitle>
          <CreditCard className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {transacoesHoje || "0"}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
