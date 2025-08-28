import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface VerificationCodeInputProps {
  verificationCodeInput: string;
  onVerificationCodeChange: (value: string) => void;
  onPaste: () => void;
  onSubmit: () => void;
  isPending: boolean;
}

export function VerificationCodeInput({
  verificationCodeInput,
  onVerificationCodeChange,
  onPaste,
  onSubmit,
  isPending,
}: VerificationCodeInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="verification-code">Código Verificador</Label>
      <div className="flex gap-2">
        <Input
          id="verification-code"
          value={verificationCodeInput}
          onChange={(e) => onVerificationCodeChange(e.target.value)}
          placeholder="Ex: LOJA-A1B2C3D4"
          className="flex-1 font-mono text-center dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder:text-gray-400"
          maxLength={13}
        />
        <Button
          onClick={onPaste}
          variant="outline"
          size="sm"
          className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100 hover:bg-gray-50"
        >
          Colar
        </Button>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Formato: XXXX-XXXXXXXX (4 letras + hífen + 8 caracteres)
      </p>
      <Button
        onClick={onSubmit}
        disabled={!verificationCodeInput.trim() || isPending}
        className="w-full dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white hover:bg-blue-700"
      >
        {isPending ? "Validando..." : "Validar Código"}
      </Button>
    </div>
  );
}
