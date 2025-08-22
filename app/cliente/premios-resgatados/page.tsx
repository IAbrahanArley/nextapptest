import { Suspense } from "react";
import { PremiosResgatadosClient } from "./premios-resgatados-client";

export default function PremiosResgatadosPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Prêmios Resgatados</h1>
        <p className="text-gray-600 mt-2">
          Visualize e baixe os QR codes dos seus prêmios resgatados
        </p>
      </div>

      <Suspense fallback={<div>Carregando...</div>}>
        <PremiosResgatadosClient />
      </Suspense>
    </div>
  );
}
