import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export function Header() {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
          Transações
        </h1>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
          Gerencie todas as transações de pontos dos seus clientes
        </p>
      </div>
      <Link href="/dashboard-loja/transacoes/nova">
        <Button className="dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Nova Transação
        </Button>
      </Link>
    </div>
  );
}
