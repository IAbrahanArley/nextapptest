"use client";

import { useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useStoreId } from "@/hooks/queries/use-store-id";
import { useDashboardStats } from "@/hooks/queries/use-dashboard-stats";
import { DashboardHomeSkeleton } from "@/components/ui/dashboard-skeleton";
import { Header, StatsCards, SalesChart, TopClients } from "./components";

export function DashboardClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: storeIdData } = useStoreId();
  const storeId = storeIdData?.data?.storeId;

  const { data: stats, isLoading, error } = useDashboardStats(storeId || "");

  const handleSuccessRedirect = useCallback(() => {
    const success = searchParams.get("success");
    const sessionId = searchParams.get("session_id");

    if (success === "true" && sessionId) {
      router.replace(`/dashboard-loja/success?session_id=${sessionId}`);
    }
  }, [searchParams, router]);

  useEffect(() => {
    handleSuccessRedirect();
  }, [handleSuccessRedirect]);

  // Debug logs para verificar os dados
  useEffect(() => {
    if (stats) {
      console.log("=== DEBUG DASHBOARD STATS ===");
      console.log("Stats completos:", stats);
      console.log("Monthly data:", stats.monthlyData);
      console.log("Monthly data length:", stats.monthlyData?.length);
      console.log("Primeiro item:", stats.monthlyData?.[0]);
    }
  }, [stats]);

  if (isLoading) {
    return <DashboardHomeSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-destructive mb-4">
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

  const totalSales =
    monthlyData.length > 0
      ? monthlyData.reduce(
          (acc: number, item: any) => acc + (item.vendas || 0),
          0
        )
      : 0;

  return (
    <div className="space-y-6">
      <Header />

      <StatsCards
        totalClients={totalClients}
        totalPointsDistributed={totalPointsDistributed}
        totalRewardsRedeemed={totalRewardsRedeemed}
        pointsGrowth={pointsGrowth}
        clientsGrowth={clientsGrowth}
        totalSales={totalSales}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart monthlyData={monthlyData} />
        <TopClients topClients={topClients} />
      </div>
    </div>
  );
}
