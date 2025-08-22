"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QRScanner } from "./qr-scanner";
import { QrCode, Camera } from "lucide-react";

export function QRScannerDemo() {
  const [showScanner, setShowScanner] = useState(false);
  const [lastScannedData, setLastScannedData] = useState<string | null>(null);

  const handleScan = (data: string) => {
    setLastScannedData(data);
    console.log("QR Code escaneado:", data);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Demonstração do Scanner de QR Code
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            Este é um componente de demonstração para testar o scanner de QR
            code. Clique no botão abaixo para abrir o scanner.
          </p>

          <div className="flex gap-2">
            <Button onClick={() => setShowScanner(true)}>
              <Camera className="h-4 w-4 mr-2" />
              Abrir Scanner
            </Button>

            {lastScannedData && (
              <Button
                variant="outline"
                onClick={() => setLastScannedData(null)}
              >
                Limpar Dados
              </Button>
            )}
          </div>

          {lastScannedData && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-800 mb-2">
                Último QR Code Escaneado:
              </h4>
              <pre className="text-xs bg-white p-3 rounded border overflow-x-auto">
                {JSON.stringify(JSON.parse(lastScannedData), null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>

      {showScanner && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-2xl">
            <QRScanner
              onScan={handleScan}
              onClose={() => setShowScanner(false)}
              storeId="demo-store-id"
            />
          </div>
        </div>
      )}
    </div>
  );
}
