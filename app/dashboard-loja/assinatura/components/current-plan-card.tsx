import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Calendar, CreditCard, AlertTriangle } from "lucide-react";
import { getPlanById } from "@/lib/plans";

interface CurrentPlanCardProps {
  subscriptionData: any;
}

export function CurrentPlanCard({ subscriptionData }: CurrentPlanCardProps) {
  const currentPlan = getPlanById(subscriptionData.subscription.planId);

  if (!currentPlan) {
    return null;
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("pt-BR");
  };

  const formatCardNumber = (last4: string) => {
    return `•••• •••• •••• ${last4}`;
  };

  return (
    <Card className="shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Crown className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <div>
              <CardTitle className="text-xl sm:text-2xl text-gray-900 dark:text-gray-100">
                Plano {currentPlan.name}
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                R$ {currentPlan.price.toFixed(2).replace(".", ",")}/mês
              </CardDescription>
            </div>
          </div>
          <Badge
            variant={
              subscriptionData.stripeData.status === "active"
                ? "default"
                : "secondary"
            }
            className="w-fit"
          >
            {subscriptionData.stripeData.status === "active"
              ? "Ativo"
              : "Inativo"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Próxima cobrança
              </p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {formatDate(subscriptionData.stripeData.currentPeriodEnd)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CreditCard className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Método de pagamento
              </p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {subscriptionData.customer.defaultPaymentMethod?.card
                  ? formatCardNumber(
                      subscriptionData.customer.defaultPaymentMethod.card.last4
                    )
                  : "Não configurado"}
              </p>
            </div>
          </div>
        </div>

        {subscriptionData.stripeData.cancelAtPeriodEnd && (
          <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                Sua assinatura será cancelada em{" "}
                {formatDate(subscriptionData.stripeData.currentPeriodEnd)}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
