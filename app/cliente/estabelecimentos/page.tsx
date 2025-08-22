"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Store,
  MapPin,
  Phone,
  Globe,
  Instagram,
  Gift,
  Star,
  Clock,
  Users,
  Award,
  RefreshCw,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import EstabelecimentosLoading from "./loading";

interface Store {
  id: string;
  name: string;
  description?: string;
  logo_url?: string;
  address?: string;
  phone?: string;
  website?: string;
  instagram?: string;
  points: number;
  category: string;
  rating: number;
  total_customers: number;
  is_partner: boolean;
}

interface Reward {
  id: string;
  name: string;
  description: string;
  points_required: number;
  image_url?: string;
  category: string;
  available_quantity: number;
  expiry_date?: string;
  is_featured: boolean;
}

export default function EstabelecimentosPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [storeRewards, setStoreRewards] = useState<Reward[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingRewards, setIsLoadingRewards] = useState(false);

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
        setStores(data.stores || []);
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

  const fetchStoreRewards = async (storeId: string) => {
    setIsLoadingRewards(true);
    try {
      const response = await fetch(`/api/clients/stores/${storeId}/rewards`);
      if (response.ok) {
        const data = await response.json();
        setStoreRewards(data.rewards || []);
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível carregar os prêmios",
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
      setIsLoadingRewards(false);
    }
  };

  const handleStoreSelect = async (store: Store) => {
    setSelectedStore(store);
    if (store.is_partner) {
      await fetchStoreRewards(store.id);
    }
  };

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

        await fetchStores();
        if (selectedStore) {
          await fetchStoreRewards(selectedStore.id);
        }
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="border border-gray-200 rounded-lg shadow-sm p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-100 mb-2">
            Estabelecimentos Parceiros
          </h1>
          <p className="text-gray-600 text-lg">
            Descubra todas as lojas onde você pode acumular e usar seus pontos
          </p>
        </div>

        <Tabs defaultValue="stores" className="w-full">
          <TabsList className="grid w-full grid-cols-2  shadow-sm">
            <TabsTrigger value="stores" className="text-gray-100">
              Estabelecimentos
            </TabsTrigger>
            <TabsTrigger value="rewards" className="text-gray-100">
              Prêmios Disponíveis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stores" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700">
                    Total de Lojas
                  </CardTitle>
                  <Store className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {stores.length}
                  </div>
                  <p className="text-xs text-gray-500">
                    Estabelecimentos cadastrados
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700">
                    Lojas Parceiras
                  </CardTitle>
                  <Award className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {stores.filter((s) => s.is_partner).length}
                  </div>
                  <p className="text-xs text-gray-500">
                    Com programa de pontos
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700">
                    Total de Clientes
                  </CardTitle>
                  <Users className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">
                    {stores
                      .reduce((sum, s) => sum + (s.total_customers || 0), 0)
                      .toLocaleString()}
                  </div>
                  <p className="text-xs text-gray-500">Clientes cadastrados</p>
                </CardContent>
              </Card>

              <Card className="shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700">
                    Avaliação Média
                  </CardTitle>
                  <Star className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">
                    {stores.length > 0
                      ? (
                          stores.reduce((sum, s) => sum + (s.rating || 0), 0) /
                          stores.length
                        ).toFixed(1)
                      : "0.0"}
                  </div>
                  <p className="text-xs text-gray-500">Nota geral das lojas</p>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={fetchStores}
                disabled={isLoading}
                className="border-gray-300 text-gray-400 hover:bg-gray-50 hover:text-gray-700"
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
                />
                Atualizar
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stores.map((store) => (
                <Card
                  key={store.id}
                  className={`shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer border-2 ${
                    selectedStore?.id === store.id
                      ? "ring-2 ring-blue-500 border-blue-200 bg-blue-50"
                      : "border-gray-200"
                  }`}
                  onClick={() => handleStoreSelect(store)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      {store.logo_url ? (
                        <img
                          src={store.logo_url}
                          alt={store.name}
                          className="w-16 h-16 rounded-full object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center border border-gray-200">
                          <Store className="h-8 w-8 text-blue-600" />
                        </div>
                      )}
                      <div className="flex-1">
                        <CardTitle className="text-xl text-gray-100">
                          {store.name}
                        </CardTitle>
                        <CardDescription className="text-gray-600">
                          {store.description || "Loja parceira"}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="secondary"
                        className="bg-gray-100 text-gray-700"
                      >
                        {store.category || "Geral"}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium text-gray-100">
                          {store.rating?.toFixed(1) || "N/A"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-100">Seus pontos:</span>
                      <Badge
                        variant={store.points > 0 ? "default" : "secondary"}
                        className={
                          store.points > 0
                            ? "bg-green-600"
                            : "bg-gray-100 text-gray-700"
                        }
                      >
                        {store.points.toLocaleString()} pts
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      {store.address && (
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                          <MapPin className="h-4 w-4" />
                          <span className="truncate">{store.address}</span>
                        </div>
                      )}
                      {store.phone && (
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                          <Phone className="h-4 w-4" />
                          <span>{store.phone}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {store.is_partner ? (
                          <Badge variant="default" className="bg-green-600">
                            Parceiro
                          </Badge>
                        ) : (
                          <Badge
                            variant="secondary"
                            className="bg-gray-100 text-gray-700"
                          >
                            Não parceiro
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-gray-100">
                        {(store.total_customers || 0).toLocaleString()} clientes
                      </span>
                    </div>

                    <div className="pt-2 space-y-2">
                      {store.is_partner && store.points > 0 && (
                        <Button
                          className="w-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStoreSelect(store);
                          }}
                        >
                          <Gift className="h-4 w-4 mr-2" />
                          Ver Prêmios
                        </Button>
                      )}
                      {!store.is_partner && (
                        <Button variant="outline" className="w-full" disabled>
                          Em breve
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {stores.length === 0 && (
              <Card className="shadow-sm">
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <Store className="h-20 w-20 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-500 mb-2">
                      Nenhum estabelecimento encontrado
                    </h3>
                    <p className="text-gray-400">
                      Não há estabelecimentos cadastrados no momento.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="rewards" className="space-y-6 mt-6">
            {selectedStore ? (
              <div>
                <div className="rounded-lg shadow-sm p-6 mb-6">
                  <h2 className="text-2xl font-bold text-gray-100 mb-2">
                    Prêmios da {selectedStore.name}
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Troque seus pontos por prêmios exclusivos
                  </p>
                  <div className="flex items-center gap-4">
                    <Badge variant="default" className="bg-blue-600">
                      {selectedStore.points.toLocaleString()} pontos disponíveis
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedStore(null);
                        setStoreRewards([]);
                      }}
                      className="border-gray-300 text-gray-400 hover:bg-gray-50 hover:text-gray-700"
                    >
                      Trocar Loja
                    </Button>
                  </div>
                </div>

                {isLoadingRewards ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <>
                    {storeRewards.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {storeRewards.map((reward) => (
                          <Card
                            key={reward.id}
                            className={`shadow-sm hover:shadow-md transition-all duration-200 ${
                              reward.is_featured ? "ring-2 ring-yellow-400" : ""
                            }`}
                          >
                            <CardHeader className="pb-3">
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-lg text-gray-100">
                                  {reward.name}
                                </CardTitle>
                                {reward.is_featured && (
                                  <Badge
                                    variant="secondary"
                                    className="bg-yellow-100 text-yellow-100"
                                  >
                                    Destaque
                                  </Badge>
                                )}
                              </div>
                              <CardDescription className="text-gray-600">
                                {reward.description}
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="flex items-center justify-between">
                                <span className="text-gray-100">
                                  Pontos necessários:
                                </span>
                                <Badge
                                  variant="default"
                                  className="bg-purple-600"
                                >
                                  {reward.points_required.toLocaleString()} pts
                                </Badge>
                              </div>

                              <div className="flex items-center justify-between">
                                <span className="text-gray-100">
                                  Disponível:
                                </span>
                                <span className="text-sm font-medium text-gray-700">
                                  {reward.available_quantity} unidades
                                </span>
                              </div>

                              <div className="flex items-center justify-between">
                                <span className="text-gray-100">
                                  Categoria:
                                </span>
                                <Badge
                                  variant="outline"
                                  className="bg-gray-100 text-gray-100"
                                >
                                  {reward.category}
                                </Badge>
                              </div>

                              <Separator />

                              <Button
                                className="w-full"
                                disabled={
                                  selectedStore.points <
                                    reward.points_required ||
                                  reward.available_quantity === 0
                                }
                                onClick={() =>
                                  handleRedeemReward(reward, selectedStore)
                                }
                              >
                                <Gift className="h-4 w-4 mr-2" />
                                {selectedStore.points < reward.points_required
                                  ? "Pontos insuficientes"
                                  : reward.available_quantity === 0
                                  ? "Indisponível"
                                  : "Resgatar"}
                              </Button>

                              {selectedStore.points <
                                reward.points_required && (
                                <p className="text-xs text-red-600 text-center">
                                  Faltam{" "}
                                  {(
                                    reward.points_required -
                                    selectedStore.points
                                  ).toLocaleString()}{" "}
                                  pontos
                                </p>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <Card className="shadow-sm">
                        <CardContent className="pt-6">
                          <div className="text-center py-12">
                            <Gift className="h-20 w-20 mx-auto text-gray-300 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-500 mb-2">
                              Nenhum prêmio disponível
                            </h3>
                            <p className="text-gray-400">
                              Esta loja ainda não possui prêmios cadastrados.
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </>
                )}
              </div>
            ) : (
              <Card className="shadow-sm">
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <Store className="h-20 w-20 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-500 mb-2">
                      Selecione uma loja
                    </h3>
                    <p className="text-gray-400">
                      Escolha uma loja na aba "Estabelecimentos" para ver os
                      prêmios disponíveis.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
