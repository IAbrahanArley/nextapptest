import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

interface LimitWarningProps {
  planName: string;
  maxRewards: number;
}

export function LimitWarning({ planName, maxRewards }: LimitWarningProps) {
  return (
    <Card className="border-orange-200 dark:border-orange-700 bg-orange-50 dark:bg-orange-900/20 mb-6 shadow-sm">
      <CardContent className="pt-6">
        <div className="flex items-center space-x-3">
          <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
              Limite de prêmios atingido
            </p>
            <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
              Seu plano atual ({planName}) permite apenas {maxRewards} prêmios.{" "}
              <Link
                href="/dashboard-loja/planos"
                className="underline font-medium hover:text-orange-900 dark:hover:text-orange-100 transition-colors"
              >
                Faça upgrade do seu plano
              </Link>{" "}
              para criar mais prêmios.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
