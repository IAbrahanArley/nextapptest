"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, Gift, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRewards } from "@/hooks/queries/use-rewards";
import { useRewardsStats } from "@/hooks/queries/use-rewards-stats";
import { useDeleteReward } from "@/hooks/mutations/use-delete-reward";
import { useToast } from "@/hooks/use-toast";
import { useStoreId } from "@/hooks/queries/use-store-id";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { PremiosSkeleton } from "@/components/ui/dashboard-skeleton";

export default function PremiosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [mounted, setMounted] = useState(false);
  const { toast } = useToast();
  const { data: storeIdData, isLoading: isLoadingStoreId } = useStoreId();
  const storeId = storeIdData?.data?.storeId;

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: rewardsData, isLoading: isLoadingRewards } = useRewards({
    store_id: storeId || "",
  });

  const { data: statsData, isLoading: isLoadingStats } = useRewardsStats({
    store_id: storeId || "",
  });

  const deleteRewardMutation = useDeleteReward(storeId || "");

  const rewards = rewardsData?.data || [];
  const stats = statsData?.data;

  const filteredRewards = rewards.filter(
    (premio: any) =>
      premio.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      premio.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteReward = async (rewardId: string) => {
    try {
      await deleteRewardMutation.mutateAsync({ id: rewardId });
    } catch (error) {
      console.error("Erro ao excluir prêmio:", error);
    }
  };

  const canCreateMoreRewards = () => {
    if (!stats?.plan_limits) return false;
    const { max_rewards } = stats.plan_limits;
    const currentCount = stats.total_rewards || 0;
    return max_rewards === -1 || currentCount < max_rewards;
  };

  const getRemainingRewards = () => {
    if (!stats?.plan_limits) return 0;
    const { max_rewards } = stats.plan_limits;
    if (max_rewards === -1) return "Ilimitado";
    const currentCount = stats.total_rewards || 0;
    return Math.max(0, max_rewards - currentCount);
  };

  // Não renderizar até que o componente esteja montado no cliente
  if (!mounted) {
    return null;
  }

  if (isLoadingStoreId || isLoadingRewards || isLoadingStats) {
    return <PremiosSkeleton />;
  }

  if (!storeId) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Prêmios</h1>
            <p className="text-muted-foreground">Erro: Loja não encontrada</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Prêmios</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie os prêmios disponíveis para resgate
          </p>
        </div>
        <Link href="/dashboard-loja/premios/novo">
          <Button
            disabled={!canCreateMoreRewards()}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2.5"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Prêmio
          </Button>
        </Link>
      </div>

      {/* Alerta de limite */}
      {stats?.plan_limits && !canCreateMoreRewards() && (
        <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-800 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
                  Limite de prêmios atingido
                </p>
                <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                  Seu plano atual ({stats.plan_limits.plan_name}) permite apenas{" "}
                  {stats.plan_limits.max_rewards} prêmios.{" "}
                  <Link
                    href="/dashboard-loja/planos"
                    className="underline font-medium"
                  >
                    Faça upgrade do seu plano
                  </Link>{" "}
                  para criar mais prêmios.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-sm border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Prêmios
            </CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stats?.total_rewards || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats?.active_rewards || 0} disponíveis
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Prêmios Ativos
            </CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stats?.active_rewards || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Disponíveis</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Resgates (Este Mês)
            </CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stats?.monthly_redemptions || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Total de resgates
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Prêmios Restantes
            </CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {getRemainingRewards()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats?.plan_limits?.plan_name || "N/A"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="shadow-sm border-border bg-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-foreground">
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar prêmios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-border focus:border-primary focus:ring-primary bg-background"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de prêmios */}
      <Card className="shadow-sm border-border bg-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-foreground">
            Lista de Prêmios
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {filteredRewards.length} prêmio(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredRewards.length === 0 ? (
            <div className="text-center py-12">
              <Gift className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg font-medium">
                Nenhum prêmio encontrado
              </p>
              <p className="text-muted-foreground/70 text-sm mt-1">
                Comece criando seu primeiro prêmio
              </p>
              <Link href="/dashboard-loja/premios/novo">
                <Button className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Prêmio
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRewards.map((premio: any) => (
                <Card
                  key={premio.id}
                  className="hover:shadow-md transition-all duration-200 border-border bg-card hover:bg-card/80"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold text-foreground">
                        {premio.title}
                      </CardTitle>
                      <Badge
                        variant={premio.active ? "default" : "secondary"}
                        className={
                          premio.active
                            ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                            : "bg-muted text-muted-foreground"
                        }
                      >
                        {premio.active ? "Disponível" : "Indisponível"}
                      </Badge>
                    </div>
                    <CardDescription className="text-muted-foreground">
                      {premio.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Pontos necessários:
                      </span>
                      <span className="font-bold text-primary">
                        {premio.cost_points}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Tipo:
                      </span>
                      <Badge
                        variant="outline"
                        className="capitalize border-border text-foreground"
                      >
                        {premio.type}
                      </Badge>
                    </div>

                    {premio.quantity && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Quantidade:
                        </span>
                        <span className="font-bold text-foreground">
                          {premio.quantity}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Resgates:
                      </span>
                      <span className="font-bold text-green-600 dark:text-green-400">
                        {premio.redemptions_count || 0}
                      </span>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Link
                        href={`/dashboard-loja/premios/editar/${premio.id}`}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 border-border text-foreground hover:bg-muted"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-950/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir Prêmio</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir o prêmio "
                              {premio.title}"? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteReward(premio.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
