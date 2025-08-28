import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, RefreshCw, Search } from "lucide-react";

interface SearchFiltersProps {
  searchTerm: string;
  selectedCategory: string;
  itemsPerPage: number;
  categories: string[];
  filteredStoresCount: number;
  isLoading: boolean;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onItemsPerPageChange: (value: number) => void;
  onResetFilters: () => void;
  onRefresh: () => void;
}

export function SearchFilters({
  searchTerm,
  selectedCategory,
  itemsPerPage,
  categories,
  filteredStoresCount,
  isLoading,
  onSearchChange,
  onCategoryChange,
  onItemsPerPageChange,
  onResetFilters,
  onRefresh,
}: SearchFiltersProps) {
  return (
    <Card className="shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg text-gray-900 dark:text-gray-100">
          Pesquisar e Filtrar
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          Encontre estabelecimentos específicos ou filtre por categoria
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Campo de pesquisa */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <Input
              placeholder="Pesquisar estabelecimentos..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder:text-gray-400"
            />
          </div>

          {/* Filtro por categoria */}
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
            <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100">
              <SelectValue placeholder="Todas as categorias" />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
              <SelectItem value="all">Todas as categorias</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Itens por página */}
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => onItemsPerPageChange(Number(value))}
          >
            <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
              <SelectItem value="6">6 por página</SelectItem>
              <SelectItem value="12">12 por página</SelectItem>
              <SelectItem value="24">24 por página</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={onResetFilters}
              className="w-full sm:w-auto border-gray-300 text-gray-400 hover:bg-gray-50 hover:text-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100"
            >
              <Filter className="h-4 w-4 mr-2" />
              Limpar Filtros
            </Button>
            <span className="text-sm text-gray-600 dark:text-gray-400 text-center sm:text-left">
              {filteredStoresCount} estabelecimento(s) encontrado(s)
            </span>
          </div>

          <Button
            variant="outline"
            onClick={onRefresh}
            disabled={isLoading}
            className="w-full sm:w-auto border-gray-300 text-gray-400 hover:bg-gray-50 hover:text-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Atualizar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
