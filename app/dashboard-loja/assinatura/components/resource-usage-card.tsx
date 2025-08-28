import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Users, MessageSquare, Gift, TrendingUp } from "lucide-react";
import { getPlanById } from "@/lib/plans";

interface ResourceUsageCardProps {
  usageData: any;
  subscriptionData: any;
}

export function ResourceUsageCard({
  usageData,
  subscriptionData,
}: ResourceUsageCardProps) {
  const currentPlan = getPlanById(subscriptionData.subscription.planId);

  if (!currentPlan || !usageData) {
    return null;
  }

  const getUsagePercentage = (current: number, limit: number) => {
    if (limit === -1) return 0;
    return Math.min((current / limit) * 100, 100);
  };

  return (
    <Card className="shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-gray-100">
          Uso dos Recursos
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          Acompanhe o uso dos recursos do seu plano atual
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Clientes
                </span>
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {usageData.usage.clientes}/
                {currentPlan.limits.clientes === -1
                  ? "∞"
                  : currentPlan.limits.clientes}
              </span>
            </div>
            <Progress
              value={getUsagePercentage(
                usageData.usage.clientes,
                currentPlan.limits.clientes
              )}
              className="h-2"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  WhatsApp
                </span>
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {usageData.usage.mensagensWhatsApp}/
                {currentPlan.limits.mensagensWhatsApp}
              </span>
            </div>
            <Progress
              value={getUsagePercentage(
                usageData.usage.mensagensWhatsApp,
                currentPlan.limits.mensagensWhatsApp
              )}
              className="h-2"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gift className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Prêmios
                </span>
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {usageData.usage.premios}/
                {currentPlan.limits.premios === -1
                  ? "∞"
                  : currentPlan.limits.premios}
              </span>
            </div>
            <Progress
              value={getUsagePercentage(
                usageData.usage.premios,
                currentPlan.limits.premios
              )}
              className="h-2"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Transações
                </span>
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {usageData.usage.transacoesMes}/
                {currentPlan.limits.transacoesMes === -1
                  ? "∞"
                  : currentPlan.limits.transacoesMes}
              </span>
            </div>
            <Progress
              value={getUsagePercentage(
                usageData.usage.transacoesMes,
                currentPlan.limits.transacoesMes
              )}
              className="h-2"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
