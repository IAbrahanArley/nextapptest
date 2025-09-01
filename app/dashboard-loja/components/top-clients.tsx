"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface TopClientsProps {
  topClients: any[];
}

export function TopClients({ topClients }: TopClientsProps) {
  if (topClients.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Clientes</CardTitle>
          <CardDescription>Clientes com mais pontos acumulados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            Nenhum cliente encontrado
          </div>
        </CardContent>
      </Card>
    );
  }

  const getRankColor = (index: number) => {
    const colors = [
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
      "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    ];
    return colors[index] || colors[4];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Clientes</CardTitle>
        <CardDescription>Clientes com mais pontos acumulados</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {topClients.slice(0, 5).map((client: any, index: number) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${getRankColor(
                    index
                  )}`}
                >
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    {client.nome || "Cliente"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {(client.pontos || 0).toLocaleString()} pontos
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">
                  Última compra: {client.ultimaCompra || "N/A"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}


