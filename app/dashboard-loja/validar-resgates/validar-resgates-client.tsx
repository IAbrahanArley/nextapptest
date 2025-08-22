"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useValidateRedemption } from "@/hooks/mutations/use-validate-redemption";
import { useStoreId } from "@/hooks/queries/use-store-id";
import { toast } from "sonner";
import {
  QrCode,
  Camera,
  CheckCircle,
  XCircle,
  User,
  Calendar,
  MapPin,
  Gift,
  Hash,
} from "lucide-react";
import { validateVerificationCode } from "@/lib/utils/verification-code";
import { QRScanner } from "@/components/qr-scanner";

interface QRCodeData {
  redemption_id: string;
  reward_id: string;
  store_id: string;
  user_id: string;
  cost_points: number;
  timestamp: number;
}

interface RedemptionDetails {
  redemption: {
    id: string;
    cost_points: number;
    status: string;
    validation_status: string;
    redeemed_at: string;
    metadata: any;
    user: {
      name: string;
      email: string;
    };
    reward: {
      title: string;
      description: string;
      type: string;
    };
    store: {
      name: string;
      address: string;
    };
  };
  qrCode: {
    id: string;
    expires_at: string;
    is_used: boolean;
    validated_by_store: boolean;
  };
}

export function ValidarResgatesClient() {
  const { data: storeId } = useStoreId();
  const { mutate: validateRedemption, isPending } = useValidateRedemption();
  const [qrCodeInput, setQrCodeInput] = useState("");
  const [verificationCodeInput, setVerificationCodeInput] = useState("");
  const [scannedData, setScannedData] = useState<QRCodeData | null>(null);
  const [redemptionDetails, setRedemptionDetails] =
    useState<RedemptionDetails | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [validationNotes, setValidationNotes] = useState("");
  const [validationLocation, setValidationLocation] = useState("");
  const [validatedBy, setValidatedBy] = useState("");
  const [useVerificationCode, setUseVerificationCode] = useState(false);

  // Extract the actual store ID string
  const actualStoreId = storeId?.data?.storeId || storeId?.data;

  const handleQRCodeSubmit = async () => {
    if (!qrCodeInput.trim()) {
      toast.error("Digite ou escaneie um QR code");
      return;
    }

    try {
      const qrData = JSON.parse(qrCodeInput) as QRCodeData;

      if (qrData.store_id !== actualStoreId) {
        toast.error("QR code não pertence a esta loja");
        return;
      }

      setScannedData(qrData);
      await fetchRedemptionDetails(qrData.redemption_id);
      setShowDetails(true);
    } catch (error) {
      toast.error("QR code inválido");
    }
  };

  const handleVerificationCodeSubmit = async () => {
    if (!verificationCodeInput.trim()) {
      toast.error("Digite o código verificador");
      return;
    }

    if (!validateVerificationCode(verificationCodeInput)) {
      toast.error("Formato do código verificador inválido");
      return;
    }

    // Buscar detalhes do resgate pelo código verificador
    try {
      const response = await fetch("/api/stores/redemption-by-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          verification_code: verificationCodeInput,
          store_id: actualStoreId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setRedemptionDetails(data);
        setShowDetails(true);
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Código não encontrado");
      }
    } catch (error) {
      console.error("Erro ao buscar detalhes do resgate:", error);
      toast.error("Erro ao buscar detalhes do resgate");
    }
  };

  const fetchRedemptionDetails = async (redemptionId: string) => {
    try {
      const response = await fetch(
        `/api/stores/redemption-details/${redemptionId}`
      );
      if (response.ok) {
        const data = await response.json();
        setRedemptionDetails(data);
      }
    } catch (error) {
      console.error("Erro ao buscar detalhes do resgate:", error);
    }
  };

  const handleValidation = () => {
    if (!validatedBy.trim()) {
      toast.error("Nome do validador é obrigatório");
      return;
    }

    const validationData: any = {
      store_id: actualStoreId!,
      store_validation_metadata: {
        validated_by: validatedBy,
        validation_location: validationLocation,
        notes: validationNotes,
      },
    };

    // Adicionar QR code ou código verificador baseado no que foi usado
    if (useVerificationCode && verificationCodeInput) {
      validationData.verification_code = verificationCodeInput;
    } else if (qrCodeInput) {
      validationData.qr_code = qrCodeInput;
    }

    validateRedemption(validationData, {
      onSuccess: (data) => {
        if (data.success) {
          setShowDetails(false);
          setQrCodeInput("");
          setVerificationCodeInput("");
          setScannedData(null);
          setRedemptionDetails(null);
          setValidationNotes("");
          setValidationLocation("");
          setValidatedBy("");
          setUseVerificationCode(false);
          toast.success("Resgate validado com sucesso!");
        }
      },
    });
  };

  const handleManualInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQrCodeInput(e.target.value);
  };

  const handleVerificationCodeInput = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setVerificationCodeInput(e.target.value.toUpperCase());
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (useVerificationCode) {
        setVerificationCodeInput(text.toUpperCase());
      } else {
        setQrCodeInput(text);
      }
    } catch (error) {
      toast.error("Não foi possível acessar a área de transferência");
    }
  };

  const handleScannerResult = (scannedData: string) => {
    setQrCodeInput(scannedData);
    setShowScanner(false);

    // Auto-validar o QR code escaneado
    setTimeout(() => {
      handleQRCodeSubmit();
    }, 500);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            Leitor de QR Code e Códigos Verificadores
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 mb-4">
            <Button
              variant={!useVerificationCode ? "default" : "outline"}
              onClick={() => setUseVerificationCode(false)}
              size="sm"
            >
              <QrCode className="h-4 w-4 mr-2" />
              QR Code
            </Button>
            <Button
              variant={useVerificationCode ? "default" : "outline"}
              onClick={() => setUseVerificationCode(true)}
              size="sm"
            >
              <Hash className="h-4 w-4 mr-2" />
              Código Verificador
            </Button>
          </div>

          {!useVerificationCode ? (
            <div className="space-y-2">
              <Label htmlFor="qr-code">QR Code</Label>
              <div className="flex gap-2">
                <Input
                  id="qr-code"
                  value={qrCodeInput}
                  onChange={handleManualInput}
                  placeholder="Cole o QR code aqui ou escaneie"
                  className="flex-1"
                />
                <Button onClick={handlePaste} variant="outline" size="sm">
                  Colar
                </Button>
                <Button
                  onClick={() => setShowScanner(true)}
                  variant="outline"
                  size="sm"
                >
                  <Camera className="h-4 w-4" />
                  Scanner
                </Button>
              </div>
              <Button
                onClick={handleQRCodeSubmit}
                disabled={!qrCodeInput.trim() || isPending}
                className="w-full"
              >
                {isPending ? "Validando..." : "Validar QR Code"}
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="verification-code">Código Verificador</Label>
              <div className="flex gap-2">
                <Input
                  id="verification-code"
                  value={verificationCodeInput}
                  onChange={handleVerificationCodeInput}
                  placeholder="Ex: LOJA-A1B2C3D4"
                  className="flex-1 font-mono text-center"
                  maxLength={13}
                />
                <Button onClick={handlePaste} variant="outline" size="sm">
                  Colar
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Formato: XXXX-XXXXXXXX (4 letras + hífen + 8 caracteres)
              </p>
              <Button
                onClick={handleVerificationCodeSubmit}
                disabled={!verificationCodeInput.trim() || isPending}
                className="w-full"
              >
                {isPending ? "Validando..." : "Validar Código"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detalhes do Resgate</DialogTitle>
          </DialogHeader>

          {redemptionDetails && (
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Gift className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">
                    {redemptionDetails.redemption.reward.title}
                  </span>
                </div>

                <p className="text-sm text-gray-600">
                  {redemptionDetails.redemption.reward.description}
                </p>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-gray-500" />
                    <span>{redemptionDetails.redemption.user.name}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>
                      Resgatado em{" "}
                      {new Date(
                        redemptionDetails.redemption.redeemed_at
                      ).toLocaleDateString("pt-BR")}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{redemptionDetails.redemption.store.name}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Badge variant="outline">
                    {redemptionDetails.redemption.cost_points} pontos
                  </Badge>
                  <Badge
                    className={
                      redemptionDetails.redemption.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }
                  >
                    {redemptionDetails.redemption.status === "pending"
                      ? "Pendente"
                      : "Validado"}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <div className="space-y-2">
                  <Label htmlFor="validated-by">Nome do Validador *</Label>
                  <Input
                    id="validated-by"
                    value={validatedBy}
                    onChange={(e) => setValidatedBy(e.target.value)}
                    placeholder="Seu nome"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="validation-location">
                    Local da Validação
                  </Label>
                  <Input
                    id="validation-location"
                    value={validationLocation}
                    onChange={(e) => setValidationLocation(e.target.value)}
                    placeholder="Ex: Caixa 1, Balcão"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="validation-notes">Observações</Label>
                  <Input
                    id="validation-notes"
                    value={validationNotes}
                    onChange={(e) => setValidationNotes(e.target.value)}
                    placeholder="Observações adicionais"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={handleValidation}
                  disabled={!validatedBy.trim() || isPending}
                  className="flex-1"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Confirmar Validação
                </Button>
                <Button
                  onClick={() => setShowDetails(false)}
                  variant="outline"
                  className="flex-1"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showScanner} onOpenChange={setShowScanner}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Scanner de QR Code</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {actualStoreId && (
              <QRScanner
                onScan={handleScannerResult}
                onClose={() => setShowScanner(false)}
                storeId={actualStoreId as string}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
