import { Badge } from "@/components/ui/badge";
import { CreditCard } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface TransactionCardProps {
  transaction: any;
}

export function TransactionCard({ transaction }: TransactionCardProps) {
  const formatCurrency = (value: number | null | undefined) => {
    if (value === null || value === undefined || isNaN(value)) {
      return "R$ 0,00";
    }

    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return "Data não disponível";

    try {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        return "Data inválida";
      }
      return format(dateObj, "dd/MM/yyyy", { locale: ptBR });
    } catch (error) {
      return "Data inválida";
    }
  };

  const getTransactionType = (type: string) => {
    return type === "redeem" ? "Resgate" : "Compra";
  };

  const getTransactionTypeColor = (type: string) => {
    return type === "redeem"
      ? "bg-red-100 text-red-800 border-red-200"
      : "bg-green-100 text-green-800 border-green-200";
  };

  const getPointsColor = (tipo: string) => {
    return tipo === "award" ? "text-green-600" : "text-blue-600";
  };

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-all duration-200 hover:shadow-sm">
      <div className="flex items-center gap-4 mb-4 lg:mb-0">
        <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center">
          <CreditCard className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="font-medium">
            {transaction.cliente || "Cliente não identificado"}
          </p>
          <p className="text-sm text-muted-foreground">
            {transaction.referencia || "Sem referência"}
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
            <span>{formatDate(transaction.data)}</span>
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="flex items-center gap-2 mb-2">
          <Badge
            variant="outline"
            className={getTransactionTypeColor(transaction.type)}
          >
            {getTransactionType(transaction.type)}
          </Badge>
        </div>
        <p className={`text-xl font-bold ${getPointsColor(transaction.tipo)}`}>
          {transaction.tipo === "award" ? "+" : "-"}
          {Math.abs(transaction.pontos || 0).toLocaleString()} pts
        </p>
        {transaction.valor && (
          <p className="text-sm text-muted-foreground">
            {formatCurrency(transaction.valor)}
          </p>
        )}
      </div>
    </div>
  );
}
