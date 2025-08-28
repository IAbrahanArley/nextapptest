import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Gift } from "lucide-react";
import Link from "next/link";
import { RewardCard } from "./reward-card";

interface RewardsListProps {
  rewards: any[];
  isLoading: boolean;
  onDelete: (id: string) => void;
}

export function RewardsList({
  rewards,
  isLoading,
  onDelete,
}: RewardsListProps) {
  if (isLoading) {
    return (
      <Card className="shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Lista de Prêmios
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Carregando...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card
                key={i}
                className="bg-white dark:bg-gray-800 shadow-sm animate-pulse"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="h-6 w-32 bg-gray-200 dark:bg-gray-600 rounded" />
                    <div className="h-5 w-16 bg-gray-200 dark:bg-gray-600 rounded" />
                  </div>
                  <div className="h-4 w-48 bg-gray-200 dark:bg-gray-600 rounded" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-600 rounded" />
                    <div className="h-6 w-16 bg-gray-200 dark:bg-gray-600 rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-20 bg-gray-200 dark:bg-gray-600 rounded" />
                    <div className="h-4 w-16 bg-gray-200 dark:bg-gray-600 rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-600 rounded" />
                    <div className="h-5 w-20 bg-gray-200 dark:bg-gray-600 rounded" />
                  </div>
                  <div className="h-10 w-full bg-gray-200 dark:bg-gray-600 rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Lista de Prêmios
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          {rewards.length} prêmio(s) encontrado(s)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {rewards.length === 0 ? (
          <div className="text-center py-12">
            <Gift className="h-16 w-16 text-gray-300 dark:text-gray-500 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
              Nenhum prêmio encontrado
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
              Comece criando seu primeiro prêmio
            </p>
            <Link href="/dashboard-loja/premios/novo">
              <Button className="mt-4 dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Prêmio
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rewards.map((reward) => (
              <RewardCard key={reward.id} reward={reward} onDelete={onDelete} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
