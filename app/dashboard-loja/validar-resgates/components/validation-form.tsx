import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle } from "lucide-react";

interface ValidationFormProps {
  validatedBy: string;
  onValidatedByChange: (value: string) => void;
  validationLocation: string;
  onValidationLocationChange: (value: string) => void;
  validationNotes: string;
  onValidationNotesChange: (value: string) => void;
  onValidation: () => void;
  onCancel: () => void;
  isPending: boolean;
}

export function ValidationForm({
  validatedBy,
  onValidatedByChange,
  validationLocation,
  onValidationLocationChange,
  validationNotes,
  onValidationNotesChange,
  onValidation,
  onCancel,
  isPending,
}: ValidationFormProps) {
  return (
    <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-600">
      <div className="space-y-2">
        <Label htmlFor="validated-by">Nome do Validador *</Label>
        <Input
          id="validated-by"
          value={validatedBy}
          onChange={(e) => onValidatedByChange(e.target.value)}
          placeholder="Seu nome"
          className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder:text-gray-400"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="validation-location">Local da Validação</Label>
        <Input
          id="validation-location"
          value={validationLocation}
          onChange={(e) => onValidationLocationChange(e.target.value)}
          placeholder="Ex: Caixa 1, Balcão"
          className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder:text-gray-400"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="validation-notes">Observações</Label>
        <Input
          id="validation-notes"
          value={validationNotes}
          onChange={(e) => onValidationNotesChange(e.target.value)}
          placeholder="Observações adicionais"
          className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder:text-gray-400"
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button
          onClick={onValidation}
          disabled={!validatedBy.trim() || isPending}
          className="flex-1 dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white hover:bg-blue-700"
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Confirmar Validação
        </Button>
        <Button
          onClick={onCancel}
          variant="outline"
          className="flex-1 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100 hover:bg-gray-50"
        >
          <XCircle className="h-4 w-4 mr-2" />
          Cancelar
        </Button>
      </div>
    </div>
  );
}
