import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Receipt } from "lucide-react";

interface PaymentHistoryCardProps {
  paymentHistory: any[];
}

export function PaymentHistoryCard({
  paymentHistory,
}: PaymentHistoryCardProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("pt-BR");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge variant="default" className="bg-green-600 dark:bg-green-600">
            Pago
          </Badge>
        );
      case "pending":
        return <Badge variant="secondary">Pendente</Badge>;
      case "failed":
        return <Badge variant="destructive">Falhou</Badge>;
      default:
        return <Badge variant="secondary">Desconhecido</Badge>;
    }
  };

  return (
    <Card className="shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-gray-100">
          Últimos Pagamentos
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          Histórico dos seus últimos pagamentos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {paymentHistory.map((payment) => (
            <div
              key={payment.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors gap-4"
            >
              <div className="flex items-center gap-4">
                <Receipt className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {payment.description}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(payment.date)}
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  R$ {payment.amount.toFixed(2).replace(".", ",")}
                </span>
                {getStatusBadge(payment.status)}
                {payment.invoiceUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100 hover:bg-gray-50"
                  >
                    <a
                      href={payment.invoiceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Receipt className="h-4 w-4 mr-2" />
                      Fatura
                    </a>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
