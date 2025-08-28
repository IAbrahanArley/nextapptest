import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gift, Calendar } from "lucide-react";
import { RewardRedemption } from "../types";

interface RedemptionsTabProps {
  rewardRedemptions: RewardRedemption[];
}

export function RedemptionsTab({ rewardRedemptions }: RedemptionsTabProps) {
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="default" className="bg-green-600 dark:bg-green-500">
            Concluído
          </Badge>
        );
      case "pending":
        return (
          <Badge
            variant="secondary"
            className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
          >
            Pendente
          </Badge>
        );
      case "cancelled":
        return <Badge variant="destructive">Cancelado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card className="shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <CardHeader className="rounded-t-lg">
        <CardTitle className="text-lg sm:text-xl text-gray-900 dark:text-gray-100">
          Resgates de Prêmios
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          Histórico de todos os prêmios que você resgatou
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        {rewardRedemptions.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <Gift className="h-16 w-16 sm:h-20 sm:w-20 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-500 dark:text-gray-400 mb-2">
              Nenhum resgate encontrado
            </h3>
            <p className="text-gray-400 dark:text-gray-500 text-sm sm:text-base">
              Você ainda não resgatou nenhum prêmio.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {rewardRedemptions.map((redemption) => (
              <div
                key={redemption.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg flex items-center justify-center bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex-shrink-0">
                    <Gift className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                        {redemption.reward_name}
                      </p>
                      {getStatusBadge(redemption.status)}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-2 truncate">
                      {redemption.store_name}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <Calendar className="h-3 w-3 flex-shrink-0" />
                      {formatDate(redemption.created_at)}
                    </div>
                  </div>
                </div>
                <div className="text-center sm:text-right">
                  <p className="text-lg sm:text-xl font-bold text-purple-600 dark:text-purple-400">
                    -{redemption.cost_points.toLocaleString()} pts
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


