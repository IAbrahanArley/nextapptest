"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Calendar, MapPin, User, Hash, Copy } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

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
  const [redemptions, setRedemptions] = useState<RewardRedemption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      fetchRedemptions();
    }
  }, [session]);

  const fetchRedemptions = async () => {
    try {
      const response = await fetch("/api/clients/reward-redemptions");
      if (response.ok) {
        const data = await response.json();
        setRedemptions(data.redemptions || []);
      }
    } catch (error) {
      console.error("Erro ao buscar resgates:", error);
      toast.error("Erro ao carregar prêmios resgatados");
    } finally {
      setLoading(false);
    }
  };

  const downloadQRCode = async (qrCode: string, rewardTitle: string) => {
    try {
      const response = await fetch(qrCode);
      const blob = await response.blob();
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
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "expired":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getValidationStatusColor = (status: string) => {
    switch (status) {
      case "validated":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "expired":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (redemptions.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="text-gray-500">
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {redemptions.map((redemption) => (
        <Card key={redemption.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start mb-2">
              <CardTitle className="text-lg">
                {redemption.reward.title}
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
            <div className="flex gap-2">
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
              <Badge variant="outline">{redemption.cost_points} pontos</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-sm mb-4">
              {redemption.reward.description}
            </p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-500">
                <MapPin className="h-4 w-4 mr-2" />
                {redemption.store.name}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-2" />
                Resgatado em{" "}
                {new Date(redemption.redeemed_at).toLocaleDateString("pt-BR")}
              </div>
            </div>

            {/* Código Verificador */}
            {redemption.verification_code && (
              <div className="border rounded-lg p-4 bg-blue-50 mb-4">
                <div className="text-center mb-3">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Hash className="h-4 w-4 text-blue-600" />
                    <p className="text-sm font-medium text-blue-800">
                      Código Verificador
                    </p>
                  </div>
                  <div className="bg-white border rounded px-3 py-2 mb-3">
                    <code className="text-lg font-mono text-blue-900">
                      {redemption.verification_code}
                    </code>
                  </div>
                  <Button
                    onClick={() =>
                      copyVerificationCode(redemption.verification_code)
                    }
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar Código
                  </Button>
                </div>
                <p className="text-xs text-blue-600 text-center">
                  Use este código na loja se não conseguir ler o QR code
                </p>
              </div>
            )}

            {/* QR Code */}
            {redemption.qr_code && (
              <div className="border rounded-lg p-4 bg-gray-50 mb-4">
                <div className="text-center mb-2">
                  <p className="text-xs text-gray-500 mb-2">
                    QR Code para Validação
                  </p>
                  <div
                    className="mx-auto"
                    dangerouslySetInnerHTML={{ __html: redemption.qr_code }}
                  />
                </div>
                <Button
                  onClick={() =>
                    downloadQRCode(redemption.qr_code, redemption.reward.title)
                  }
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Baixar QR Code
                </Button>
              </div>
            )}

            <div className="text-xs text-gray-500 text-center">
              Apresente o QR code ou código verificador na loja para validar seu
              resgate
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
