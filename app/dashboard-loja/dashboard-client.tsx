"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, CreditCard, Gift, TrendingUp, Plus } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Link from "next/link";
import { useStoreId } from "@/hooks/queries/use-store-id";
import { useDashboardStats } from "@/hooks/queries/use-dashboard-stats";
import { DashboardHomeSkeleton } from "@/components/ui/dashboard-skeleton";

export function DashboardClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: storeIdData } = useStoreId();
  const storeId = storeIdData?.data?.storeId;

  const { data: stats, isLoading, error } = useDashboardStats(storeId || "");

  useEffect(() => {
    const success = searchParams.get("success");
    const sessionId = searchParams.get("session_id");

    if (success === "true" && sessionId) {
      router.replace(`/dashboard-loja/success?session_id=${sessionId}`);
    }
  }, [searchParams, router]);

  if (isLoading) {
    return <DashboardHomeSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">
            Erro ao carregar dados do dashboard
          </p>
          <Button onClick={() => window.location.reload()}>
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  const {
    totalClients = 0,
    totalPointsDistributed = 0,
    totalRewardsRedeemed = 0,
    pointsGrowth = 0,
    clientsGrowth = 0,
    topClients = [],
    monthlyData = [],
  } = stats || {};

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-100">Dashboard</h1>
          <p className="text-gray-600">
            Visão geral do seu programa de fidelidade
          </p>
        </div>
        <div className="space-x-2">
          <Link href="/dashboard-loja/transacoes/nova">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Transação
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Clientes Ativos
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalClients.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {clientsGrowth >= 0 ? "+" : ""}
              {clientsGrowth}% em relação ao mês passado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pontos Distribuídos
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalPointsDistributed.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {pointsGrowth >= 0 ? "+" : ""}
              {pointsGrowth}% em relação ao mês passado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Prêmios Resgatados
            </CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalRewardsRedeemed.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Total de resgates realizados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas Totais</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {monthlyData.length > 0
                ? monthlyData
                    .reduce(
                      (acc: number, item: any) => acc + (item.vendas || 0),
                      0
                    )
                    .toLocaleString()
                : "0"}
            </div>
            <p className="text-xs text-muted-foreground">
              Transações dos últimos 6 meses
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Vendas e Pontos</CardTitle>
            <CardDescription>
              Evolução mensal das vendas e pontos distribuídos
            </CardDescription>
          </CardHeader>
          <CardContent>
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="vendas"
                    stroke="#3b82f6"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="pontos"
                    stroke="#10b981"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                Nenhum dado disponível para exibir
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Clientes</CardTitle>
            <CardDescription>
              Clientes com mais pontos acumulados
            </CardDescription>
          </CardHeader>
          <CardContent>
            {topClients.length > 0 ? (
              <div className="space-y-4">
                {topClients.slice(0, 5).map((client: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-900 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-100">
                          {client.nome || "Cliente"}
                        </p>
                        <p className="text-sm text-gray-100">
                          {(client.pontos || 0).toLocaleString()} pontos
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-100">
                        Última compra: {client.ultimaCompra || "N/A"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                Nenhum cliente encontrado
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
