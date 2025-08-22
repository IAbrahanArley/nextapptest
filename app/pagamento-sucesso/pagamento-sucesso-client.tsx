"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Home, LogIn, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function PagamentoSucessoClient() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [isLoading, setIsLoading] = useState(true);
  const [sessionData, setSessionData] = useState<any>(null);

  useEffect(() => {
    console.log("=== DEBUG PAGAMENTO SUCESSO ===");
    console.log("1. Componente montado");
    console.log("2. sessionId:", sessionId);

    if (sessionId) {
      // Buscar dados da sessão do Stripe
      const fetchSessionData = async () => {
        try {
          console.log("3. Fazendo fetch para API...");
          const response = await fetch(
            `/api/stripe/session?session_id=${sessionId}`
          );
          console.log("4. Response status:", response.status);

          if (response.ok) {
            const data = await response.json();
            console.log("5. Dados recebidos:", data);
            setSessionData(data);
          } else {
            console.log("6. API falhou, usando fallback");
            setSessionData({
              plan: "Básico",
              amount: "R$ 29,90",
              status: "active",
            });
          }
        } catch (error) {
          console.error("7. Erro ao buscar dados:", error);
          setSessionData({
            plan: "Básico",
            amount: "R$ 29,90",
            status: "active",
          });
        } finally {
          console.log("8. Finalizando fetch, isLoading = false");
          setIsLoading(false);
        }
      };

      fetchSessionData();
    } else {
      console.log("9. Sem sessionId, isLoading = false");
      setIsLoading(false);
    }
  }, [sessionId]);

  if (isLoading) {
    return (
      <CardContent className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Verificando pagamento...</p>
      </CardContent>
    );
  }

  return (
    <>
      <CardHeader className="text-center">
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-full bg-primary/10 text-primary">
            <CheckCircle className="h-12 w-12" />
          </div>
        </div>
        <CardTitle className="text-3xl font-bold text-primary mb-2">
          Pagamento Confirmado!
        </CardTitle>
        <p className="text-gray-600 text-lg">
          Sua assinatura foi ativada com sucesso
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Detalhes da Assinatura */}
        <div className="bg-primary/5 rounded-lg p-6 space-y-4">
          <h3 className="font-semibold text-lg text-foreground mb-3">
            Detalhes da Assinatura
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <span className="text-sm text-gray-600">Plano</span>
              <Badge className="bg-primary/10 text-primary mt-1 block">
                {sessionData?.plan || "Básico"}
              </Badge>
            </div>
            <div className="text-center">
              <span className="text-sm text-gray-600">Valor</span>
              <p className="font-semibold text-green-800 mt-1">
                {sessionData?.amount || "R$ 29,90"}/mês
              </p>
            </div>
            <div className="text-center">
              <span className="text-sm text-gray-600">Status</span>
              <Badge
                variant="outline"
                className="border-primary/20 text-primary mt-1 block"
              >
                {sessionData?.status || "active"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Próximos Passos */}
        <div className="bg-muted rounded-lg p-6">
          <h3 className="font-semibold text-lg text-foreground mb-3">
            Próximos Passos
          </h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-primary rounded-full"></div>
              <span>Configure sua loja no dashboard</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-primary rounded-full"></div>
              <span>Cadastre seus primeiros clientes</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-primary rounded-full"></div>
              <span>Crie prêmios para seus clientes</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-primary rounded-full"></div>
              <span>Comece a distribuir pontos</span>
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="space-y-3">
          <Button asChild className="w-full" size="lg">
            <Link href="/login?type=merchant">
              <LogIn className="mr-2 h-4 w-4" />
              Fazer Login
            </Link>
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button asChild variant="outline">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Página Inicial
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/suporte">
                <Settings className="mr-2 h-4 w-4" />
                Suporte
              </Link>
            </Button>
          </div>
        </div>

        {/* Informações Adicionais */}
        <div className="text-xs text-gray-500 text-center pt-4 border-t">
          <p>ID da Sessão: {sessionId}</p>
          <p>Em caso de dúvidas, entre em contato com o suporte</p>
        </div>
      </CardContent>
    </>
  );
}
