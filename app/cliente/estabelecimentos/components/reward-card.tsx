import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gift } from "lucide-react";

import { Reward } from "../types";

interface RewardCardProps {
  reward: Reward;
  userPoints: number;
  onRedeem: (reward: Reward) => void;
}

export function RewardCard({ reward, userPoints, onRedeem }: RewardCardProps) {
  const canRedeem = userPoints >= reward.cost_points;

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "product":
        return "Produto";
      case "discount":
        return "Desconto";
      default:
        return "Cupom";
    }
  };

  const getTypeVariant = (type: string) => {
    switch (type) {
      case "product":
        return "default";
      case "discount":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="w-56 sm:w-64 h-44 sm:h-48 border border-gray-200 dark:border-gray-600 rounded-lg p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <Badge
          variant={getTypeVariant(reward.type) as any}
          className="text-xs dark:bg-gray-700 dark:text-gray-300"
        >
          {getTypeLabel(reward.type)}
        </Badge>
        <Badge variant="destructive" className="text-xs dark:bg-red-600">
          {reward.cost_points.toLocaleString()} pts
        </Badge>
      </div>

      <h5 className="font-semibold text-sm mb-2 line-clamp-2 text-gray-900 dark:text-gray-100">
        {reward.title}
      </h5>

      {reward.description && (
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2 flex-1">
          {reward.description}
        </p>
      )}

      <div className="mt-auto">
        <Button
          size="sm"
          className="w-full text-xs"
          disabled={!canRedeem}
          onClick={() => onRedeem(reward)}
        >
          <Gift className="h-3 w-3 mr-1" />
          {canRedeem ? "Resgatar Prêmio" : "Pontos insuficientes"}
        </Button>
      </div>
    </div>
  );
}
