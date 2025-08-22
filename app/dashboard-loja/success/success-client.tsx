"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export function SuccessClient() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [isLoading, setIsLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState<string>("");

  useEffect(() => {
    console.log("=== DEBUG SUCCESS PAGE ===");
    console.log("1. Componente montado");
    console.log("2. sessionId:", sessionId);
    console.log("3. searchParams:", searchParams);

    setDebugInfo(`SessionId: ${sessionId || "NÃO ENCONTRADO"}`);

    // Simular carregamento
    const timer = setTimeout(() => {
      console.log("4. Timer executado, isLoading = false");
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [sessionId, searchParams]);

  console.log("5. Renderizando, isLoading:", isLoading);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Verificando pagamento...</p>
            <p className="text-sm text-gray-500 mt-2">{debugInfo}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <CheckCircle className="h-12 w-12" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-green-600">
            Pagamento Confirmado!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-center text-green-800">
              Sua assinatura foi ativada com sucesso!
            </p>
            <p className="text-center text-sm text-green-600 mt-2">
              Session ID: {sessionId}
            </p>
          </div>

          <Button asChild className="w-full" size="lg">
            <Link href="/dashboard-loja">
              <Home className="mr-2 h-4 w-4" />
              Ir para Dashboard
            </Link>
          </Button>

          <div className="text-xs text-gray-500 text-center">
            <p>Debug: {debugInfo}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
