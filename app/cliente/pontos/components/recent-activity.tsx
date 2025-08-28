import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Gift } from "lucide-react";
import Link from "next/link";
import { Transaction } from "../types";

interface RecentActivityProps {
  recentTransactions: Transaction[];
}

export function RecentActivity({ recentTransactions }: RecentActivityProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <Card className="shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <CardHeader className="rounded-t-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg sm:text-xl text-gray-900 dark:text-gray-100">
              Atividade Recente
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Suas últimas transações e resgates
            </CardDescription>
          </div>
          <Link href="/cliente/historico">
            <Button
              variant="outline"
              size="sm"
              className="w-full sm:w-auto border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-100"
            >
              Ver Tudo
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        {recentTransactions.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <TrendingUp className="h-16 w-16 sm:h-20 sm:w-20 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-500 dark:text-gray-400 mb-2">
              Nenhuma transação encontrada
            </h3>
            <p className="text-gray-400 dark:text-gray-500 text-sm sm:text-base">
              Você ainda não tem transações de pontos.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentTransactions.slice(0, 5).map((transacao) => (
              <div
                key={transacao.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      transacao.type === "award"
                        ? "bg-green-100 dark:bg-green-900 border border-green-200 dark:border-green-700"
                        : "bg-blue-100 dark:bg-blue-900 border border-blue-200 dark:border-blue-700"
                    }`}
                  >
                    {transacao.type === "award" ? (
                      <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                    ) : (
                      <Gift className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                      {transacao.store_name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {transacao.reference}
                    </p>
                  </div>
                </div>
                <div className="text-center sm:text-right">
                  <p
                    className={`font-bold text-sm sm:text-base ${
                      transacao.type === "award"
                        ? "text-green-600 dark:text-green-400"
                        : "text-blue-600 dark:text-blue-400"
                    }`}
                  >
                    {transacao.type === "award" ? "+" : "-"}
                    {Math.abs(transacao.amount)} pts
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(transacao.created_at)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}


