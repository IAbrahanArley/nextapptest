import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json(
      { error: "session_id é obrigatório" },
      { status: 400 }
    );
  }

  try {
    // Buscar a sessão do Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return NextResponse.json(
        { error: "Sessão não encontrada" },
        { status: 404 }
      );
    }

    // Buscar a subscription se existir
    let subscription = null;
    if (session.subscription) {
      subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      );
    }

    // Buscar o price para obter informações do plano
    let price = null;
    if (session.line_items?.data[0]?.price?.id) {
      price = await stripe.prices.retrieve(session.line_items.data[0].price.id);
    }

    // Mapear o plano baseado no price ID
    let planName = "Desconhecido";
    let planAmount = "R$ 0,00";

    if (price) {
      const priceId = price.id;
      if (priceId === process.env.STRIPE_BASICO_PRICE_ID) {
        planName = "Básico";
        planAmount = "R$ 29,90";
      } else if (priceId === process.env.STRIPE_PREMIUM_PRICE_ID) {
        planName = "Premium";
        planAmount = "R$ 79,90";
      } else if (priceId === process.env.STRIPE_ENTERPRISE_PRICE_ID) {
        planName = "Enterprise";
        planAmount = "Customizado";
      }
    }

    return NextResponse.json({
      plan: planName,
      amount: planAmount,
      status: subscription?.status || "pending",
      customerEmail: session.customer_email,
      storeName: session.metadata?.storeName,
      createdAt: session.created,
      subscriptionId: subscription?.id,
    });
  } catch (error: any) {
    console.error("Erro ao buscar sessão:", error);
    return NextResponse.json(
      { error: "Erro ao buscar dados da sessão" },
      { status: 500 }
    );
  }
}
