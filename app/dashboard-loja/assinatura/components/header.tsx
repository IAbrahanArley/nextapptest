import { Crown } from "lucide-react";

export function Header() {
  return (
    <div className="mb-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        Minha Assinatura
      </h1>
      <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
        Gerencie seu plano e acompanhe o uso dos recursos
      </p>
    </div>
  );
}
