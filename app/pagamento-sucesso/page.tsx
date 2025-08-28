import { Suspense } from "react";
import { PagamentoSucessoClient } from "./pagamento-sucesso-client";

export default function PagamentoSucessoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="w-full max-w-md p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando...</p>
          </div>
        </div>
      }
    >
      <PagamentoSucessoClient />
    </Suspense>
  );
}
