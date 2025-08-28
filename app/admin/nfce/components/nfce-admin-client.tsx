"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  Eye,
  Check,
  LogOut,
} from "lucide-react";
import { toast } from "sonner";
import { NFCeValidationDialog } from "./nfce-validation-dialog";
import { NFCeDetailsDialog } from "./nfce-details-dialog";
import { Label } from "@/components/ui/label";

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
  storeId?: string;
}

interface NFCeStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export function NFCeAdminClient() {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<any>(null);

  const [nfceList, setNfceList] = useState<NFCeItem[]>([]);
  const [stats, setStats] = useState<NFCeStats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [storeFilter, setStoreFilter] = useState("all");
  const [selectedNFCe, setSelectedNFCe] = useState<NFCeItem | null>(null);
  const [showValidationDialog, setShowValidationDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  useEffect(() => {
    // Verificar se está logado como admin
    const user = localStorage.getItem("adminUser");
    const token = localStorage.getItem("adminToken");

    if (!user || !token) {
      router.push("/admin/login");
      return;
    }

    setAdminUser(JSON.parse(user));
    loadNFCe();
  }, [router]);

  useEffect(() => {
    if (adminUser) {
      loadNFCe();
    }
  }, [adminUser, currentPage, searchTerm, statusFilter, storeFilter]);

  const handleLogout = () => {
    localStorage.removeItem("adminUser");
    localStorage.removeItem("adminToken");
    router.push("/admin/login");
  };

  const loadNFCe = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "20",
        status: statusFilter,
        search: searchTerm,
        storeId: storeFilter,
      });

      const response = await fetch(`/api/admin/nfce/pending?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao carregar NFC-e");
      }

      const data = await response.json();
      if (data.success) {
        setNfceList(data.data.nfceList);
        setStats(data.data.stats);
        setTotalPages(data.data.pagination.totalPages);
      }
    } catch (error) {
      console.error("Erro ao carregar NFC-e:", error);
      toast.error("Erro ao carregar NFC-e");
    } finally {
      setLoading(false);
    }
  };

  const handleValidation = (nfce: NFCeItem) => {
    setSelectedNFCe(nfce);
    setShowValidationDialog(true);
  };

  const handleViewDetails = (nfce: NFCeItem) => {
    setSelectedNFCe(nfce);
    setShowDetailsDialog(true);
  };

  const handleValidationSuccess = () => {
    setShowValidationDialog(false);
    setSelectedNFCe(null);
    loadNFCe();
    toast.success("NFC-e processada com sucesso!");
  };

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

  if (!adminUser) {
    return <div>Verificando autenticação...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header com informações do admin */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Validação de NFC-e
          </h1>
          <p className="text-muted-foreground">
            Bem-vindo, {adminUser.name} ({adminUser.email})
          </p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" />
          Sair
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprovadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.approved}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejeitadas</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.rejected}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Buscar</Label>
              <Input
                placeholder="Chave, estabelecimento, CNPJ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                  <SelectItem value="approved">Aprovadas</SelectItem>
                  <SelectItem value="rejected">Rejeitadas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Loja</Label>
              <Select value={storeFilter} onValueChange={setStoreFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as lojas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {/* Aqui você pode adicionar as lojas disponíveis */}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setStoreFilter("all");
                  setCurrentPage(1);
                }}
                variant="outline"
                className="w-full"
              >
                Limpar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de NFC-e */}
      <Card>
        <CardHeader>
          <CardTitle>Notas Fiscais Eletrônicas</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Carregando...</div>
          ) : nfceList.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma NFC-e encontrada
            </div>
          ) : (
            <div className="space-y-4">
              {nfceList.map((nfce) => (
                <div key={nfce.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusBadge(nfce.status)}
                      <span className="text-sm text-muted-foreground">
                        {getEstadoName(nfce.estado)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(nfce)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Detalhes
                      </Button>
                      {nfce.status === "pending" && (
                        <Button
                          size="sm"
                          onClick={() => handleValidation(nfce)}
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Validar
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Chave de Acesso:</span>
                      <p className="text-muted-foreground font-mono text-xs break-all">
                        {nfce.chaveAcesso}
                      </p>
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

                  {nfce.status === "approved" && nfce.pontosAtribuidos && (
                    <div className="bg-green-50 border border-green-200 rounded p-3">
                      <p className="text-green-800 font-medium">
                        ✅ {nfce.pontosAtribuidos} pontos atribuídos
                      </p>
                    </div>
                  )}

                  {nfce.status === "rejected" && nfce.observacoes && (
                    <div className="bg-red-50 border border-red-200 rounded p-3">
                      <p className="text-red-800 font-medium">
                        ❌ Rejeitada: {nfce.observacoes}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Paginação */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                className={
                  currentPage === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => setCurrentPage(page)}
                  isActive={currentPage === page}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Diálogos */}
      {selectedNFCe && showValidationDialog && (
        <NFCeValidationDialog
          nfce={selectedNFCe}
          open={showValidationDialog}
          onOpenChange={setShowValidationDialog}
          onSuccess={handleValidationSuccess}
        />
      )}

      {selectedNFCe && showDetailsDialog && (
        <NFCeDetailsDialog
          nfce={selectedNFCe}
          open={showDetailsDialog}
          onOpenChange={setShowDetailsDialog}
        />
      )}
    </div>
  );
}
