"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export function Header() {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Visão geral do seu programa de fidelidade
        </p>
      </div>
      <div className="w-full sm:w-auto">
        <Link href="/dashboard-loja/transacoes/nova">
          <Button className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Nova Transação
          </Button>
        </Link>
      </div>
    </div>
  );
}


