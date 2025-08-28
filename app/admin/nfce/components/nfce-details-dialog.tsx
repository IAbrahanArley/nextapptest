"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ExternalLink,
  Calendar,
  DollarSign,
  Building,
  User,
  Store,
} from "lucide-react";

interface NFCeItem {
  id: string;
  chaveAcesso: string;
  estado: string;
  sefazUrl: string;
  status: "pending" | "approved" | "rejected";
  valorTotal?: number;
  dataEmissao?: string;
  estabelecimento?: string;
  cnpj?: string;
  pontosAtribuidos?: number;
  observacoes?: string;
  validadoPor?: string;
  validadoEm?: string;
  createdAt: string;
  userName?: string;
  userEmail?: string;
  userCpf?: string;
  storeName?: string;
  storeCnpj?: string;
}

interface NFCeDetailsDialogProps {
  nfce: NFCeItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NFCeDetailsDialog({
  nfce,
  open,
  onOpenChange,
}: NFCeDetailsDialogProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Pendente</Badge>;
      case "approved":
        return <Badge variant="default">Aprovada</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejeitada</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getEstadoName = (estado: string) => {
    const estados: Record<string, string> = {
      "11": "RO",
      "12": "AC",
      "13": "AM",
      "14": "RR",
      "15": "PA",
      "16": "AP",
      "17": "TO",
      "21": "MA",
      "22": "PI",
      "23": "CE",
      "24": "RN",
      "25": "PB",
      "26": "PE",
      "27": "AL",
      "28": "SE",
      "29": "BA",
      "31": "MG",
      "32": "ES",
      "33": "RJ",
      "35": "SP",
      "41": "PR",
      "42": "SC",
      "43": "RS",
      "50": "MS",
      "51": "MT",
      "52": "GO",
      "53": "DF",
    };
    return estados[estado] || estado;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const openSEFAZ = () => {
    window.open(nfce.sefazUrl, "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Detalhes da NFC-e
            {getStatusBadge(nfce.status)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações básicas */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Building className="w-5 h-5" />
              Informações da Nota
            </h3>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Chave de Acesso:</span>
                <p className="text-muted-foreground font-mono text-xs break-all mt-1">
                  {nfce.chaveAcesso}
                </p>
              </div>

              <div>
                <span className="font-medium">Estado:</span>
                <p className="text-muted-foreground mt-1">
                  {getEstadoName(nfce.estado)}
                </p>
              </div>

              <div>
                <span className="font-medium">Status:</span>
                <div className="mt-1">{getStatusBadge(nfce.status)}</div>
              </div>

              <div>
                <span className="font-medium">Data de Criação:</span>
                <p className="text-muted-foreground mt-1">
                  {formatDate(nfce.createdAt)}
                </p>
              </div>
            </div>

            <Button variant="outline" onClick={openSEFAZ} className="w-full">
              <ExternalLink className="w-4 h-4 mr-2" />
              Abrir SEFAZ
            </Button>
          </div>

          {/* Dados da nota (se aprovada) */}
          {nfce.status === "approved" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Dados Validados
              </h3>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Valor Total:</span>
                  <p className="text-muted-foreground mt-1">
                    {nfce.valorTotal
                      ? `R$ ${nfce.valorTotal.toFixed(2)}`
                      : "N/A"}
                  </p>
                </div>

                <div>
                  <span className="font-medium">Data de Emissão:</span>
                  <p className="text-muted-foreground mt-1">
                    {nfce.dataEmissao ? formatDate(nfce.dataEmissao) : "N/A"}
                  </p>
                </div>

                <div>
                  <span className="font-medium">Estabelecimento:</span>
                  <p className="text-muted-foreground mt-1">
                    {nfce.estabelecimento || "N/A"}
                  </p>
                </div>

                <div>
                  <span className="font-medium">CNPJ:</span>
                  <p className="text-muted-foreground mt-1">
                    {nfce.cnpj || "N/A"}
                  </p>
                </div>

                <div>
                  <span className="font-medium">Pontos Atribuídos:</span>
                  <p className="text-muted-foreground mt-1">
                    {nfce.pontosAtribuidos || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Dados de rejeição */}
          {nfce.status === "rejected" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Motivo da Rejeição
              </h3>

              <div className="space-y-2">
                <span className="font-medium">Observações:</span>
                <p className="text-muted-foreground mt-1">
                  {nfce.observacoes || "N/A"}
                </p>
              </div>
            </div>
          )}

          {/* Informações do cliente */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="w-5 h-5" />
              Informações do Cliente
            </h3>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Nome:</span>
                <p className="text-muted-foreground mt-1">
                  {nfce.userName || "N/A"}
                </p>
              </div>

              <div>
                <span className="font-medium">Email:</span>
                <p className="text-muted-foreground mt-1">
                  {nfce.userEmail || "N/A"}
                </p>
              </div>

              <div>
                <span className="font-medium">CPF:</span>
                <p className="text-muted-foreground mt-1">
                  {nfce.userCpf || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Informações da loja */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Store className="w-5 h-5" />
              Informações da Loja
            </h3>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Nome:</span>
                <p className="text-muted-foreground mt-1">
                  {nfce.storeName || "N/A"}
                </p>
              </div>

              <div>
                <span className="font-medium">CNPJ:</span>
                <p className="text-muted-foreground mt-1">
                  {nfce.storeCnpj || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Informações de validação */}
          {(nfce.status === "approved" || nfce.status === "rejected") && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Informações de Validação
              </h3>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Validado em:</span>
                  <p className="text-muted-foreground mt-1">
                    {nfce.validadoEm ? formatDate(nfce.validadoEm) : "N/A"}
                  </p>
                </div>

                <div>
                  <span className="font-medium">Validado por:</span>
                  <p className="text-muted-foreground mt-1">
                    {nfce.validadoPor || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Botão de fechar */}
          <div className="pt-4">
            <Button onClick={() => onOpenChange(false)} className="w-full">
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


