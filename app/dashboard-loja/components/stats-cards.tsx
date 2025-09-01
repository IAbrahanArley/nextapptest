"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, CreditCard, Gift, TrendingUp } from "lucide-react";

interface StatsCardsProps {
  totalClients: number;
  totalPointsDistributed: number;
  totalRewardsRedeemed: number;
  pointsGrowth: number;
  clientsGrowth: number;
  totalSales: number;
}

export function StatsCards({
  totalClients,
  totalPointsDistributed,
  totalRewardsRedeemed,
  pointsGrowth,
  clientsGrowth,
  totalSales,
}: StatsCardsProps) {
  const stats = [
    {
      title: "Clientes Ativos",
      value: totalClients.toLocaleString(),
      description: `${
        clientsGrowth >= 0 ? "+" : ""
      }${clientsGrowth}% em relação ao mês passado`,
      icon: Users,
      className: "text-blue-500 dark:text-blue-400",
    },
    {
      title: "Pontos Distribuídos",
      value: totalPointsDistributed.toLocaleString(),
      description: `${
        pointsGrowth >= 0 ? "+" : ""
      }${pointsGrowth}% em relação ao mês passado`,
      icon: CreditCard,
      className: "text-green-500 dark:text-green-400",
    },
    {
      title: "Prêmios Resgatados",
      value: totalRewardsRedeemed.toLocaleString(),
      description: "Total de resgates realizados",
      icon: Gift,
      className: "text-purple-500 dark:text-purple-400",
    },
    {
      title: "Vendas Totais",
      value: totalSales.toLocaleString(),
      description: "Transações dos últimos 6 meses",
      icon: TrendingUp,
      className: "text-orange-500 dark:text-orange-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.className}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stat.value}
            </div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
