import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Store as StoreIcon, MapPin, Phone, Star, Gift } from "lucide-react";
import { RewardCard } from "./reward-card";

import { Reward, Store } from "../types";

interface StoreCardProps {
  store: Store;
  onRedeemReward: (reward: Reward, store: Store) => void;
}

export function StoreCard({ store, onRedeemReward }: StoreCardProps) {
  const handleRedeemReward = (reward: Reward) => {
    onRedeemReward(reward, store);
  };

  return (
    <Card className="shadow-sm hover:shadow-lg transition-all duration-200 border-2 border-gray-200 dark:border-gray-600 w-full dark:bg-gray-800">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex items-start gap-4">
            {store.logo_url ? (
              <img
                src={store.logo_url}
                alt={store.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border border-gray-200 dark:border-gray-600 flex-shrink-0"
              />
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center border border-gray-200 dark:border-gray-600 flex-shrink-0">
                <StoreIcon className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600 dark:text-blue-400" />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <CardTitle className="text-xl sm:text-2xl text-gray-900 dark:text-gray-100 mb-2">
                {store.name}
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400 text-base sm:text-lg">
                {store.description || "Loja parceira"}
              </CardDescription>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
            >
              {store.category || "Geral"}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500 dark:text-yellow-400 fill-current" />
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {store.rating?.toFixed(1) || "N/A"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-900 dark:text-gray-100 text-sm">
              Seus pontos:
            </span>
            <Badge
              variant={store.points > 0 ? "default" : "secondary"}
              className={
                store.points > 0
                  ? "bg-green-600 dark:bg-green-500"
                  : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
              }
            >
              {store.points.toLocaleString()} pts
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            {store.is_partner ? (
              <Badge
                variant="default"
                className="bg-green-600 dark:bg-green-500"
              >
                Parceiro
              </Badge>
            ) : (
              <Badge
                variant="secondary"
                className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
              >
                Não parceiro
              </Badge>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
          {store.address && (
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span className="break-words">{store.address}</span>
            </div>
          )}
          {store.phone && (
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
              <Phone className="h-4 w-4 flex-shrink-0" />
              <span>{store.phone}</span>
            </div>
          )}
          <span className="text-xs text-gray-900 dark:text-gray-100">
            {(store.total_customers || 0).toLocaleString()} clientes
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {store.rewards && store.rewards.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <Gift className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              Todos os Prêmios Disponíveis
            </h4>
            <div className="overflow-x-auto -mx-4 px-4">
              <div className="flex gap-3 sm:gap-4 pb-2 min-w-max">
                {store.rewards.map((reward) => (
                  <RewardCard
                    key={reward.id}
                    reward={reward}
                    userPoints={store.points}
                    onRedeem={handleRedeemReward}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {(!store.rewards || store.rewards.length === 0) && (
          <div className="pt-4 text-center">
            {store.is_partner ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Esta loja ainda não possui prêmios cadastrados.
              </p>
            ) : (
              <Button variant="outline" className="w-full" disabled>
                Em breve
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
