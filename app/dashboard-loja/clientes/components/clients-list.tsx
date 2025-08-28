import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import Link from "next/link";
import { ClientCard } from "./client-card";

interface ClientsListProps {
  clients: any[];
  total: number;
  isLoading: boolean;
  onMigratePoints: (cpf: string) => void;
  migratingPoints: string | null;
  isMigrating: boolean;
}

export function ClientsList({
  clients,
  total,
  isLoading,
  onMigratePoints,
  migratingPoints,
  isMigrating,
}: ClientsListProps) {
  if (isLoading) {
    return (
      <Card className="shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-gray-100">
            Lista de Clientes
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Carregando...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 animate-pulse"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="h-4 w-32 bg-gray-200 dark:bg-gray-600 rounded mb-2" />
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="h-3 w-20 bg-gray-200 dark:bg-gray-600 rounded" />
                      <div className="h-3 w-16 bg-gray-200 dark:bg-gray-600 rounded" />
                      <div className="h-3 w-24 bg-gray-200 dark:bg-gray-600 rounded" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-gray-100">
          Lista de Clientes
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          {total} cliente(s) encontrado(s)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {clients && clients.length > 0 ? (
          <div className="space-y-4">
            {clients.map((cliente) => (
              <ClientCard
                key={cliente.id || cliente.cpf || `client-${Math.random()}`}
                cliente={cliente}
                onMigratePoints={onMigratePoints}
                migratingPoints={migratingPoints}
                isMigrating={isMigrating}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              Nenhum cliente encontrado
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {total === 0
                ? "Você ainda não tem clientes cadastrados ou que receberam pontos."
                : "Nenhum cliente corresponde aos filtros aplicados."}
            </p>
            <Link href="/dashboard-loja/clientes/novo">
              <Button className="dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Primeiro Cliente
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
