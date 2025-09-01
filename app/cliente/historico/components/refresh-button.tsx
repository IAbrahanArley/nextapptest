import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface RefreshButtonProps {
  isLoading: boolean;
  onRefresh: () => void;
}

export function RefreshButton({ isLoading, onRefresh }: RefreshButtonProps) {
  return (
    <div className="flex justify-end mb-6">
      <Button
        variant="outline"
        onClick={onRefresh}
        disabled={isLoading}
        className="w-full sm:w-auto border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-100"
      >
        <RefreshCw
          className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
        />
        Atualizar
      </Button>
    </div>
  );
}





