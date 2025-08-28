"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import HistoricoLoading from "./loading";
import { Header, StatsCards, RefreshButton, HistoryTabs } from "./components";
import { Transaction, RewardRedemption } from "./types";

export default function HistoricoPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [rewardRedemptions, setRewardRedemptions] = useState<
    RewardRedemption[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingRewards, setIsLoadingRewards] = useState(false);

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.push("/login?type=customer");
      return;
    }

    if (session?.user?.role !== "customer") {
      router.push("/login?type=customer");
      return;
    }

    fetchData();
  }, [session, status, router]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const transactionsResponse = await fetch(
        "/api/clients/recent-transactions"
      );
      if (transactionsResponse.ok) {
        const data = await transactionsResponse.json();
        setTransactions(data.transactions || []);
      }

      await fetchRewardRedemptions();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar o histórico",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRewardRedemptions = async () => {
    setIsLoadingRewards(true);
    try {
      const response = await fetch("/api/clients/reward-redemptions");
      if (response.ok) {
        const data = await response.json();
        setRewardRedemptions(data.redemptions || []);
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar resgates",
        variant: "destructive",
      });
    } finally {
      setIsLoadingRewards(false);
    }
  };

  if (status === "loading" || isLoading) {
    return <HistoricoLoading />;
  }

  if (!session?.user) {
    return null;
  }

  const totalPointsEarned = transactions
    .filter((t) => t.type === "award")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const totalPointsSpent = transactions
    .filter((t) => t.type === "redeem")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const totalRewardsRedeemed = rewardRedemptions.filter(
    (r) => r.status === "completed"
  ).length;

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
        <Header />

        <StatsCards
          totalTransactions={transactions.length}
          totalPointsEarned={totalPointsEarned}
          totalPointsSpent={totalPointsSpent}
          totalRewardsRedeemed={totalRewardsRedeemed}
        />

        <RefreshButton isLoading={isLoading} onRefresh={fetchData} />

        <HistoryTabs
          transactions={transactions}
          rewardRedemptions={rewardRedemptions}
        />
      </div>
    </div>
  );
}
