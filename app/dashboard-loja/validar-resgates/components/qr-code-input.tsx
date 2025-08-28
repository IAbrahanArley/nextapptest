import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera } from "lucide-react";

interface QRCodeInputProps {
  qrCodeInput: string;
  onQRCodeChange: (value: string) => void;
  onPaste: () => void;
  onScannerOpen: () => void;
  onSubmit: () => void;
  isPending: boolean;
}

export function QRCodeInput({
  qrCodeInput,
  onQRCodeChange,
  onPaste,
  onScannerOpen,
  onSubmit,
  isPending,
}: QRCodeInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="qr-code">QR Code</Label>
      <div className="flex gap-2">
        <Input
          id="qr-code"
          value={qrCodeInput}
          onChange={(e) => onQRCodeChange(e.target.value)}
          placeholder="Cole o QR code aqui ou escaneie"
          className="flex-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder:text-gray-400"
        />
        <Button
          onClick={onPaste}
          variant="outline"
          size="sm"
          className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100 hover:bg-gray-50"
        >
          Colar
        </Button>
        <Button
          onClick={onScannerOpen}
          variant="outline"
          size="sm"
          className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100 hover:bg-gray-50"
        >
          <Camera className="h-4 w-4" />
          Scanner
        </Button>
      </div>
      <Button
        onClick={onSubmit}
        disabled={!qrCodeInput.trim() || isPending}
        className="w-full dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white hover:bg-blue-700"
      >
        {isPending ? "Validando..." : "Validar QR Code"}
      </Button>
    </div>
  );
}
