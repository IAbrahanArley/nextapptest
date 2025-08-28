"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Calendar, MapPin, Hash, Copy } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRewardRedemptions } from "@/hooks/queries";
import { useEffect, useState } from "react";
import QRCode from "qrcode";

interface RewardRedemption {
  id: string;
  cost_points: number;
  status: string;
  validation_status: string;
  redeemed_at: string;
  qr_code: string;
  verification_code: string;
  metadata: any;
  reward: {
    title: string;
    description: string;
    type: string;
  };
  store: {
    name: string;
    address: string;
  };
}

export function PremiosResgatadosClient() {
  const { data: session } = useSession();
  const isMobile = useIsMobile();
  const [qrCodeSVGs, setQrCodeSVGs] = useState<Record<string, string>>({});

  const {
    data: redemptionsData,
    isLoading,
    error,
  } = useRewardRedemptions({
    user_id: session?.user?.id || "",
  });

  const redemptions = redemptionsData?.data || [];

  // Gerar QR codes SVG quando os dados são carregados
  useEffect(() => {
    const generateQRCodes = async () => {
      const newQrCodeSVGs: Record<string, string> = {};

      for (const redemption of redemptions) {
        if (redemption.qr_code) {
          try {
            // Tentar fazer parse dos dados JSON
            const qrData = JSON.parse(redemption.qr_code);
            console.log("Dados parseados:", qrData);

            // Gerar QR code com dados mais simples
            const qrString = `${qrData.redemption_id}-${qrData.reward_id}-${qrData.store_id}`;
            console.log("String para QR code:", qrString);

            const svg = await QRCode.toString(qrString, {
              type: "svg",
              width: 200,
              margin: 2,
              color: {
                dark: "#000000",
                light: "#FFFFFF",
              },
            });
            console.log(
              "SVG gerado para",
              redemption.id,
              ":",
              svg.substring(0, 100) + "..."
            );
            newQrCodeSVGs[redemption.id] = svg;
          } catch (error) {
            console.error("Erro ao gerar QR code:", error);
            // Se não conseguir fazer parse, usar o valor original
            newQrCodeSVGs[redemption.id] = redemption.qr_code;
          }
        }
      }

      setQrCodeSVGs(newQrCodeSVGs);
    };

    if (redemptions.length > 0) {
      generateQRCodes();
    }
  }, [redemptions]);

  const downloadQRCode = async (redemptionId: string, rewardTitle: string) => {
    try {
      const svg = qrCodeSVGs[redemptionId];
      if (!svg) {
        toast.error("QR code não disponível");
        return;
      }

      // Criar um blob com o SVG
      const blob = new Blob([svg], { type: "image/svg+xml" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `qr-code-${rewardTitle
        .replace(/\s+/g, "-")
        .toLowerCase()}.svg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("QR code baixado com sucesso!");
    } catch (error) {
      console.error("Erro ao baixar QR code:", error);
      toast.error("Erro ao baixar QR code");
    }
  };

  const copyVerificationCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Código copiado para a área de transferência!");
    } catch (error) {
      console.error("Erro ao copiar código:", error);
      toast.error("Erro ao copiar código");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "expired":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    }
  };

  const getValidationStatusColor = (status: string) => {
    switch (status) {
      case "validated":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200 dark:border-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-200 dark:border-yellow-700";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-200 dark:border-red-700";
      case "expired":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-200 dark:border-blue-700";
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardContent className="py-12 text-center">
          <div className="text-red-500 dark:text-red-400">
            <p className="text-lg mb-2">Erro ao carregar prêmios resgatados</p>
            <p className="text-sm">Tente novamente mais tarde</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (redemptions.length === 0) {
    return (
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardContent className="py-12 text-center">
          <div className="text-gray-500 dark:text-gray-400">
            <p className="text-lg mb-2">Nenhum prêmio resgatado ainda</p>
            <p className="text-sm">
              Resgate prêmios para ver seus QR codes aqui
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {redemptions.map((redemption: any) => (
        <Card
          key={redemption.id}
          className="hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700"
        >
          <CardHeader>
            <div className="flex justify-between items-start mb-2">
              <CardTitle className="text-lg text-gray-900 dark:text-gray-100">
                {redemption.reward?.title || "Prêmio Desconhecido"}
              </CardTitle>
              <Badge className={getStatusColor(redemption.status)}>
                {redemption.status === "completed"
                  ? "Concluído"
                  : redemption.status === "pending"
                  ? "Pendente"
                  : redemption.status === "cancelled"
                  ? "Cancelado"
                  : redemption.status === "expired"
                  ? "Expirado"
                  : redemption.status}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant="outline"
                className={getValidationStatusColor(
                  redemption.validation_status
                )}
              >
                {redemption.validation_status === "validated"
                  ? "Validado"
                  : redemption.validation_status === "pending"
                  ? "Aguardando"
                  : redemption.validation_status === "rejected"
                  ? "Rejeitado"
                  : redemption.validation_status === "expired"
                  ? "Expirado"
                  : redemption.validation_status}
              </Badge>
              <Badge
                variant="outline"
                className="border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300"
              >
                {redemption.cost_points} pontos
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              {redemption.reward?.description || "Descrição não disponível"}
            </p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <MapPin className="h-4 w-4 mr-2" />
                {redemption.store?.name || "Loja Desconhecida"}
              </div>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Calendar className="h-4 w-4 mr-2" />
                Resgatado em{" "}
                {new Date(redemption.redeemed_at).toLocaleDateString("pt-BR")}
              </div>
            </div>

            {/* Código Verificador */}
            {redemption.verification_code && (
              <div className="border rounded-lg p-4 bg-blue-50 dark:bg-blue-900/20 mb-4 border-blue-200 dark:border-blue-700">
                <div className="text-center mb-3">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Hash className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                      Código Verificador
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 border rounded px-3 py-2 mb-3 border-blue-200 dark:border-blue-600">
                    <code className="text-lg font-mono text-blue-900 dark:text-blue-100">
                      {redemption.verification_code}
                    </code>
                  </div>
                  <Button
                    onClick={() =>
                      copyVerificationCode(redemption.verification_code!)
                    }
                    variant="outline"
                    size="sm"
                    className="w-full border-blue-200 dark:border-blue-600 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    {isMobile ? "Copiar" : "Copiar Código"}
                  </Button>
                </div>
                <p className="text-xs text-blue-600 dark:text-blue-400 text-center">
                  Use este código na loja se não conseguir ler o QR code
                </p>
              </div>
            )}

            {/* QR Code */}
            {redemption.qr_code && (
              <div className="border rounded-lg p-6 bg-gray-50 dark:bg-gray-800/50 mb-4 border-gray-200 dark:border-gray-600">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                    QR Code para Validação
                  </p>
                  {qrCodeSVGs[redemption.id] ? (
                    <div className="flex justify-center items-center mb-4">
                      <div
                        className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm"
                        dangerouslySetInnerHTML={{
                          __html: qrCodeSVGs[redemption.id],
                        }}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-48">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
                      <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                        Gerando QR code...
                      </span>
                    </div>
                  )}
                </div>
                {qrCodeSVGs[redemption.id] && (
                  <Button
                    onClick={() =>
                      downloadQRCode(
                        redemption.id,
                        redemption.reward?.title || "Prêmio"
                      )
                    }
                    variant="outline"
                    size="sm"
                    className="w-full border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {isMobile ? "Baixar" : "Baixar QR Code"}
                  </Button>
                )}
              </div>
            )}

            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Apresente o QR code ou código verificador na loja para validar seu
              resgate
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
