"use client";

import { useSearchParams } from "next/navigation";
import { XCircle, RefreshCw, Home, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function FailedPageClient() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const sessionId = searchParams.get("session_id");

  return (
    <>
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-full bg-red-100 text-red-600">
            <XCircle className="h-12 w-12" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-red-600">
          Pagamento Não Concluído
        </CardTitle>
        <CardDescription>
          Houve um problema ao processar seu pagamento
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Detalhes do Erro */}
        {error && (
          <div className="bg-red-50 rounded-lg p-4">
            <h3 className="font-semibold text-red-800 mb-2">
              Detalhes do Erro:
            </h3>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Possíveis Causas */}
        <div className="space-y-3">
          <h3 className="font-semibold text-lg">Possíveis Causas:</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-red-500 rounded-full"></div>
              <span>Cartão recusado ou sem limite</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-red-500 rounded-full"></div>
              <span>Dados do cartão incorretos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-red-500 rounded-full"></div>
              <span>Problemas de conectividade</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-red-500 rounded-full"></div>
              <span>Bloqueio pelo banco emissor</span>
            </div>
          </div>
        </div>

        {/* Soluções */}
        <div className="space-y-3">
          <h3 className="font-semibold text-lg">Soluções:</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
              <span>Verifique o limite do seu cartão</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
              <span>Confirme os dados do cartão</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
              <span>Tente com outro cartão</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
              <span>Entre em contato com seu banco</span>
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="space-y-3">
          <Button asChild className="w-full" size="lg">
            <Link href="/cadastro?type=merchant">
              <RefreshCw className="mr-2 h-4 w-4" />
              Tentar Novamente
            </Link>
          </Button>

          <Button asChild variant="outline" className="w-full">
            <Link href="/dashboard-loja">
              <Home className="mr-2 h-4 w-4" />
              Voltar ao Dashboard
            </Link>
          </Button>

          <Button asChild variant="ghost" className="w-full">
            <Link href="/suporte">
              <HelpCircle className="mr-2 h-4 w-4" />
              Preciso de Ajuda
            </Link>
          </Button>
        </div>

        {/* Informações Adicionais */}
        <div className="text-xs text-muted-foreground text-center pt-4 border-t">
          {sessionId && <p>ID da Sessão: {sessionId}</p>}
          <p>Se o problema persistir, entre em contato com o suporte</p>
        </div>
      </CardContent>
    </>
  );
}
