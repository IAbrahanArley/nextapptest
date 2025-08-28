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
import {
  Header,
  ValidationCard,
  RedemptionDetails,
  ValidationForm,
} from "./components";

interface QRCodeData {
  redemption_id: string;
  reward_id: string;
  store_id: string;
  user_id: string;
  cost_points: number;
  timestamp: number;
}

interface RedemptionDetailsData {
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
    useState<RedemptionDetailsData | null>(null);
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

  const handleQRCodeChange = (value: string) => {
    setQrCodeInput(value);
  };

  const handleVerificationCodeChange = (value: string) => {
    setVerificationCodeInput(value.toUpperCase());
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
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
        <Header />

        <ValidationCard
          useVerificationCode={useVerificationCode}
          onMethodChange={setUseVerificationCode}
          qrCodeInput={qrCodeInput}
          onQRCodeChange={handleQRCodeChange}
          onQRCodePaste={handlePaste}
          onQRCodeScannerOpen={() => setShowScanner(true)}
          onQRCodeSubmit={handleQRCodeSubmit}
          verificationCodeInput={verificationCodeInput}
          onVerificationCodeChange={handleVerificationCodeChange}
          onVerificationCodePaste={handlePaste}
          onVerificationCodeSubmit={handleVerificationCodeSubmit}
          isPending={isPending}
        />

        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Detalhes do Resgate</DialogTitle>
            </DialogHeader>

            {redemptionDetails && (
              <>
                <RedemptionDetails redemption={redemptionDetails.redemption} />

                <ValidationForm
                  validatedBy={validatedBy}
                  onValidatedByChange={setValidatedBy}
                  validationLocation={validationLocation}
                  onValidationLocationChange={setValidationLocation}
                  validationNotes={validationNotes}
                  onValidationNotesChange={setValidationNotes}
                  onValidation={handleValidation}
                  onCancel={() => setShowDetails(false)}
                  isPending={isPending}
                />
              </>
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
    </div>
  );
}
