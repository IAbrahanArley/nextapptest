import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ClientCardProps {
  cliente: any;
  onMigratePoints: (cpf: string) => void;
  migratingPoints: string | null;
  isMigrating: boolean;
}

export function ClientCard({
  cliente,
  onMigratePoints,
  migratingPoints,
  isMigrating,
}: ClientCardProps) {
  const formatDate = (date: Date) => {
    return format(new Date(date), "dd/MM/yyyy", { locale: ptBR });
  };

  return (
    <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 hover:shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
              {cliente.name || `Cliente por CPF: ${cliente.cpf}`}
            </h3>
            <Badge
              variant={cliente.status === "active" ? "default" : "secondary"}
              className="dark:bg-gray-600 dark:text-gray-100"
            >
              {cliente.status === "active" ? "Ativo" : "Inativo"}
            </Badge>
            {!cliente.isRegistered && (
              <Badge
                variant="outline"
                className="text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-600"
              >
                Por CPF
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm text-gray-600 dark:text-gray-300 mb-3">
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-200">
                Email:{" "}
              </span>
              <span>{cliente.email || "Não informado"}</span>
            </div>

            <div>
              <span className="font-medium text-gray-700 dark:text-gray-200">
                Telefone:{" "}
              </span>
              <span>{cliente.phone || "Não informado"}</span>
            </div>

            <div>
              <span className="font-medium text-gray-700 dark:text-gray-200">
                CPF:{" "}
              </span>
              <span>{cliente.cpf || "Não informado"}</span>
            </div>

            <div>
              <span className="font-medium text-gray-700 dark:text-gray-200">
                Pontos:{" "}
              </span>
              <span className="text-purple-600 dark:text-purple-400 font-bold">
                {cliente.points}
              </span>
            </div>
          </div>

          <div className="text-xs text-gray-500 dark:text-gray-400">
            {cliente.isRegistered ? (
              <>
                <span className="font-medium text-gray-600 dark:text-gray-300">
                  Cadastrado em:{" "}
                </span>
                {formatDate(cliente.createdAt)}
                {cliente.lastTransaction && (
                  <>
                    <span className="mx-2 text-gray-400 dark:text-gray-500">
                      •
                    </span>
                    <span className="font-medium text-gray-600 dark:text-gray-300">
                      Última transação:{" "}
                    </span>
                    {formatDate(cliente.lastTransaction)}
                  </>
                )}
              </>
            ) : (
              <>
                <span className="font-medium text-gray-600 dark:text-gray-300">
                  Pontos atribuídos por CPF em:{" "}
                </span>
                {formatDate(cliente.createdAt)}
                {cliente.lastTransaction && (
                  <>
                    <span className="mx-2 text-gray-400 dark:text-gray-500">
                      •
                    </span>
                    <span className="font-medium text-gray-600 dark:text-gray-300">
                      Última transação:{" "}
                    </span>
                    {formatDate(cliente.lastTransaction)}
                  </>
                )}
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            size="sm"
            className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100 hover:bg-gray-50"
          >
            <Eye className="h-4 w-4" />
          </Button>
          {!cliente.isRegistered && cliente.cpf && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onMigratePoints(cliente.cpf!)}
              disabled={migratingPoints === cliente.cpf || isMigrating}
              className="text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-700 dark:hover:text-orange-300"
            >
              {migratingPoints === cliente.cpf || isMigrating ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-1" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-1" />
              )}
              Migrar Pontos
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
