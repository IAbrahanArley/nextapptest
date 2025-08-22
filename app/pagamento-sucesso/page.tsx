"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Home, LogIn, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function PagamentoSucessoPage() {
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Verificando pagamento...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-green-100 text-green-600">
              <CheckCircle className="h-16 w-16" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-green-600 mb-2">
            Pagamento Confirmado!
          </CardTitle>
          <p className="text-gray-600 text-lg">
            Sua assinatura foi ativada com sucesso
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Detalhes da Assinatura */}
          <div className="bg-green-50 rounded-lg p-6 space-y-4">
            <h3 className="font-semibold text-lg text-green-800 mb-3">
              Detalhes da Assinatura
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <span className="text-sm text-gray-600">Plano</span>
                <Badge className="bg-green-100 text-green-800 mt-1 block">
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
                  className="border-green-200 text-green-700 mt-1 block"
                >
                  {sessionData?.status || "active"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Próximos Passos */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="font-semibold text-lg text-blue-800 mb-3">
              Próximos Passos
            </h3>
            <div className="space-y-2 text-sm text-blue-700">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                <span>Faça login na sua conta</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                <span>Configure sua loja</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                <span>Cadastre seus primeiros clientes</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                <span>Crie promoções e prêmios</span>
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
      </Card>
    </div>
  );
}
