import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, CreditCard } from "lucide-react";
import Link from "next/link";
import { TransactionCard } from "./transaction-card";
import { Skeleton } from "@/components/ui/skeleton";

interface TransactionsListProps {
  transactions: any[];
  total: number;
  isLoading: boolean;
}

export function TransactionsList({
  transactions,
  total,
  isLoading,
}: TransactionsListProps) {
  if (isLoading) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Lista de Transações</CardTitle>
          <CardDescription>Carregando...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-lg" />
                  <div>
                    <Skeleton className="h-5 w-32 mb-1" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                </div>
                <div className="text-right">
                  <Skeleton className="h-6 w-20 mb-1" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-gray-100">
          Lista de Transações
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          Todas as transações realizadas pelos seus clientes
        </CardDescription>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-12">
            <CreditCard className="h-20 w-20 mx-auto text-gray-300 dark:text-gray-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-500 dark:text-gray-400 mb-2">
              Nenhuma transação encontrada
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Nenhuma transação encontrada. Comece criando sua primeira
              transação!
            </p>
            <Link href="/dashboard-loja/transacoes/nova">
              <Button className="dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeira Transação
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <TransactionCard key={transaction.id} transaction={transaction} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
