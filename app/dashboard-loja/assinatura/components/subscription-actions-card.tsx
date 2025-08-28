import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Calendar } from "lucide-react";

interface SubscriptionActionsCardProps {
  onCancelSubscription: () => void;
  isCancelling: boolean;
}

export function SubscriptionActionsCard({
  onCancelSubscription,
  isCancelling,
}: SubscriptionActionsCardProps) {
  return (
    <Card className="shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-gray-100">
          Gerenciar Assinatura
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          Ações relacionadas à sua assinatura
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-4">
          <Button
            variant="outline"
            className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100 hover:bg-gray-50"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Alterar Método de Pagamento
          </Button>
          <Button
            variant="outline"
            className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100 hover:bg-gray-50"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Histórico de Faturas
          </Button>
          <Button
            variant="outline"
            className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 bg-transparent border-red-300 dark:border-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
            onClick={onCancelSubscription}
            disabled={isCancelling}
          >
            {isCancelling ? "Cancelando..." : "Cancelar Assinatura"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
