import { Suspense } from "react";
import { ValidarResgatesClient } from "./validar-resgates-client";

export default function ValidarResgatesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<div>Carregando...</div>}>
        <ValidarResgatesClient />
      </Suspense>
    </div>
  );
}
