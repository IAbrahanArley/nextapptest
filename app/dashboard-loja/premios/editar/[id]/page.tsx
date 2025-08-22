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
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useUpdateReward } from "@/hooks/mutations/use-update-reward";
import { useRewards } from "@/hooks/queries/use-rewards";
import { useToast } from "@/hooks/use-toast";
import { RewardForm } from "../../novo/components/reward-form";
import type { UpdateRewardInput } from "@/actions/rewards/schema";
import { useStoreId } from "@/hooks/queries/use-store-id";

export default function EditarPremioPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const { data: storeIdData, isLoading: isLoadingStoreId } = useStoreId();
  const storeId = storeIdData?.data?.storeId;
  const [reward, setReward] = useState<any>(null);

  const rewardId = params.id as string;

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: rewardsData, isLoading: isLoadingRewards } = useRewards({
    store_id: storeId || "",
  });

  const updateRewardMutation = useUpdateReward(storeId || "");

  useEffect(() => {
    if (rewardsData?.data) {
      const foundReward = rewardsData.data.find((r) => r.id === rewardId);
      if (foundReward) {
        setReward(foundReward);
      }
    }
  }, [rewardsData, rewardId]);

  // Não renderizar até que o componente esteja montado no cliente
  if (!mounted) {
    return null;
  }

  if (isLoadingStoreId) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard-loja/premios">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Editar Prêmio</h1>
            <p className="text-gray-600">Carregando...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!storeId) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard-loja/premios">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Editar Prêmio</h1>
            <p className="text-gray-600">Erro: Loja não encontrada</p>
          </div>
        </div>
      </div>
    );
  }

  if (!reward) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard-loja/premios">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">Prêmio não encontrado</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (data: any) => {
    try {
      const result = await updateRewardMutation.mutateAsync({
        id: rewardId,
        ...data,
      });

      if (result.success) {
        toast({
          title: "Sucesso!",
          description: result.message,
        });
        router.push("/dashboard-loja/premios");
      } else {
        toast({
          title: "Erro",
          description: result.error || "Erro ao atualizar prêmio",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro ao atualizar prêmio:", error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao atualizar prêmio",
        variant: "destructive",
      });
    }
  };

  if (isLoadingRewards) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard-loja/premios">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Editar Prêmio</h1>
          <p className="text-gray-600">
            Edite as informações do prêmio "{reward.title}"
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dados do Prêmio</CardTitle>
          <CardDescription>Atualize as informações do prêmio</CardDescription>
        </CardHeader>
        <CardContent>
          <RewardForm
            onSubmit={handleSubmit}
            isLoading={updateRewardMutation.isPending}
            defaultValues={reward}
          />
        </CardContent>
      </Card>
    </div>
  );
}
