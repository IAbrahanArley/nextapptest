import { useQuery } from "@tanstack/react-query";

interface UsageData {
  usage: {
    clientes: number;
    premios: number;
    transacoesMes: number;
    mensagensWhatsApp: number;
    estabelecimentos: number;
  };
  period: {
    start: Date;
    end: Date;
  };
}

async function fetchUsage(): Promise<UsageData> {
  const response = await fetch("/api/stripe/subscription/usage");
  if (!response.ok) {
    throw new Error("Falha ao buscar dados de uso");
  }
  return response.json();
}

export function useSubscriptionUsage() {
  return useQuery({
    queryKey: ["subscription-usage"],
    queryFn: fetchUsage,
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
  });
}



