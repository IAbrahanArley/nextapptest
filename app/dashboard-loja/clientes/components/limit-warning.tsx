import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

interface LimitWarningProps {
  effectiveClientLimit: number;
  effectivePlan: any;
}

export function LimitWarning({
  effectiveClientLimit,
  effectivePlan,
}: LimitWarningProps) {
  return (
    <Card className="border-orange-200 dark:border-orange-700 bg-orange-50 dark:bg-orange-900/20 mb-6">
      <CardContent className="pt-6">
        <div className="flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          <div>
            <h3 className="font-medium text-orange-800 dark:text-orange-200">
              Limite de clientes atingido
            </h3>
            <p className="text-sm text-orange-700 dark:text-orange-300">
              Você atingiu o limite de {effectiveClientLimit} clientes do seu
              plano atual.
              {effectivePlan && (
                <Link
                  href="/dashboard-loja/assinatura"
                  className="underline ml-1 text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors"
                >
                  Faça upgrade para o plano {effectivePlan.name}
                </Link>
              )}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
