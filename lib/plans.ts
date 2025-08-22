export interface PlanLimits {
  clientes: number;
  mensagensWhatsApp: number;
  premios: number;
  transacoesMes: number;
  estabelecimentos: number;
  suporte: string;
  relatoriosAvancados: boolean;
  integracaoAPI: boolean;
  whatsappAutomatico: boolean;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  interval: "monthly" | "yearly";
  description: string;
  features: string[];
  limits: PlanLimits;
  popular?: boolean;
  custom?: boolean;
}

export const plans: Plan[] = [
  {
    id: "basico",
    name: "Básico",
    price: 29.9,
    interval: "monthly",
    description: "Perfeito para começar",
    features: [
      "Até 100 clientes",
      "Até 5 promoções ativas",
      "Programa de pontos básico",
      "Analytics essenciais",
      "Suporte por email",
    ],
    limits: {
      clientes: 100,
      mensagensWhatsApp: 50,
      premios: 5,
      transacoesMes: 500,
      estabelecimentos: 1,
      suporte: "email",
      relatoriosAvancados: false,
      integracaoAPI: false,
      whatsappAutomatico: false,
    },
  },
  {
    id: "premium",
    name: "Premium",
    price: 79.9,
    interval: "monthly",
    description: "Para empresas em crescimento",
    features: [
      "Até 500 clientes",
      "Até 10 promoções ativas",
      "Até 2 Estabelecimentos",
      "Programa de pontos básico",
      "Analytics essenciais",
      "Suporte prioritário",
    ],
    limits: {
      clientes: 500,
      mensagensWhatsApp: 200,
      premios: 10,
      transacoesMes: 2000,
      estabelecimentos: 2,
      suporte: "chat",
      relatoriosAvancados: true,
      integracaoAPI: false,
      whatsappAutomatico: true,
    },
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 0,
    interval: "monthly",
    description: "Para grandes empresas",
    features: [
      "Clientes ilimitados",
      "IA personalizada",
      "Gerente dedicado",
      "SLA garantido",
      "Implementação assistida",
      "Treinamento da equipe",
      "Relatórios customizados",
    ],
    limits: {
      clientes: -1,
      mensagensWhatsApp: -1,
      premios: -1,
      transacoesMes: -1,
      estabelecimentos: -1,
      suporte: "dedicado",
      relatoriosAvancados: true,
      integracaoAPI: true,
      whatsappAutomatico: true,
    },
    custom: true,
  },
];

export function getPlanById(planId: string): Plan | undefined {
  return plans.find((plan) => plan.id === planId);
}

export function checkLimit(
  currentPlan: Plan,
  limitType: keyof PlanLimits,
  currentUsage: number
): boolean {
  const limit = currentPlan.limits[limitType];
  if (typeof limit === "number") {
    // Se o limite for -1, significa ilimitado
    if (limit === -1) {
      return true;
    }
    // Caso contrário, verifica se o uso atual está abaixo do limite
    return currentUsage < limit;
  }
  return true;
}
