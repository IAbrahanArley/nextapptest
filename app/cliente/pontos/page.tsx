"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import PontosLoading from "./loading";
import {
  Header,
  NFCeScannerCard,
  StatsCards,
  StoreBalances,
  RecentActivity,
  NFCeModal,
} from "./components";
import { StoreBalance, BalancesResponse, Transaction } from "./types";

export default function ClientePontosPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [storeBalances, setStoreBalances] = useState<StoreBalance[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [showNFCEscanner, setShowNFCEscanner] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);

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
      console.log("🔍 [CLIENTE] Chamando API de saldos...");
      const balancesResponse = await fetch("/api/clients/balances");
      console.log(
        "🔍 [CLIENTE] Resposta da API:",
        balancesResponse.status,
        balancesResponse.ok
      );

      if (balancesResponse.ok) {
        const balancesData: BalancesResponse = await balancesResponse.json();
        console.log("🔍 [CLIENTE] Dados recebidos da API:", balancesData);
        setStoreBalances(balancesData.balances || []);
        setTotalPoints(balancesData.totalPoints || 0);
        console.log("🔍 [CLIENTE] Estado atualizado:", {
          storeBalances: balancesData.balances || [],
          totalPoints: balancesData.totalPoints || 0,
        });
      } else {
        console.error(
          "❌ [CLIENTE] Erro na API de saldos:",
          balancesResponse.status
        );
      }

      const transactionsResponse = await fetch(
        "/api/clients/recent-transactions"
      );
      if (transactionsResponse.ok) {
        const transactionsData = await transactionsResponse.json();
        setRecentTransactions(transactionsData.transactions || []);
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNFCEscan = (sefazUrl: string) => {
    console.log("NFC-e escaneada:", sefazUrl);
    setShowNFCEscanner(false);
    fetchData();
  };

  const openScanner = () => {
    console.log("Abrindo scanner NFC-e...");
    setShowNFCEscanner(true);
  };

  const closeScanner = () => {
    console.log("Fechando scanner NFC-e...");
    setShowNFCEscanner(false);
  };

  const handleDebug = () => {
    console.log("🔍 [DEBUG] Estado atual:", {
      storeBalances,
      totalPoints,
      recentTransactions,
    });
  };

  if (status === "loading" || isLoading) {
    return <PontosLoading />;
  }

  if (!session?.user) {
    return null;
  }

  const activeStores = storeBalances.filter(
    (balance) => balance.points > 0
  ).length;

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
        <Header userName={session.user.name || "Usuário"} />

        <NFCeScannerCard onOpenScanner={openScanner} />

        <StatsCards
          totalPoints={totalPoints}
          activeStores={activeStores}
          recentTransactions={recentTransactions.length}
        />

        <StoreBalances
          storeBalances={storeBalances}
          isLoading={isLoading}
          onRefresh={fetchData}
          onDebug={handleDebug}
        />

        <RecentActivity recentTransactions={recentTransactions} />

        <NFCeModal
          isOpen={showNFCEscanner}
          onClose={closeScanner}
          onScan={handleNFCEscan}
        />
      </div>
    </div>
  );
}
