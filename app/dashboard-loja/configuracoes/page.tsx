"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useStoreData } from "@/hooks/queries/use-store-data";
import { useStoreId } from "@/hooks/queries/use-store-id";
import { useToast } from "@/hooks/use-toast";
import { Header, ConfiguracoesTabs } from "./components";

interface StoreData {
  name: string;
  description: string;
  cnpj: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  instagram: string;
  facebook: string;
  whatsapp: string;
  profileImageUrl: string;
}

interface PointsData {
  points_per_currency_unit: number;
  min_purchase_value_to_award: number;
  points_validity_days: number;
}

export default function ConfiguracoesPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [storeData, setStoreData] = useState<StoreData | null>(null);
  const [pointsData, setPointsData] = useState<PointsData | null>(null);

  // Buscar storeId do usuário
  const { data: storeIdData, isLoading: isLoadingStoreId } = useStoreId();
  const storeId = storeIdData?.data?.storeId || `store-${user?.id}`;

  // Buscar dados da loja
  const { data: storeDataResult, isLoading: isLoadingStoreData } =
    useStoreData(storeId);

  // Carregar dados da loja
  useEffect(() => {
    if (storeDataResult?.success && storeDataResult.data) {
      const { store, points } = storeDataResult.data;

      setStoreData({
        name: store.name || "",
        description: store.description || "",
        cnpj: store.cnpj || "",
        email: store.email || "",
        phone: store.phone || "",
        address: store.address || "",
        website: store.website || "",
        instagram: store.instagram || "",
        facebook: store.facebook || "",
        whatsapp: store.whatsapp || "",
        profileImageUrl: store.profileImageUrl || "",
      });

      setPointsData({
        points_per_currency_unit: points.points_per_currency_unit || 1,
        min_purchase_value_to_award: points.min_purchase_value_to_award || 0,
        points_validity_days: points.points_validity_days || 365,
      });
    }
  }, [storeDataResult]);

  // Handle image upload
  const handleImageUpload = async (file: File) => {
    try {
      console.log("🔄 Iniciando upload de imagem...");
      console.log("📁 Arquivo:", file.name, file.size, file.type);
      console.log("🏪 StoreId:", storeId);
      console.log("🏪 Nome da Loja:", storeData?.name);

      const formData = new FormData();
      formData.append("image", file);
      formData.append("storeId", storeId);
      formData.append("storeName", storeData?.name || "loja-sem-nome");

      console.log("📤 Enviando para API...");
      const response = await fetch("/api/upload/test-upload", {
        // Temporariamente usando endpoint de teste
        method: "POST",
        body: formData,
      });

      console.log(
        "📥 Resposta recebida:",
        response.status,
        response.statusText
      );

      if (!response.ok) {
        let errorMessage = `Erro HTTP: ${response.status}`;
        let errorDetails = "";

        try {
          const errorData = await response.json();
          console.error("❌ Erro na resposta:", errorData);

          if (errorData.error) {
            errorMessage = errorData.error;
          }
          if (errorData.details) {
            errorDetails = errorData.details;
          }
        } catch (parseError) {
          console.error("❌ Erro ao fazer parse da resposta:", parseError);
        }

        throw new Error(
          errorMessage + (errorDetails ? ` - ${errorDetails}` : "")
        );
      }

      const result = await response.json();
      console.log("✅ Resultado:", result);

      if (result.success) {
        // Atualizar o estado local
        setStoreData((prev: StoreData | null) =>
          prev
            ? {
                ...prev,
                profileImageUrl: result.url,
              }
            : null
        );

        toast({
          title: "Sucesso",
          description: "Imagem de perfil atualizada com sucesso!",
        });
      } else {
        throw new Error(result.error || "Erro desconhecido no upload");
      }
    } catch (error) {
      console.error("❌ Erro ao fazer upload:", error);
      toast({
        title: "Erro no Upload",
        description:
          error instanceof Error
            ? error.message
            : "Erro ao fazer upload da imagem",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Handlers de sucesso
  const handleStoreDataSuccess = () => {
    // Recarregar dados da loja se necessário
  };

  const handlePointsDataSuccess = () => {
    // Recarregar dados de pontuação se necessário
  };

  const handlePasswordSuccess = () => {
    toast({
      title: "Sucesso",
      description: "Senha alterada com sucesso!",
    });
  };

  if (isLoadingStoreId || isLoadingStoreData) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">
                Carregando configurações...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!storeData || !pointsData) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              Erro ao carregar configurações da loja.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
        <Header />

        <ConfiguracoesTabs
          storeData={storeData}
          pointsData={pointsData}
          onStoreDataSuccess={handleStoreDataSuccess}
          onPointsDataSuccess={handlePointsDataSuccess}
          onPasswordSuccess={handlePasswordSuccess}
          onImageUpload={handleImageUpload}
        />
      </div>
    </div>
  );
}
