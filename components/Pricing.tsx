"use client";

import { Button } from "@/components/ui/button";
import { Check, Star, Calendar, Zap, Gift } from "lucide-react";
import { useState } from "react";

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );

  const plans = [
    {
      id: "basico",
      name: "Básico",
      monthlyPrice: 29.9,
      yearlyPrice: 29.9 * 12 * 0.85, // 15% desconto
      description: "Perfeito para começar",
      features: [
        "Até 100 clientes",
        "Até 5 promoções ativas",
        "Programa de pontos básico",
        "Analytics essenciais",
        "Suporte por email",
      ],
      cta: "Teste Grátis",
      ctaLink: "/cadastro?type=merchant",
      popular: false,
    },
    {
      id: "premium",
      name: "Premium",
      monthlyPrice: 79.9,
      yearlyPrice: 79.9 * 12 * 0.85,
      description: "Para empresas em crescimento",
      features: [
        "Até 500 clientes",
        "Até 10 promoções ativas",
        "Até 2 Estabelecimentos",
        "Pontuação por nota fiscal",
        "Programa de pontos avançado",
        "Analytics completos",
        "Suporte prioritário",
        "Relatórios personalizados",
      ],
      cta: "Teste Grátis",
      ctaLink: "/cadastro?type=merchant",
      popular: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      monthlyPrice: 149.9,
      yearlyPrice: 149.9 * 12 * 0.85, // 15% desconto
      description: "Para grandes empresas",
      features: [
        "Clientes ilimitados",
        "Promoções ilimitadas",
        "Estabelecimentos ilimitados",
        "IA personalizada",
        "Gerente dedicado",
        "SLA garantido",
        "Implementação assistida",
        "Treinamento da equipe",
        "Relatórios customizados",
      ],
      cta: "Falar com Vendas",
      ctaLink: "wa.me/5583989028095",
      popular: false,
    },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const getCurrentPrice = (plan: any) => {
    return billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
  };

  const getSavings = (plan: any) => {
    if (billingCycle === "yearly") {
      const yearlyWithoutDiscount = plan.monthlyPrice * 12;
      const savings = yearlyWithoutDiscount - plan.yearlyPrice;
      return savings;
    }
    return 0;
  };

  return (
    <section id="precos" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Planos que
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              {" "}
              Crescem{" "}
            </span>
            com Você
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Escolha o plano ideal para o tamanho do seu negócio. Todos incluem
            teste grátis de 14 dias
          </p>

          <div className="flex items-center justify-center space-x-4 mb-8">
            <span
              className={`text-sm font-medium ${
                billingCycle === "monthly"
                  ? "text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              Mensal
            </span>
            <button
              onClick={() =>
                setBillingCycle(
                  billingCycle === "monthly" ? "yearly" : "monthly"
                )
              }
              className={`relative w-16 h-8 rounded-full transition-colors duration-200 ${
                billingCycle === "yearly" ? "bg-gradient-primary" : "bg-muted"
              }`}
            >
              <div
                className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform duration-200 ${
                  billingCycle === "yearly" ? "translate-x-8" : "translate-x-1"
                }`}
              />
            </button>
            <div className="flex items-center space-x-2">
              <span
                className={`text-sm font-medium ${
                  billingCycle === "yearly"
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                Anual
              </span>
              {billingCycle === "yearly" && (
                <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full text-xs font-semibold">
                  -15%
                </div>
              )}
            </div>
          </div>

          {billingCycle === "yearly" && (
            <div className="flex items-center justify-center space-x-4 mb-4">
              <Gift className="w-8 h-8 text-green-500" />
              <h3 className="text-xl font-bold text-foreground">
                Economize com o Plano Anual!
              </h3>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative group ${plan.popular ? "scale-105" : ""}`}
            >
              <div
                className={`bg-gradient-subtle rounded-2xl p-8 h-full transition-all duration-300 hover:shadow-glow hover:-translate-y-2 ${
                  plan.popular
                    ? "ring-2 ring-secondary shadow-glow"
                    : "shadow-card"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-secondary text-secondary-foreground px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-current" />
                      <span>Mais Popular</span>
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground mb-4">
                    {plan.description}
                  </p>
                  <div className="mb-2">
                    <span className="text-4xl font-bold">
                      {formatPrice(getCurrentPrice(plan))}
                    </span>
                    <span className="text-muted-foreground">
                      {billingCycle === "monthly" ? "/mês" : "/ano"}
                    </span>
                  </div>

                  {billingCycle === "yearly" && (
                    <div className="text-sm text-muted-foreground mb-2">
                      <span className="line-through">
                        {formatPrice(plan.monthlyPrice * 12)}
                      </span>{" "}
                      por ano
                    </div>
                  )}

                  {billingCycle === "yearly" && (
                    <div className="text-green-600 dark:text-green-400 text-sm font-semibold">
                      Economize {formatPrice(getSavings(plan))} por ano!
                    </div>
                  )}
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

                <Button
                  variant={plan.popular ? "cta" : "outline"}
                  size="lg"
                  className="w-full"
                  onClick={() => {
                    window.location.href = plan.ctaLink;
                  }}
                >
                  {plan.cta}
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mt-6">
            💳 Planos que cabem no seu bolso • ⚡ Comece em 5 minutos • 🛡️ Teste
            grátis por 14 dias • 🎁 15% de desconto no plano anual
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
