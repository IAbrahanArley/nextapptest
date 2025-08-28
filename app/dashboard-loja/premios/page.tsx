"use client";

import { useState, useEffect } from "react";
import { useRewards } from "@/hooks/queries/use-rewards";
import { useRewardsStats } from "@/hooks/queries/use-rewards-stats";
import { useDeleteReward } from "@/hooks/mutations/use-delete-reward";
import { useToast } from "@/hooks/use-toast";
import { useStoreId } from "@/hooks/queries/use-store-id";
import {
  Header,
  LimitWarning,
  StatsCards,
  SearchFilters,
  RewardsList,
} from "./components";

export default function PremiosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [mounted, setMounted] = useState(false);
  const { toast } = useToast();
  const { data: storeIdData, isLoading: isLoadingStoreId } = useStoreId();
  const storeId = storeIdData?.data?.storeId;

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: rewardsData, isLoading: isLoadingRewards } = useRewards({
    store_id: storeId || "",
  });

  const { data: statsData, isLoading: isLoadingStats } = useRewardsStats({
    store_id: storeId || "",
  });

  const deleteRewardMutation = useDeleteReward(storeId || "");

  const rewards = rewardsData?.data || [];
  const stats = statsData?.data;

  const filteredRewards = rewards.filter(
    (premio: any) =>
      premio.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      premio.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteReward = async (rewardId: string) => {
    try {
      await deleteRewardMutation.mutateAsync({ id: rewardId });
      toast({
        title: "Prêmio excluído",
        description: "O prêmio foi excluído com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao excluir prêmio:", error);
      toast({
        title: "Erro",
        description: "Erro ao excluir o prêmio. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const canCreateMoreRewards = () => {
    if (!stats?.plan_limits) return false;
    const { max_rewards } = stats.plan_limits;
    const currentCount = stats.total_rewards || 0;
    return max_rewards === -1 || currentCount < max_rewards;
  };

  const getRemainingRewards = () => {
    if (!stats?.plan_limits) return 0;
    const { max_rewards } = stats.plan_limits;
    if (max_rewards === -1) return "Ilimitado";
    const currentCount = stats.total_rewards || 0;
    return Math.max(0, max_rewards - currentCount);
  };

  // Não renderizar até que o componente esteja montado no cliente
  if (!mounted) {
    return null;
  }

  if (isLoadingStoreId || isLoadingRewards || isLoadingStats) {
    return null; // Loading é gerenciado pelo loading.tsx
  }

  if (!storeId) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                Prêmios
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Erro: Loja não encontrada
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
        <Header canCreateMoreRewards={canCreateMoreRewards()} />

        {/* Alerta de limite */}
        {stats?.plan_limits && !canCreateMoreRewards() && (
          <LimitWarning
            planName={stats.plan_limits.plan_name}
            maxRewards={stats.plan_limits.max_rewards}
          />
        )}

        <StatsCards
          totalRewards={stats?.total_rewards || 0}
          activeRewards={stats?.active_rewards || 0}
          monthlyRedemptions={stats?.monthly_redemptions || 0}
          remainingRewards={getRemainingRewards()}
          planName={stats?.plan_limits?.plan_name || "N/A"}
        />

        <SearchFilters
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
        />

        <RewardsList
          rewards={filteredRewards}
          isLoading={isLoadingRewards || isLoadingStats}
          onDelete={handleDeleteReward}
        />
      </div>
    </div>
  );
}
