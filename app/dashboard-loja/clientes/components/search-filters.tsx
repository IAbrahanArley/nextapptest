import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchFiltersProps {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  onSearch: () => void;
}

export function SearchFilters({
  searchTerm,
  onSearchTermChange,
  onSearch,
}: SearchFiltersProps) {
  return (
    <Card className="shadow-sm dark:bg-gray-800 dark:border-gray-700 mb-6">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-gray-100">
          Filtros
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <Input
              placeholder="Buscar por nome, email ou CPF..."
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
              className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder:text-gray-400"
            />
          </div>
          <Button
            onClick={onSearch}
            className="w-full sm:w-auto dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white hover:bg-blue-700"
          >
            Filtrar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
