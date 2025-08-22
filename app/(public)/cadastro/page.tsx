"use client";

import { Suspense } from "react";
import { CadastroClient } from "./cadastro-client";

export default function CadastroPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-muted rounded-md"></div>
          <div className="h-10 bg-muted rounded-md"></div>
          <div className="h-10 bg-muted rounded-md"></div>
          <div className="h-10 bg-muted rounded-md"></div>
        </div>
      </div>
    }>
      <CadastroClient />
    </Suspense>
  );
}
