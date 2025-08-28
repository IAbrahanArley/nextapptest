import { Card, CardContent } from "@/components/ui/card";
import { Store as StoreIcon } from "lucide-react";

interface EmptyStateProps {
  searchTerm: string;
  selectedCategory: string;
}

export function EmptyState({ searchTerm, selectedCategory }: EmptyStateProps) {
  return (
    <Card className="shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <CardContent className="pt-6">
        <div className="text-center py-8 sm:py-12 px-4">
          <StoreIcon className="h-16 w-16 sm:h-20 sm:w-20 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold text-gray-500 dark:text-gray-400 mb-2">
            Nenhum estabelecimento encontrado
          </h3>
          <p className="text-sm sm:text-base text-gray-400 dark:text-gray-500">
            {searchTerm || selectedCategory !== "all"
              ? "Tente ajustar os filtros de pesquisa"
              : "Não há estabelecimentos cadastrados no momento."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
