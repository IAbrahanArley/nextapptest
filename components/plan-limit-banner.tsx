"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Crown } from "lucide-react";
import Link from "next/link";
import { getSubscription, getUsage } from "@/lib/subscription";
import { getPlanById } from "@/lib/plans";

export function PlanLimitBanner() {
  const subscription = getSubscription("1"); // ID do lojista logado
  const usage = getUsage("1");

  if (!subscription) return null;

  const plan = getPlanById(subscription.planId);
  if (!plan) return null;

  // Verificar se está próximo dos limites
  const clientesPercentage =
    plan.limits.clientes === -1
      ? 0
      : (usage.clientes / plan.limits.clientes) * 100;
  const mensagensPercentage =
    (usage.mensagensWhatsApp / plan.limits.mensagensWhatsApp) * 100;
  const premiosPercentage =
    plan.limits.premios === -1
      ? 0
      : (usage.premios / plan.limits.premios) * 100;

  const isNearLimit =
    clientesPercentage > 80 ||
    mensagensPercentage > 80 ||
    premiosPercentage > 80;
  const isOverLimit =
    clientesPercentage >= 100 ||
    mensagensPercentage >= 100 ||
    premiosPercentage >= 100;

  if (!isNearLimit) return null;

  return (
    <Alert
      className={`mx-6 mt-4 ${
        isOverLimit
          ? "border-destructive bg-destructive/10"
          : "border-warning bg-warning/10"
      }`}
    >
      <AlertTriangle
        className={`h-4 w-4 ${
          isOverLimit ? "text-destructive" : "text-warning"
        }`}
      />
      <AlertDescription>
        <strong className={isOverLimit ? "text-destructive" : "text-warning"}>
          {isOverLimit ? "Limite excedido!" : "Aproximando do limite"}
        </strong>
        <span
          className={`ml-2 ${
            isOverLimit ? "text-destructive/80" : "text-warning/80"
          }`}
        >
          {clientesPercentage >= 80 &&
            `Clientes: ${usage.clientes}/${
              plan.limits.clientes === -1 ? "∞" : plan.limits.clientes
            }`}
          {mensagensPercentage >= 80 &&
            ` • WhatsApp: ${usage.mensagensWhatsApp}/${plan.limits.mensagensWhatsApp}`}
          {premiosPercentage >= 80 &&
            ` • Prêmios: ${usage.premios}/${
              plan.limits.premios === -1 ? "∞" : plan.limits.premios
            }`}
        </span>
      </AlertDescription>
      <Link href="/admin/assinatura">
        <Button size="sm" variant={isOverLimit ? "destructive" : "default"}>
          <Crown className="h-4 w-4 mr-2" />
          Fazer Upgrade
        </Button>
      </Link>
    </Alert>
  );
}
