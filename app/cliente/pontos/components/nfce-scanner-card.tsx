import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Receipt } from "lucide-react";

interface NFCeScannerCardProps {
  onOpenScanner: () => void;
}

export function NFCeScannerCard({ onOpenScanner }: NFCeScannerCardProps) {
  return (
    <Card className="shadow-sm mb-6 sm:mb-8 dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Receipt className="h-5 w-5" />
          Ganhar Pontos com Nota Fiscal
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          Escaneie o QR Code da sua nota fiscal para ganhar pontos
          automaticamente
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex-1">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              📱 <strong>Como funciona:</strong>
            </p>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-4">
              <li>• Compre em estabelecimentos parceiros</li>
              <li>• Escaneie o QR Code da nota fiscal</li>
              <li>• Ganhe pontos automaticamente</li>
              <li>• Use os pontos para resgatar prêmios</li>
            </ul>
          </div>
          <Button
            onClick={onOpenScanner}
            size="lg"
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
          >
            <Camera className="h-5 w-5 mr-2" />
            Escanear Nota Fiscal
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}





