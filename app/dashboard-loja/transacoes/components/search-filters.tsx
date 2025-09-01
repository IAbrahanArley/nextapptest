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
    <Card className="shadow-sm mb-6">
      <CardHeader>
        <CardTitle>Filtros</CardTitle>
        <CardDescription>
          Filtre as transações por período e termo de busca
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium">Termo de Busca</label>
            <Input
              placeholder="Nome, email ou CPF..."
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Data Inicial</label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Data Final</label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              className="mt-1"
            />
          </div>
          <div className="flex items-end">
            <Button onClick={onSearch} className="w-full">
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
