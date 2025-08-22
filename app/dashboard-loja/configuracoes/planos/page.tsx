"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, CreditCard, Crown } from "lucide-react";

interface Subscription {
  id: string;
  status: string;
  plan_id: string;
  current_period_end: string;
  stripe_subscription_id: string;
}

export default function BillingPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // TODO: Implementar busca de subscription usando Drizzle
        // const subscription = await db.query.subscriptions.findFirst({
        //   where: eq(subscriptions.user_id, userId)
        // });

        // Mock data para desenvolvimento
        setSubscription({
          id: "1",
          status: "active",
          plan_id: "premium",
          current_period_end: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          ).toISOString(),
          stripe_subscription_id: "sub_123",
        });
      } catch (error) {
        console.error("Erro ao buscar subscription:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Carregando...</p>;
  if (!subscription) return <p>Nenhuma assinatura encontrada</p>;

  const getPlanName = (planId: string) => {
    switch (planId) {
      case "basico":
        return "Básico";
      case "premium":
        return "Premium";
      case "enterprise":
        return "Enterprise";
      default:
        return planId;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "canceled":
        return "bg-red-100 text-red-800";
      case "past_due":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configurações de Assinatura</h1>
        <p className="text-muted-foreground">Gerencie seu plano e assinatura</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Plano Atual
          </CardTitle>
          <CardDescription>Detalhes da sua assinatura atual</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Plano:</span>
            <Badge variant="secondary">
              {getPlanName(subscription.plan_id)}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Status:</span>
            <Badge className={getStatusColor(subscription.status)}>
              {subscription.status}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Renova em:
            </span>
            <span className="text-sm">
              {new Date(subscription.current_period_end).toLocaleDateString(
                "pt-BR"
              )}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Gerenciar Assinatura
          </CardTitle>
          <CardDescription>
            Acesse o portal do Stripe para gerenciar sua assinatura
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <a href="/api/stripe/portal">Acessar Portal do Stripe</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
