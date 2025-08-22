"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Crown,
  Calendar,
  CreditCard,
  Users,
  MessageSquare,
  Gift,
  TrendingUp,
  Check,
  Star,
  Receipt,
  AlertTriangle,
} from "lucide-react";
import { getPlanById, plans } from "@/lib/plans";
import { useSubscription } from "@/hooks/queries/use-subscription";
import { useSubscriptionUsage } from "@/hooks/queries/use-subscription-usage";
import { useCancelSubscription } from "@/hooks/mutations/use-cancel-subscription";
import { useChangePlan } from "@/hooks/mutations/use-change-plan";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function AssinaturaPage() {
  const { data: subscriptionData, isLoading: isLoadingSubscription } =
    useSubscription();
  const { data: usageData, isLoading: isLoadingUsage } = useSubscriptionUsage();
  const cancelSubscription = useCancelSubscription();
  const changePlan = useChangePlan();
  const { toast } = useToast();

  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelAtPeriodEnd, setCancelAtPeriodEnd] = useState(true);

  if (isLoadingSubscription || isLoadingUsage) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!subscriptionData) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhuma assinatura encontrada
          </h3>
          <p className="text-gray-600 mb-4">
            Parece que você ainda não tem uma assinatura ativa.
          </p>
          <div className="flex gap-4 justify-center">
            <Button>Ver Planos Disponíveis</Button>
            <Button
              variant="outline"
              onClick={() => window.open("/api/debug/subscription", "_blank")}
            >
              Debug Banco
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                window.open("/api/debug/stripe-subscriptions", "_blank")
              }
            >
              Debug Stripe
            </Button>
            <Button
              variant="default"
              onClick={async () => {
                try {
                  const response = await fetch("/api/debug/sync-subscription", {
                    method: "POST",
                  });
                  const result = await response.json();
                  if (result.success) {
                    window.location.reload();
                  } else {
                    alert("Erro ao sincronizar: " + result.error);
                  }
                } catch (error) {
                  alert("Erro ao sincronizar assinatura");
                }
              }}
            >
              🔄 Sincronizar Assinatura
            </Button>
          </div>
        </div>

        {/* Informações de Debug */}
        <Card>
          <CardHeader>
            <CardTitle>Informações de Debug</CardTitle>
            <CardDescription>
              Use os botões acima para investigar o problema com sua assinatura
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h4 className="font-medium mb-2">Debug Banco</h4>
                <p className="text-sm text-gray-600">
                  Verifica se há assinaturas salvas no banco de dados local.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Debug Stripe</h4>
                <p className="text-sm text-gray-600">
                  Verifica se há assinaturas ativas no Stripe.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">🔄 Sincronizar</h4>
                <p className="text-sm text-gray-600">
                  Sincroniza manualmente a assinatura do Stripe com o banco de
                  dados.
                </p>
              </div>
            </div>
            <div className="bg-muted border border-border rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-primary rounded-full"></div>
                <p className="text-sm text-foreground font-medium">
                  Plano ativo
                </p>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Seu plano está funcionando perfeitamente
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentPlan = getPlanById(subscriptionData.subscription.planId);
  if (!currentPlan) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Plano não encontrado
        </h3>
        <p className="text-gray-600">
          O plano da sua assinatura não foi encontrado.
        </p>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("pt-BR");
  };

  const formatCardNumber = (last4: string) => {
    return `•••• •••• •••• ${last4}`;
  };

  const getUsagePercentage = (current: number, limit: number) => {
    if (limit === -1) return 0;
    return Math.min((current / limit) * 100, 100);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge variant="default" className="bg-green-600">
            Pago
          </Badge>
        );
      case "pending":
        return <Badge variant="secondary">Pendente</Badge>;
      case "failed":
        return <Badge variant="destructive">Falhou</Badge>;
      default:
        return <Badge variant="secondary">Desconhecido</Badge>;
    }
  };

  const handleCancelSubscription = () => {
    cancelSubscription.mutate({ cancelAtPeriodEnd });
    setShowCancelDialog(false);
  };

  const handleChangePlan = (newPlanId: string) => {
    changePlan.mutate({ newPlanId });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Minha Assinatura</h1>
        <p className="text-gray-600">
          Gerencie seu plano e acompanhe o uso dos recursos
        </p>
      </div>

      {/* Plano Atual */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Crown className="h-8 w-8 text-primary" />
              <div>
                <CardTitle className="text-2xl">
                  Plano {currentPlan.name}
                </CardTitle>
                <CardDescription>
                  R$ {currentPlan.price.toFixed(2).replace(".", ",")}/mês
                </CardDescription>
              </div>
            </div>
            <Badge
              variant={
                subscriptionData.stripeData.status === "active"
                  ? "default"
                  : "secondary"
              }
            >
              {subscriptionData.stripeData.status === "active"
                ? "Ativo"
                : "Inativo"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Próxima cobrança</p>
                <p className="font-semibold">
                  {formatDate(subscriptionData.stripeData.currentPeriodEnd)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Método de pagamento</p>
                <p className="font-semibold">
                  {subscriptionData.customer.defaultPaymentMethod?.card
                    ? formatCardNumber(
                        subscriptionData.customer.defaultPaymentMethod.card
                          .last4
                      )
                    : "Não configurado"}
                </p>
              </div>
            </div>
          </div>

          {subscriptionData.stripeData.cancelAtPeriodEnd && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <p className="text-sm text-yellow-800">
                  Sua assinatura será cancelada em{" "}
                  {formatDate(subscriptionData.stripeData.currentPeriodEnd)}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Uso dos Recursos */}
      {usageData && (
        <Card>
          <CardHeader>
            <CardTitle>Uso dos Recursos</CardTitle>
            <CardDescription>
              Acompanhe o uso dos recursos do seu plano atual
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Clientes</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {usageData.usage.clientes}/
                    {currentPlan.limits.clientes === -1
                      ? "∞"
                      : currentPlan.limits.clientes}
                  </span>
                </div>
                <Progress
                  value={getUsagePercentage(
                    usageData.usage.clientes,
                    currentPlan.limits.clientes
                  )}
                  className="h-2"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">WhatsApp</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {usageData.usage.mensagensWhatsApp}/
                    {currentPlan.limits.mensagensWhatsApp}
                  </span>
                </div>
                <Progress
                  value={getUsagePercentage(
                    usageData.usage.mensagensWhatsApp,
                    currentPlan.limits.mensagensWhatsApp
                  )}
                  className="h-2"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Gift className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium">Prêmios</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {usageData.usage.premios}/
                    {currentPlan.limits.premios === -1
                      ? "∞"
                      : currentPlan.limits.premios}
                  </span>
                </div>
                <Progress
                  value={getUsagePercentage(
                    usageData.usage.premios,
                    currentPlan.limits.premios
                  )}
                  className="h-2"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-medium">Transações</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {usageData.usage.transacoesMes}/
                    {currentPlan.limits.transacoesMes === -1
                      ? "∞"
                      : currentPlan.limits.transacoesMes}
                  </span>
                </div>
                <Progress
                  value={getUsagePercentage(
                    usageData.usage.transacoesMes,
                    currentPlan.limits.transacoesMes
                  )}
                  className="h-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Planos Disponíveis */}
      <Card>
        <CardHeader>
          <CardTitle>Planos Disponíveis</CardTitle>
          <CardDescription>
            Escolha o plano ideal para o tamanho do seu negócio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => {
              const isCurrentPlan = plan.id === currentPlan.id;
              const isUpgrade = plan.price > currentPlan.price;
              const isDowngrade = plan.price < currentPlan.price;

              return (
                <div
                  key={index}
                  className={`relative group ${
                    plan.popular ? "scale-105" : ""
                  } ${isCurrentPlan ? "ring-2 ring-blue-500" : ""}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-secondary text-secondary-foreground px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-current" />
                        <span>Mais Popular</span>
                      </div>
                    </div>
                  )}

                  {isCurrentPlan && (
                    <div className="absolute -top-4 right-4">
                      <Badge variant="default" className="bg-blue-600">
                        Plano Atual
                      </Badge>
                    </div>
                  )}

                  <div
                    className={`bg-gradient-subtle rounded-2xl p-8 h-full transition-all duration-300 hover:shadow-glow hover:-translate-y-2 ${
                      plan.popular
                        ? "ring-2 ring-secondary shadow-glow"
                        : isCurrentPlan
                        ? "ring-2 ring-blue-500 shadow-glow"
                        : "shadow-card"
                    }`}
                  >
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                      <p className="text-muted-foreground mb-4">
                        {plan.description}
                      </p>
                      <div className="mb-4">
                        <span className="text-4xl font-bold">
                          {plan.custom
                            ? "Customizado"
                            : `R$ ${plan.price.toFixed(2).replace(".", ",")}`}
                        </span>
                        <span className="text-muted-foreground">
                          {plan.custom ? "" : "/mês"}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <div
                          key={featureIndex}
                          className="flex items-center space-x-3"
                        >
                          <Check className="w-5 h-5 text-secondary flex-shrink-0" />
                          <span className="text-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {isCurrentPlan ? (
                      <Button
                        variant="outline"
                        size="lg"
                        className="w-full"
                        disabled
                      >
                        Plano Atual
                      </Button>
                    ) : (
                      <Button
                        variant={isUpgrade ? "default" : "outline"}
                        size="lg"
                        className="w-full"
                        onClick={() => handleChangePlan(plan.id)}
                        disabled={changePlan.isPending}
                      >
                        {changePlan.isPending
                          ? "Alterando..."
                          : isUpgrade
                          ? "Fazer Upgrade"
                          : "Fazer Downgrade"}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Últimos Pagamentos */}
      <Card>
        <CardHeader>
          <CardTitle>Últimos Pagamentos</CardTitle>
          <CardDescription>
            Histórico dos seus últimos pagamentos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subscriptionData.paymentHistory.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <Receipt className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">{payment.description}</p>
                    <p className="text-sm text-gray-600">
                      {formatDate(payment.date)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold">
                    R$ {payment.amount.toFixed(2).replace(".", ",")}
                  </span>
                  {getStatusBadge(payment.status)}
                  {payment.invoiceUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={payment.invoiceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Receipt className="h-4 w-4 mr-2" />
                        Fatura
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Ações */}
      <Card>
        <CardHeader>
          <CardTitle>Gerenciar Assinatura</CardTitle>
          <CardDescription>Ações relacionadas à sua assinatura</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Button variant="outline">
              <CreditCard className="h-4 w-4 mr-2" />
              Alterar Método de Pagamento
            </Button>
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Histórico de Faturas
            </Button>
            <Button
              variant="outline"
              className="text-destructive hover:text-destructive/80 bg-transparent"
              onClick={() => setShowCancelDialog(true)}
              disabled={cancelSubscription.isPending}
            >
              {cancelSubscription.isPending
                ? "Cancelando..."
                : "Cancelar Assinatura"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Dialog de Confirmação de Cancelamento */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancelar Assinatura</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja cancelar sua assinatura?
              {cancelAtPeriodEnd
                ? " Ela será cancelada no final do período atual."
                : " Ela será cancelada imediatamente."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelSubscription}
              className="bg-destructive hover:bg-destructive/80"
            >
              Confirmar Cancelamento
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
