import { Button } from "@/components/ui/button";
import { QrCode, Hash } from "lucide-react";

interface ValidationMethodSelectorProps {
  useVerificationCode: boolean;
  onMethodChange: (useVerificationCode: boolean) => void;
}

export function ValidationMethodSelector({
  useVerificationCode,
  onMethodChange,
}: ValidationMethodSelectorProps) {
  return (
    <div className="flex gap-2 mb-4">
      <Button
        variant={!useVerificationCode ? "default" : "outline"}
        onClick={() => onMethodChange(false)}
        size="sm"
        className="dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white hover:bg-blue-700"
      >
        <QrCode className="h-4 w-4 mr-2" />
        QR Code
      </Button>
      <Button
        variant={useVerificationCode ? "default" : "outline"}
        onClick={() => onMethodChange(true)}
        size="sm"
        className="dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white hover:bg-blue-700"
      >
        <Hash className="h-4 w-4 mr-2" />
        Código Verificador
      </Button>
    </div>
  );
}
