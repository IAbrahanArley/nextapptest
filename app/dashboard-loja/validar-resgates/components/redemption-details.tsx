import { Badge } from "@/components/ui/badge";
import { Gift, User, Calendar, MapPin } from "lucide-react";

interface RedemptionDetailsProps {
  redemption: {
    id: string;
    cost_points: number;
    status: string;
    validation_status: string;
    redeemed_at: string;
    metadata: any;
    user: {
      name: string;
      email: string;
    };
    reward: {
      title: string;
      description: string;
      type: string;
    };
    store: {
      name: string;
      address: string;
    };
  };
}

export function RedemptionDetails({ redemption }: RedemptionDetailsProps) {
  const getStatusBadge = (status: string) => {
    return status === "pending"
      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-700"
      : "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-700";
  };

  const getStatusText = (status: string) => {
    return status === "pending" ? "Pendente" : "Validado";
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Gift className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {redemption.reward.title}
          </span>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400">
          {redemption.reward.description}
        </p>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span className="text-gray-700 dark:text-gray-300">
              {redemption.user.name}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span className="text-gray-700 dark:text-gray-300">
              Resgatado em{" "}
              {new Date(redemption.redeemed_at).toLocaleDateString("pt-BR")}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span className="text-gray-700 dark:text-gray-300">
              {redemption.store.name}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <Badge
            variant="outline"
            className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
          >
            {redemption.cost_points} pontos
          </Badge>
          <Badge className={getStatusBadge(redemption.status)}>
            {getStatusText(redemption.status)}
          </Badge>
        </div>
      </div>
    </div>
  );
}
