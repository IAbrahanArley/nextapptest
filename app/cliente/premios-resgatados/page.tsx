import { Suspense } from "react";
import { PremiosResgatadosClient } from "./premios-resgatados-client";

export default function PremiosResgatadosPage() {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
            Prêmios Resgatados
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm sm:text-base">
            Visualize e baixe os QR codes dos seus prêmios resgatados
          </p>
        </div>

        <Suspense fallback={<div>Carregando...</div>}>
          <PremiosResgatadosClient />
        </Suspense>
      </div>
    </div>
  );
}
