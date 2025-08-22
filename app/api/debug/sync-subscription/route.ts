import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { subscriptions, stores } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    console.log("Sync - User ID:", session.user.id);

    // Buscar a loja do usuário
    const store = await db.query.stores.findFirst({
      where: eq(stores.owner_id, session.user.id),
    });

    if (!store) {
      return NextResponse.json(
        { error: "Loja não encontrada" },
        { status: 404 }
      );
    }

    // Buscar cliente no Stripe
    const customers = await stripe.customers.list({
      email: session.user.email,
      limit: 1,
    });

    if (!customers.data.length) {
      return NextResponse.json(
        { error: "Cliente não encontrado no Stripe" },
        { status: 404 }
      );
    }

    const customer = customers.data[0];

    // Buscar assinatura ativa no Stripe
    const stripeSubscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: "active",
      limit: 1,
    });

    if (!stripeSubscriptions.data.length) {
      return NextResponse.json(
        { error: "Nenhuma assinatura ativa encontrada no Stripe" },
        { status: 404 }
      );
    }

    const stripeSubscription = stripeSubscriptions.data[0];

    // Determinar o plano baseado no price ID
    let planId = "premium"; // Default
    if (stripeSubscription.items.data[0]?.price?.id) {
      const priceId = stripeSubscription.items.data[0].price.id;

      console.log("Sync - Price ID encontrado:", priceId);
      console.log("Sync - Variáveis de ambiente:", {
        STRIPE_BASICO_PRICE_ID: process.env.STRIPE_BASICO_PRICE_ID,
        STRIPE_PREMIUM_PRICE_ID: process.env.STRIPE_PREMIUM_PRICE_ID,
        STRIPE_ENTERPRISE_PRICE_ID: process.env.STRIPE_ENTERPRISE_PRICE_ID,
      });

      // Mapear price IDs para planos (ajuste conforme seus IDs reais)
      if (priceId === process.env.STRIPE_BASICO_PRICE_ID) {
        planId = "basico";
      } else if (priceId === process.env.STRIPE_PREMIUM_PRICE_ID) {
        planId = "premium";
      } else if (priceId === process.env.STRIPE_ENTERPRISE_PRICE_ID) {
        planId = "enterprise";
      }

      console.log("Sync - Plano determinado:", planId);
    } else {
      console.log("Sync - Nenhum price ID encontrado na assinatura");
    }

    console.log("Sync - Criando assinatura no banco:", {
      storeId: store.id,
      customerId: customer.id,
      subscriptionId: stripeSubscription.id,
      planId,
      status: stripeSubscription.status,
    });

    // Criar assinatura no banco
    const newSubscription = await db
      .insert(subscriptions)
      .values({
        user_id: session.user.id,
        store_id: store.id,
        stripe_subscription_id: stripeSubscription.id,
        stripe_customer_id: customer.id,
        status: stripeSubscription.status,
        plan_id: planId,
        current_period_start: stripeSubscription.current_period_start
          ? new Date(stripeSubscription.current_period_start * 1000)
          : new Date(),
        current_period_end: stripeSubscription.current_period_end
          ? new Date(stripeSubscription.current_period_end * 1000)
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 dias se não houver data
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning();

    console.log("Sync - Assinatura criada:", newSubscription[0]);

    return NextResponse.json({
      success: true,
      message: "Assinatura sincronizada com sucesso",
      subscription: {
        id: newSubscription[0].id,
        planId: newSubscription[0].plan_id,
        status: newSubscription[0].status,
        stripeSubscriptionId: newSubscription[0].stripe_subscription_id,
      },
    });
  } catch (error) {
    console.error("Erro ao sincronizar assinatura:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
