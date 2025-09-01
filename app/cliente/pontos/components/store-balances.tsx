import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Store, MapPin, Calendar, Gift } from "lucide-react";
import Link from "next/link";
import { StoreBalance } from "../types";

interface StoreBalancesProps {
  storeBalances: StoreBalance[];
  isLoading: boolean;
  onRefresh: () => void;
  onDebug: () => void;
}

export function StoreBalances({
  storeBalances,
  isLoading,
  onRefresh,
  onDebug,
}: StoreBalancesProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <Card className="shadow-sm mb-6 sm:mb-8 dark:bg-gray-800 dark:border-gray-700">
      <CardHeader className="rounded-t-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg sm:text-xl text-gray-900 dark:text-gray-100">
              Meus Pontos por Estabelecimento
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Acompanhe seus pontos em cada loja cadastrada
            </CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              <Store className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onDebug}
              className="w-full sm:w-auto"
            >
              Debug
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        {storeBalances.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <Store className="h-16 w-16 sm:h-20 sm:w-20 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-500 dark:text-gray-400 mb-2">
              Nenhum ponto acumulado
            </h3>
            <p className="text-gray-400 dark:text-gray-500 text-sm sm:text-base">
              Você ainda não acumulou pontos em nenhuma loja parceira.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {storeBalances.map((estabelecimento) => (
              <div
                key={estabelecimento.id}
                className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center border border-border flex-shrink-0">
                      {estabelecimento.store_logo ? (
                        <img
                          src={estabelecimento.store_logo}
                          alt={estabelecimento.store_name}
                          className="h-8 w-8 rounded object-cover"
                        />
                      ) : (
                        <Store className="h-6 w-6 text-primary" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-gray-100 truncate">
                        {estabelecimento.store_name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Badge variant="secondary" className="text-xs">
                          Loja parceira
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-center sm:text-right">
                    <div className="text-xl sm:text-2xl font-bold text-primary">
                      {estabelecimento.points.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      pontos
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {estabelecimento.store_address && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 flex-shrink-0" />
                      <span className="break-words">
                        {estabelecimento.store_address}
                      </span>
                    </div>
                  )}
                  {estabelecimento.last_transaction_date && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 flex-shrink-0" />
                      <span>
                        <span className="font-medium">Última transação: </span>
                        {formatDate(estabelecimento.last_transaction_date)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Link
                    href={`/cliente/estabelecimentos/${estabelecimento.id}`}
                    className="w-full sm:w-auto"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full sm:w-auto bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      Ver Detalhes
                    </Button>
                  </Link>
                  <Link href="/cliente/premios" className="w-full sm:w-auto">
                    <Button size="sm" className="w-full sm:w-auto">
                      <Gift className="h-4 w-4 mr-2" />
                      Resgatar
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}





