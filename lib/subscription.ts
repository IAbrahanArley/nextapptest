export interface Subscription {
  id: string;
  lojistaId: string;
  planId: string;
  status: "active" | "canceled" | "past_due" | "trialing";
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  trialEnd?: Date;
}

export interface Usage {
  lojistaId: string;
  clientes: number;
  mensagensWhatsApp: number;
  premios: number;
  transacoesMes: number;
  estabelecimentos: number;
}

// Simulação de dados de assinatura
export const mockSubscription: Subscription = {
  id: "sub_1",
  lojistaId: "1",
  planId: "premium",
  status: "active",
  currentPeriodStart: new Date("2024-01-01"),
  currentPeriodEnd: new Date("2024-02-01"),
  cancelAtPeriodEnd: false,
  trialEnd: undefined,
};

export const mockUsage: Usage = {
  lojistaId: "1",
  clientes: 45,
  mensagensWhatsApp: 23,
  premios: 8,
  transacoesMes: 156,
  estabelecimentos: 1,
};

export function getSubscription(lojistaId: string): Subscription | null {
  // Simular busca no banco
  return mockSubscription;
}

export function getUsage(lojistaId: string): Usage {
  // Simular busca no banco
  return mockUsage;
}
