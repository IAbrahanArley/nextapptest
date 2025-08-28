"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  CheckCircle,
  XCircle,
  ExternalLink,
  Info,
  Calculator,
  Settings,
} from "lucide-react";

interface NFCeItem {
  id: string;
  chaveAcesso: string;
  estado: string;
  sefazUrl: string;
  status: string;
  userName?: string;
  userEmail?: string;
  storeName?: string;
  storeId?: string;
}

interface StoreConfig {
  points_per_currency_unit: number;
  min_purchase_value_to_award: number;
  points_validity_days: number;
  hasCustomConfig: boolean;
}

interface NFCeValidationDialogProps {
  nfce: NFCeItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function NFCeValidationDialog({
  nfce,
  open,
  onOpenChange,
  onSuccess,
}: NFCeValidationDialogProps) {
  const [action, setAction] = useState<"approve" | "reject" | null>(null);
  const [loading, setLoading] = useState(false);
  const [storeConfig, setStoreConfig] = useState<StoreConfig | null>(null);
  const [showConfig, setShowConfig] = useState(false);
  const [formData, setFormData] = useState({
    valorTotal: "",
    dataEmissao: "",
    estabelecimento: "",
    cnpj: "",
    observacoes: "",
  });

  // Buscar configurações da loja quando o componente abrir
  useEffect(() => {
    if (open && nfce.storeId && action === "approve") {
      fetchStoreConfig();
    }
  }, [open, nfce.storeId, action]);

  const fetchStoreConfig = async () => {
    try {
      const response = await fetch(
        `/api/admin/nfce/store-config?storeId=${nfce.storeId}`
      );
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setStoreConfig(data.data.config);
        }
      }
    } catch (error) {
      console.error("Erro ao buscar configurações da loja:", error);
    }
  };

  const handleSubmit = async () => {
    if (!action) {
      toast.error("Selecione uma ação");
      return;
    }

    if (action === "approve" && !formData.valorTotal) {
      toast.error("Valor total é obrigatório para aprovação");
      return;
    }

    if (action === "reject" && !formData.observacoes) {
      toast.error("Observações são obrigatórias para rejeição");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/admin/nfce/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nfceId: nfce.id,
          action,
          valorTotal: formData.valorTotal
            ? parseFloat(formData.valorTotal)
            : undefined,
          dataEmissao: formData.dataEmissao || undefined,
          estabelecimento: formData.estabelecimento || undefined,
          cnpj: formData.cnpj || undefined,
          observacoes: formData.observacoes || undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro ao validar NFC-e");
      }

      const result = await response.json();
      toast.success(result.message);
      onSuccess();
    } catch (error) {
      console.error("Erro ao validar NFC-e:", error);
      toast.error(
        error instanceof Error ? error.message : "Erro ao validar NFC-e"
      );
    } finally {
      setLoading(false);
    }
  };

  const openSEFAZ = () => {
    window.open(nfce.sefazUrl, "_blank");
  };

  // Calcular pontos estimados baseado no valor informado
  const calculateEstimatedPoints = (valor: string) => {
    if (!valor || !storeConfig) return null;

    const valorNum = parseFloat(valor);
    if (isNaN(valorNum)) return null;

    if (valorNum < storeConfig.min_purchase_value_to_award) {
      return { pontos: 0, motivo: "Abaixo do valor mínimo" };
    }

    const pontos = Math.floor(valorNum * storeConfig.points_per_currency_unit);
    return {
      pontos,
      motivo: `${storeConfig.points_per_currency_unit} ponto(s) por R$ 1,00`,
    };
  };

  const estimatedPoints = calculateEstimatedPoints(formData.valorTotal);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Validar NFC-e</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações da NFC-e */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informações da Nota</h3>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Chave de Acesso:</span>
                <p className="text-muted-foreground font-mono text-xs break-all">
                  {nfce.chaveAcesso}
                </p>
              </div>

              <div>
                <span className="font-medium">Estado:</span>
                <p className="text-muted-foreground">{nfce.estado}</p>
              </div>

              <div>
                <span className="font-medium">Cliente:</span>
                <p className="text-muted-foreground">
                  {nfce.userName || "N/A"} ({nfce.userEmail || "N/A"})
                </p>
              </div>

              <div>
                <span className="font-medium">Loja:</span>
                <p className="text-muted-foreground">
                  {nfce.storeName || "N/A"}
                </p>
              </div>
            </div>

            <Button variant="outline" onClick={openSEFAZ} className="w-full">
              <ExternalLink className="w-4 h-4 mr-2" />
              Abrir SEFAZ para Validação
            </Button>
          </div>

          {/* Seleção de ação */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Ação</h3>

            <div className="flex gap-4">
              <Button
                variant={action === "approve" ? "default" : "outline"}
                onClick={() => setAction("approve")}
                className="flex-1"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Aprovar
              </Button>

              <Button
                variant={action === "reject" ? "destructive" : "outline"}
                onClick={() => setAction("reject")}
                className="flex-1"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Rejeitar
              </Button>
            </div>
          </div>

          {/* Formulário de aprovação */}
          {action === "approve" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Dados para Aprovação</h3>

              {/* Informação sobre cálculo automático de pontos */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Calculator className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="space-y-2">
                    <h4 className="font-medium text-blue-800">
                      🎯 Pontuação Automática
                    </h4>
                    <p className="text-sm text-blue-700">
                      Os pontos serão calculados automaticamente baseado nas
                      configurações de pontuação da loja{" "}
                      <strong>{nfce.storeName}</strong>.
                    </p>

                    {storeConfig && (
                      <div className="text-xs text-blue-600 space-y-1">
                        <p>
                          • <strong>Taxa:</strong>{" "}
                          {storeConfig.points_per_currency_unit} ponto(s) por R$
                          1,00
                        </p>
                        <p>
                          • <strong>Valor mínimo:</strong> R${" "}
                          {storeConfig.min_purchase_value_to_award.toFixed(2)}
                        </p>
                        <p>
                          • <strong>Validade:</strong>{" "}
                          {storeConfig.points_validity_days} dias
                        </p>
                      </div>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowConfig(!showConfig)}
                      className="mt-2"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      {showConfig ? "Ocultar" : "Ver"} Configurações
                    </Button>
                  </div>
                </div>
              </div>

              {/* Configurações detalhadas da loja */}
              {showConfig && storeConfig && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-800 mb-3">
                    ⚙️ Configurações de Pontuação
                  </h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">
                        Taxa de Pontos:
                      </span>
                      <p className="text-gray-800">
                        {storeConfig.points_per_currency_unit} por R$ 1,00
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">
                        Valor Mínimo:
                      </span>
                      <p className="text-gray-800">
                        R$ {storeConfig.min_purchase_value_to_award.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">
                        Validade:
                      </span>
                      <p className="text-gray-800">
                        {storeConfig.points_validity_days} dias
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="valorTotal">Valor Total (R$) *</Label>
                  <Input
                    id="valorTotal"
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="0.00"
                    value={formData.valorTotal}
                    onChange={(e) =>
                      setFormData({ ...formData, valorTotal: e.target.value })
                    }
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Valor total da nota fiscal para cálculo automático de pontos
                  </p>

                  {/* Mostrar pontos estimados */}
                  {estimatedPoints && (
                    <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-xs">
                      <span className="font-medium text-green-800">
                        📊 Pontos Estimados: {estimatedPoints.pontos}
                      </span>
                      <p className="text-green-700 mt-1">
                        {estimatedPoints.motivo}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dataEmissao">Data de Emissão</Label>
                  <Input
                    id="dataEmissao"
                    type="date"
                    value={formData.dataEmissao}
                    onChange={(e) =>
                      setFormData({ ...formData, dataEmissao: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estabelecimento">Estabelecimento</Label>
                  <Input
                    id="estabelecimento"
                    placeholder="Nome do estabelecimento"
                    value={formData.estabelecimento}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        estabelecimento: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input
                    id="cnpj"
                    placeholder="00.000.000/0000-00"
                    value={formData.cnpj}
                    onChange={(e) =>
                      setFormData({ ...formData, cnpj: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {/* Formulário de rejeição */}
          {action === "reject" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Motivo da Rejeição</h3>

              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações *</Label>
                <Textarea
                  id="observacoes"
                  placeholder="Descreva o motivo da rejeição..."
                  value={formData.observacoes}
                  onChange={(e) =>
                    setFormData({ ...formData, observacoes: e.target.value })
                  }
                  required
                  rows={4}
                />
              </div>
            </div>
          )}

          {/* Observações gerais */}
          {action && (
            <div className="space-y-2">
              <Label htmlFor="observacoesGeral">Observações Gerais</Label>
              <Textarea
                id="observacoesGeral"
                placeholder="Observações adicionais (opcional)..."
                value={formData.observacoes}
                onChange={(e) =>
                  setFormData({ ...formData, observacoes: e.target.value })
                }
                rows={3}
              />
            </div>
          )}

          {/* Botões de ação */}
          <div className="flex gap-4 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancelar
            </Button>

            {action && (
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1"
                variant={action === "approve" ? "default" : "destructive"}
              >
                {loading
                  ? "Processando..."
                  : action === "approve"
                  ? "Aprovar"
                  : "Rejeitar"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
