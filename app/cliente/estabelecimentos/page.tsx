"use client";

import { useEffect, useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import EstabelecimentosLoading from "./loading";
import {
  StatsCards,
  SearchFilters,
  StoreCard,
  PaginationComponent,
  EmptyState,
} from "./components";
import { Store, Reward } from "./types";
import { Card, CardContent } from "@/components/ui/card";

export default function EstabelecimentosPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [stores, setStores] = useState<Store[]>([]);
  const [filteredStores, setFilteredStores] = useState<Store[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.push("/login?type=customer");
      return;
    }

    if (session?.user?.role !== "customer") {
      router.push("/login?type=customer");
      return;
    }

    fetchStores();
  }, [session, status, router]);

  const fetchStores = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/clients/stores");
      if (response.ok) {
        const data = await response.json();
        const storesWithRewards = data.stores || [];

        // Ordenar: primeiro lojas com pontos, depois as demais
        const sortedStores = storesWithRewards.sort((a: Store, b: Store) => {
          if (a.points > 0 && b.points === 0) return -1;
          if (a.points === 0 && b.points > 0) return 1;
          return b.points - a.points; // Ordem decrescente de pontos
        });

        setStores(sortedStores);
        setFilteredStores(sortedStores);
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível carregar os estabelecimentos",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao conectar com o servidor",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Função para filtrar estabelecimentos
  const filterStores = useMemo(() => {
    let filtered = stores;

    // Filtro por pesquisa
    if (searchTerm) {
      filtered = filtered.filter(
        (store) =>
          store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          store.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          store.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por categoria
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (store) => store.category === selectedCategory
      );
    }

    return filtered;
  }, [stores, searchTerm, selectedCategory]);

  // Função para paginação
  const paginatedStores = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filterStores.slice(startIndex, endIndex);
  }, [filterStores, currentPage, itemsPerPage]);

  // Total de páginas
  const totalPages = Math.ceil(filterStores.length / itemsPerPage);

  // Categorias únicas
  const categories = useMemo(() => {
    const cats = [
      ...new Set(stores.map((store) => store.category).filter(Boolean)),
    ];
    return cats.sort();
  }, [stores]);

  // Função para mudar de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Função para resetar filtros
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setCurrentPage(1);
  };

  // Função para resgatar prêmio
  const handleRedeemReward = async (reward: Reward, store: Store) => {
    try {
      const response = await fetch("/api/clients/rewards/redeem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rewardId: reward.id,
          storeId: store.id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Sucesso!",
          description: data.message,
        });
        // Recarregar dados para atualizar pontos
        await fetchStores();
      } else {
        toast({
          title: "Erro",
          description: data.error || "Erro ao resgatar prêmio",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao conectar com o servidor",
        variant: "destructive",
      });
    }
  };

  if (status === "loading" || isLoading) {
    return <EstabelecimentosLoading />;
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
        <div className="border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm p-4 sm:p-6 mb-6 sm:mb-8 dark:bg-gray-800">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Estabelecimentos Parceiros
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
            Descubra todas as lojas onde você pode acumular e usar seus pontos
          </p>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <StatsCards stores={stores} />

          <SearchFilters
            searchTerm={searchTerm}
            selectedCategory={selectedCategory}
            itemsPerPage={itemsPerPage}
            categories={categories}
            filteredStoresCount={filterStores.length}
            isLoading={isLoading}
            onSearchChange={(value) => {
              setSearchTerm(value);
              setCurrentPage(1);
            }}
            onCategoryChange={(value) => {
              setSelectedCategory(value);
              setCurrentPage(1);
            }}
            onItemsPerPageChange={(value) => {
              setItemsPerPage(value);
              setCurrentPage(1);
            }}
            onResetFilters={resetFilters}
            onRefresh={fetchStores}
          />

          <div className="space-y-6">
            {paginatedStores.map((store) => (
              <StoreCard
                key={store.id}
                store={store}
                onRedeemReward={handleRedeemReward}
              />
            ))}
          </div>

          {filteredStores.length === 0 && (
            <EmptyState
              searchTerm={searchTerm}
              selectedCategory={selectedCategory}
            />
          )}

          {/* Paginação */}
          {totalPages > 1 && (
            <Card className="shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="pt-6">
                <PaginationComponent
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
