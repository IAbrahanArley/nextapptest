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
import {
  Store,
  Gift,
  TrendingUp,
  Calendar,
  Star,
  MapPin,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import PontosLoading from "./loading";

interface StoreBalance {
  id: string;
  store_name: string;
  points: number;
  store_logo?: string;
  store_address?: string;
  store_phone?: string;
  store_website?: string;
  store_instagram?: string;
  last_transaction_date?: string;
}

interface Transaction {
  id: string;
  store_name: string;
  type: "award" | "redeem" | "expire" | "adjustment";
  amount: number;
  reference: string;
  created_at: string;
  metadata?: any;
}

export default function ClientePontosPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [storeBalances, setStoreBalances] = useState<StoreBalance[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);

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
      const balancesResponse = await fetch("/api/clients/balances");
      if (balancesResponse.ok) {
        const balancesData = await balancesResponse.json();
        setStoreBalances(balancesData.balances || []);
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

  const totalPoints = storeBalances.reduce(
    (sum, balance) => sum + balance.points,
    0
  );

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (status === "loading" || isLoading) {
    return <PontosLoading />;
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="border border-gray-200 rounded-lg shadow-sm p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-100 mb-2">
            Olá, {session.user.name}!
          </h1>
          <p className="text-gray-600 text-lg">
            Acompanhe seus pontos e recompensas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className=" shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">
                Total de Pontos
              </CardTitle>
              <Star className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {totalPoints.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500">Disponíveis para resgate</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">
                Estabelecimentos
              </CardTitle>
              <Store className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {storeBalances.length}
              </div>
              <p className="text-xs text-gray-500">Com pontos ativos</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">
                Transações Recentes
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {recentTransactions.length}
              </div>
              <p className="text-xs text-gray-500">Últimas 30 dias</p>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-sm mb-8">
          <CardHeader className="rounded-t-lg">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl text-gray-100">
                  Meus Pontos por Estabelecimento
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Acompanhe seus pontos em cada loja cadastrada
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchData}
                disabled={isLoading}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
                />
                Atualizar
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {storeBalances.length === 0 ? (
              <div className="text-center py-12">
                <Store className="h-20 w-20 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-500 mb-2">
                  Nenhum ponto acumulado
                </h3>
                <p className="text-gray-400">
                  Você ainda não acumulou pontos em nenhuma loja parceira.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {storeBalances.map((estabelecimento) => (
                  <div
                    key={estabelecimento.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center border border-border">
                          {estabelecimento.store_logo ? (
                            <img
                              src={estabelecimento.store_logo}
                              alt={estabelecimento.store_name}
                              className="h-8 w-8 rounded object-cover"
                            />
                          ) : (
                            <Store className="h-6 w-6 text-primary" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900">
                            {estabelecimento.store_name}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>Loja parceira</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">
                          {estabelecimento.points.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">pontos</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      {estabelecimento.store_address && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {estabelecimento.store_address}
                        </div>
                      )}
                      {estabelecimento.last_transaction_date && (
                        <div>
                          <span className="font-medium">
                            Última transação:{" "}
                          </span>
                          {formatDate(estabelecimento.last_transaction_date)}
                        </div>
                      )}
                    </div>

                    <div className="mt-3 flex gap-2">
                      <Link
                        href={`/cliente/estabelecimentos/${estabelecimento.id}`}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                          Ver Detalhes
                        </Button>
                      </Link>
                      <Link href="/cliente/premios">
                        <Button size="sm">
                          <Gift className="h-4 w-4 mr-2" />
                          Resgatar
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="rounded-t-lg">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl text-gray-100">
                  Atividade Recente
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Suas últimas transações e resgates
                </CardDescription>
              </div>
              <Link href="/cliente/historico">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-300 text-gray-400 hover:bg-gray-50 hover:text-gray-700"
                >
                  Ver Tudo
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {recentTransactions.length === 0 ? (
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
                {recentTransactions.slice(0, 5).map((transacao) => (
                  <div
                    key={transacao.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                          transacao.type === "award"
                            ? "bg-green-100 border border-green-200"
                            : "bg-blue-100 border border-blue-200"
                        }`}
                      >
                        {transacao.type === "award" ? (
                          <TrendingUp className="h-5 w-5 text-green-600" />
                        ) : (
                          <Gift className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {transacao.store_name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {transacao.reference}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-bold ${
                          transacao.type === "award"
                            ? "text-green-600"
                            : "text-blue-600"
                        }`}
                      >
                        {transacao.type === "award" ? "+" : "-"}
                        {Math.abs(transacao.amount)} pts
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(transacao.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
