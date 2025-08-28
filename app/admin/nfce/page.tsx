import { Suspense } from "react";
import { Metadata } from "next";
import { NFCeAdminClient } from "./components/nfce-admin-client";
import { NFCeAdminSkeleton } from "./components/nfce-admin-skeleton";

export const metadata: Metadata = {
  title: "Admin - Validação de NFC-e | Loyalty SaaS",
  description:
    "Painel administrativo para validação de notas fiscais eletrônicas",
};

export default function NFCeAdminPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Validação de NFC-e
          </h1>
          <p className="text-muted-foreground">
            Gerencie e valide notas fiscais eletrônicas pendentes
          </p>
        </div>
      </div>

      <Suspense fallback={<NFCeAdminSkeleton />}>
        <NFCeAdminClient />
      </Suspense>
    </div>
  );
}


