import { useQuery } from "@tanstack/react-query";

interface Payment {
  id: string;
  date: Date;
  amount: number;
  status: "paid" | "pending" | "failed";
  description: string;
  invoiceUrl?: string;
  pdfUrl?: string;
}

interface SubscriptionData {
  subscription: {
    id: string;
    planId: string;
    status: string;
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
    stripeSubscriptionId: string;
    stripeCustomerId: string;
  };
  stripeData: {
    status: string;
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
    cancelAtPeriodEnd: boolean;
    trialEnd: Date | null;
  };
  customer: {
    email: string;
    name: string;
    defaultPaymentMethod: {
      type: string;
      card: {
        brand: string;
        last4: string;
        expMonth: number;
        expYear: number;
      } | null;
    } | null;
  };
  paymentHistory: Payment[];
}

async function fetchSubscription(): Promise<SubscriptionData> {
  const response = await fetch("/api/stripe/subscription");
  if (!response.ok) {
    throw new Error("Falha ao buscar dados da assinatura");
  }
  return response.json();
}

export function useSubscription() {
  return useQuery({
    queryKey: ["subscription"],
    queryFn: fetchSubscription,
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
  });
}



