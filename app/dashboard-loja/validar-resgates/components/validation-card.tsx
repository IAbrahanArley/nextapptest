import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode } from "lucide-react";
import { ValidationMethodSelector } from "./validation-method-selector";
import { QRCodeInput } from "./qr-code-input";
import { VerificationCodeInput } from "./verification-code-input";

interface ValidationCardProps {
  useVerificationCode: boolean;
  onMethodChange: (useVerificationCode: boolean) => void;
  qrCodeInput: string;
  onQRCodeChange: (value: string) => void;
  onQRCodePaste: () => void;
  onQRCodeScannerOpen: () => void;
  onQRCodeSubmit: () => void;
  verificationCodeInput: string;
  onVerificationCodeChange: (value: string) => void;
  onVerificationCodePaste: () => void;
  onVerificationCodeSubmit: () => void;
  isPending: boolean;
}

export function ValidationCard({
  useVerificationCode,
  onMethodChange,
  qrCodeInput,
  onQRCodeChange,
  onQRCodePaste,
  onQRCodeScannerOpen,
  onQRCodeSubmit,
  verificationCodeInput,
  onVerificationCodeChange,
  onVerificationCodePaste,
  onVerificationCodeSubmit,
  isPending,
}: ValidationCardProps) {
  return (
    <Card className="shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
          <QrCode className="h-5 w-5" />
          Leitor de QR Code e Códigos Verificadores
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ValidationMethodSelector
          useVerificationCode={useVerificationCode}
          onMethodChange={onMethodChange}
        />

        {!useVerificationCode ? (
          <QRCodeInput
            qrCodeInput={qrCodeInput}
            onQRCodeChange={onQRCodeChange}
            onPaste={onQRCodePaste}
            onScannerOpen={onQRCodeScannerOpen}
            onSubmit={onQRCodeSubmit}
            isPending={isPending}
          />
        ) : (
          <VerificationCodeInput
            verificationCodeInput={verificationCodeInput}
            onVerificationCodeChange={onVerificationCodeChange}
            onPaste={onVerificationCodePaste}
            onSubmit={onVerificationCodeSubmit}
            isPending={isPending}
          />
        )}
      </CardContent>
    </Card>
  );
}
