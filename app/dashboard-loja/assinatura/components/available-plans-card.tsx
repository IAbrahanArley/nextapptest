import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star } from "lucide-react";
import { plans } from "@/lib/plans";
import { getPlanById } from "@/lib/plans";

interface AvailablePlansCardProps {
  subscriptionData: any;
  onPlanChange: (newPlanId: string) => void;
  isChangingPlan: boolean;
}

export function AvailablePlansCard({
  subscriptionData,
  onPlanChange,
  isChangingPlan,
}: AvailablePlansCardProps) {
  const currentPlan = getPlanById(subscriptionData.subscription.planId);

  if (!currentPlan) {
    return null;
  }

  return (
    <Card className="shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-gray-100">
          Planos Disponíveis
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          Escolha o plano ideal para o tamanho do seu negócio
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, index) => {
            const isCurrentPlan = plan.id === currentPlan.id;
            const isUpgrade = plan.price > currentPlan.price;
            const isDowngrade = plan.price < currentPlan.price;

            return (
              <div
                key={index}
                className={`relative group ${plan.popular ? "scale-105" : ""} ${
                  isCurrentPlan ? "ring-2 ring-blue-500" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-current" />
                      <span>Mais Popular</span>
                    </div>
                  </div>
                )}

                {isCurrentPlan && (
                  <div className="absolute -top-4 right-4">
                    <Badge
                      variant="default"
                      className="bg-blue-600 dark:bg-blue-600"
                    >
                      Plano Atual
                    </Badge>
                  </div>
                )}

                <div
                  className={`bg-white dark:bg-gray-800 rounded-2xl p-6 h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-gray-200 dark:border-gray-700 ${
                    plan.popular
                      ? "ring-2 ring-purple-500 shadow-lg"
                      : isCurrentPlan
                      ? "ring-2 ring-blue-500 shadow-lg"
                      : "shadow-sm"
                  }`}
                >
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">
                      {plan.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                      {plan.description}
                    </p>
                    <div className="mb-4">
                      <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        {plan.custom
                          ? "Customizado"
                          : `R$ ${plan.price.toFixed(2).replace(".", ",")}`}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400 text-sm">
                        {plan.custom ? "" : "/mês"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className="flex items-center space-x-3"
                      >
                        <Check className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {isCurrentPlan ? (
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100"
                      disabled
                    >
                      Plano Atual
                    </Button>
                  ) : (
                    <Button
                      variant={isUpgrade ? "default" : "outline"}
                      size="lg"
                      className="w-full dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white hover:bg-blue-700"
                      onClick={() => onPlanChange(plan.id)}
                      disabled={isChangingPlan}
                    >
                      {isChangingPlan
                        ? "Alterando..."
                        : isUpgrade
                        ? "Fazer Upgrade"
                        : "Fazer Downgrade"}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
