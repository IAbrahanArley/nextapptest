import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchFiltersProps {
  searchTerm: string;
  startDate: string;
  endDate: string;
  onSearchTermChange: (value: string) => void;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onSearch: () => void;
}

export function SearchFilters({
  searchTerm,
  startDate,
  endDate,
  onSearchTermChange,
  onStartDateChange,
  onEndDateChange,
  onSearch,
}: SearchFiltersProps) {
  return (
    <Card className="shadow-sm dark:bg-gray-800 dark:border-gray-700 mb-6">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-gray-100">
          Filtros
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          Filtre as transações por período e termo de busca
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Termo de Busca
            </label>
            <Input
              placeholder="Nome, email ou CPF..."
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
              className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder:text-gray-400"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Data Inicial
            </label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Data Final
            </label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            />
          </div>
          <div className="flex items-end">
            <Button
              onClick={onSearch}
              className="w-full dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white hover:bg-blue-700"
            >
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
