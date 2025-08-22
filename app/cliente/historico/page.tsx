"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  History,
  TrendingUp,
  Gift,
  Store,
  Calendar,
  RefreshCw,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  Award,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import HistoricoLoading from "./loading";

interface Transaction {
  id: string;
  store_name: string;
  type: "award" | "redeem" | "expire" | "adjustment";
  amount: number;
  reference: string;
  created_at: string;
  metadata?: any;
}

interface RewardRedemption {
  id: string;
  store_name: string;
  reward_name: string;
  cost_points: number;
  status: "pending" | "completed" | "cancelled";
  created_at: string;
  metadata?: any;
}

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

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "award":
        return <ArrowUpRight className="h-5 w-5 text-green-600" />;
      case "redeem":
        return <ArrowDownLeft className="h-5 w-5 text-red-600" />;
      case "expire":
        return <Clock className="h-5 w-5 text-orange-600" />;
      default:
        return <TrendingUp className="h-5 w-5 text-blue-600" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "award":
        return "text-green-600";
      case "redeem":
        return "text-red-600";
      case "expire":
        return "text-orange-600";
      default:
        return "text-blue-600";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="default" className="bg-green-600">
            Concluído
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Pendente
          </Badge>
        );
      case "cancelled":
        return <Badge variant="destructive">Cancelado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="border border-gray-200 rounded-lg shadow-sm p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-100 mb-2">
            Histórico de Atividades
          </h1>
          <p className="text-gray-600 text-lg">
            Acompanhe todas as suas transações e resgates de prêmios
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">
                Total de Transações
              </CardTitle>
              <History className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {transactions.length}
              </div>
              <p className="text-xs text-gray-500">Transações realizadas</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">
                Pontos Ganhos
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {totalPointsEarned.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500">Total acumulado</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">
                Pontos Gastos
              </CardTitle>
              <Gift className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {totalPointsSpent.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500">Total utilizado</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">
                Prêmios Resgatados
              </CardTitle>
              <Award className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {totalRewardsRedeemed}
              </div>
              <p className="text-xs text-gray-500">Resgates concluídos</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end mb-6">
          <Button
            variant="outline"
            onClick={fetchData}
            disabled={isLoading}
            className="border-gray-300 text-gray-400 hover:bg-gray-50 hover:text-gray-700"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Atualizar
          </Button>
        </div>

        <Tabs defaultValue="transactions" className="w-full">
          <TabsList className="grid w-full grid-cols-2  shadow-sm">
            <TabsTrigger value="transactions" className="text-gray-100">
              Transações de Pontos
            </TabsTrigger>
            <TabsTrigger value="redemptions" className="text-gray-100">
              Resgates de Prêmios
            </TabsTrigger>
          </TabsList>

          <TabsContent value="transactions" className="space-y-6 mt-6">
            <Card className="shadow-sm">
              <CardHeader className="rounded-t-lg">
                <CardTitle className="text-xl text-gray-100">
                  Transações de Pontos
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Histórico completo de suas transações de pontos
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {transactions.length === 0 ? (
                  <div className="text-center py-12">
                    <TrendingUp className="h-20 w-20 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-500 mb-2">
                      Nenhuma transação encontrada
                    </h3>
                    <p className="text-gray-400">
                      Você ainda não tem transações de pontos.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {transactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-lg flex items-center justify-center bg-white border border-gray-200">
                            {getTransactionIcon(transaction.type)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium text-gray-900">
                                {transaction.store_name}
                              </p>
                              <Badge variant="outline" className="text-xs">
                                {transaction.type === "award" ? "Ganho" : "Uso"}
                              </Badge>
                            </div>
                            <p className="text-gray-600 text-sm mb-2">
                              {transaction.reference}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Calendar className="h-3 w-3" />
                              {formatDate(transaction.created_at)}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={`text-xl font-bold ${getTransactionColor(
                              transaction.type
                            )}`}
                          >
                            {transaction.type === "award" ? "+" : "-"}
                            {Math.abs(transaction.amount)} pts
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="redemptions" className="space-y-6 mt-6">
            <Card className="shadow-sm">
              <CardHeader className="rounded-t-lg">
                <CardTitle className="text-xl text-gray-100">
                  Resgates de Prêmios
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Histórico de todos os prêmios que você resgatou
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {rewardRedemptions.length === 0 ? (
                  <div className="text-center py-12">
                    <Gift className="h-20 w-20 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-500 mb-2">
                      Nenhum resgate encontrado
                    </h3>
                    <p className="text-gray-400">
                      Você ainda não resgatou nenhum prêmio.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {rewardRedemptions.map((redemption) => (
                      <div
                        key={redemption.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-lg flex items-center justify-center bg-white border border-gray-200">
                            <Gift className="h-6 w-6 text-purple-600" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium text-gray-900">
                                {redemption.reward_name}
                              </p>
                              {getStatusBadge(redemption.status)}
                            </div>
                            <p className="text-gray-600 text-sm mb-2">
                              {redemption.store_name}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Calendar className="h-3 w-3" />
                              {formatDate(redemption.created_at)}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-purple-600">
                            -{redemption.cost_points.toLocaleString()} pts
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
