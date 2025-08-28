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
      const formData = new FormData();
      formData.append("image", file);
      formData.append("storeId", storeId);

      const response = await fetch("/api/stores/upload-profile-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erro ao fazer upload da imagem");
      }

      const result = await response.json();
      if (result.success) {
        // Atualizar o estado local
        setStoreData((prev: StoreData | null) =>
          prev
            ? {
                ...prev,
                profileImageUrl: result.data.imageUrl,
              }
            : null
        );
      }
    } catch (error) {
      console.error("Erro ao fazer upload:", error);
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
