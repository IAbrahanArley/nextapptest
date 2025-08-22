import { Suspense } from "react";
import { ValidarResgatesClient } from "./validar-resgates-client";

export default function ValidarResgatesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Validar Resgates</h1>
        <p className="text-gray-600 mt-2">
          Leia QR codes para validar resgates de prêmios dos clientes
        </p>
      </div>

      <Suspense fallback={<div>Carregando...</div>}>
        <ValidarResgatesClient />
      </Suspense>
    </div>
  );
}
