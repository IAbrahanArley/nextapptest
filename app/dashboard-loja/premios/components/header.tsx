import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

interface HeaderProps {
  canCreateMoreRewards: boolean;
}

export function Header({ canCreateMoreRewards }: HeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
          Prêmios
        </h1>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
          Gerencie os prêmios disponíveis para resgate
        </p>
      </div>
      <Link href="/dashboard-loja/premios/novo">
        <Button
          disabled={!canCreateMoreRewards}
          className="dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Prêmio
        </Button>
      </Link>
    </div>
  );
}
