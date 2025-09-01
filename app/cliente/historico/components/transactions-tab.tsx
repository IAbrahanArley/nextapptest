import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  Calendar,
} from "lucide-react";
import { Transaction } from "../types";

interface TransactionsTabProps {
  transactions: Transaction[];
}

export function TransactionsTab({ transactions }: TransactionsTabProps) {
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
        return (
          <ArrowUpRight className="h-5 w-5 text-green-600 dark:text-green-400" />
        );
      case "redeem":
        return (
          <ArrowDownLeft className="h-5 w-5 text-red-600 dark:text-red-400" />
        );
      case "expire":
        return (
          <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
        );
      default:
        return (
          <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        );
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "award":
        return "text-green-600 dark:text-green-400";
      case "redeem":
        return "text-red-600 dark:text-red-400";
      case "expire":
        return "text-orange-600 dark:text-orange-400";
      default:
        return "text-blue-600 dark:text-blue-400";
    }
  };

  return (
    <Card className="shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <CardHeader className="rounded-t-lg">
        <CardTitle className="text-lg sm:text-xl text-gray-900 dark:text-gray-100">
          Transações de Pontos
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          Histórico completo de suas transações de pontos
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        {transactions.length === 0 ? (
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
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg flex items-center justify-center bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex-shrink-0">
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                        {transaction.store_name}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {transaction.type === "award" ? "Ganho" : "Uso"}
                      </Badge>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-2 truncate">
                      {transaction.reference}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <Calendar className="h-3 w-3 flex-shrink-0" />
                      {formatDate(transaction.created_at)}
                    </div>
                  </div>
                </div>
                <div className="text-center sm:text-right">
                  <p
                    className={`text-lg sm:text-xl font-bold ${getTransactionColor(
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
  );
}





