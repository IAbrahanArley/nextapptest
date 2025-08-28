import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export function NoSubscriptionCard() {
  const handleSyncSubscription = async () => {
    try {
      const response = await fetch("/api/debug/sync-subscription", {
        method: "POST",
      });
      const result = await response.json();
      if (result.success) {
        window.location.reload();
      } else {
        alert("Erro ao sincronizar: " + result.error);
      }
    } catch (error) {
      alert("Erro ao sincronizar assinatura");
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          Nenhuma assinatura encontrada
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Parece que você ainda não tem uma assinatura ativa.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white hover:bg-blue-700">
            Ver Planos Disponíveis
          </Button>
          <Button
            variant="outline"
            onClick={() => window.open("/api/debug/subscription", "_blank")}
            className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100 hover:bg-gray-50"
          >
            Debug Banco
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              window.open("/api/debug/stripe-subscriptions", "_blank")
            }
            className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100 hover:bg-gray-50"
          >
            Debug Stripe
          </Button>
          <Button
            variant="default"
            onClick={handleSyncSubscription}
            className="dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white hover:bg-blue-700"
          >
            🔄 Sincronizar Assinatura
          </Button>
        </div>
      </div>

      {/* Informações de Debug */}
      <Card className="shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-gray-100">
            Informações de Debug
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Use os botões acima para investigar o problema com sua assinatura
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-medium mb-2 text-gray-900 dark:text-gray-100">
                Debug Banco
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Verifica se há assinaturas salvas no banco de dados local.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2 text-gray-900 dark:text-gray-100">
                Debug Stripe
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Verifica se há assinaturas ativas no Stripe.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2 text-gray-900 dark:text-gray-100">
                🔄 Sincronizar
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Sincroniza manualmente a assinatura do Stripe com o banco de
                dados.
              </p>
            </div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
              <p className="text-sm text-blue-900 dark:text-blue-100 font-medium">
                Plano ativo
              </p>
            </div>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">
              Seu plano está funcionando perfeitamente
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
