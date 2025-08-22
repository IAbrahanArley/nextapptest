import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

const PRICE_IDS = {
  basico: process.env.STRIPE_BASICO_PRICE_ID!,
  premium: process.env.STRIPE_PREMIUM_PRICE_ID!,
  enterprise: process.env.STRIPE_ENTERPRISE_PRICE_ID!,
};

export async function POST(req: Request) {
  const body = await req.json();
  const { email, plan, storeName, userId } = body;

  console.log("Dados recebidos no checkout:", {
    email,
    plan,
    storeName,
    userId,
  });
  console.log("PRICE_IDS disponíveis:", PRICE_IDS);

  // Verificar se todos os price IDs estão configurados
  const missingPriceIds = Object.entries(PRICE_IDS)
    .filter(([key, value]) => !value)
    .map(([key]) => key);

  if (missingPriceIds.length > 0) {
    console.error("Price IDs não configurados:", missingPriceIds);
    return NextResponse.json(
      {
        error:
          "Configuração do Stripe incompleta. Entre em contato com o suporte.",
        details: `Price IDs não configurados: ${missingPriceIds.join(", ")}`,
      },
      { status: 500 }
    );
  }

  const priceId = PRICE_IDS[plan as keyof typeof PRICE_IDS];

  console.log("Plano solicitado:", plan);
  console.log("Price ID encontrado:", priceId);

  if (!priceId) {
    console.error("Plano inválido:", plan);
    return NextResponse.json({ error: "Plano inválido" }, { status: 400 });
  }

  // Verificar se o price ID existe no Stripe
  try {
    const price = await stripe.prices.retrieve(priceId);
    console.log("Price encontrado no Stripe:", price.id);
  } catch (err: any) {
    console.error("Erro ao verificar price ID:", err);
    return NextResponse.json(
      {
        error: "Price ID inválido ou não encontrado no Stripe",
        details: err.message,
      },
      { status: 400 }
    );
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      billing_address_collection: "auto",
      customer_email: email,
      metadata: {
        storeName,
        userId,
        plan,
      },
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXTAUTH_URL}/pagamento-sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${
        process.env.NEXTAUTH_URL
      }/pagamento-sucesso?error=${encodeURIComponent(
        "Pagamento cancelado pelo usuário"
      )}`,
    });

    console.log("Sessão de checkout criada:", session.url);
    return NextResponse.json({ sessionUrl: session.url });
  } catch (err: any) {
    console.error("Erro ao criar sessão de checkout:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
