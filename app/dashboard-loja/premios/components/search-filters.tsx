import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchFiltersProps {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
}

export function SearchFilters({
  searchTerm,
  onSearchTermChange,
}: SearchFiltersProps) {
  return (
    <Card className="shadow-sm dark:bg-gray-800 dark:border-gray-700 mb-6">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Filtros
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              placeholder="Buscar prêmios..."
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
              className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder:text-gray-400"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
