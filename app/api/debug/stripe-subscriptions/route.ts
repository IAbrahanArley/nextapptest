import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    console.log("Debug Stripe - User ID:", session.user.id);

    // Buscar todos os clientes no Stripe que podem estar associados ao usuário
    const customers = await stripe.customers.list({
      email: session.user.email,
      limit: 10,
    });

    console.log("Debug Stripe - Clientes encontrados:", customers.data.length);

    const stripeData = [];

    for (const customer of customers.data) {
      console.log(
        `Debug Stripe - Verificando cliente: ${customer.id} (${customer.email})`
      );

      // Buscar assinaturas deste cliente
      const subscriptions = await stripe.subscriptions.list({
        customer: customer.id,
        limit: 10,
      });

      console.log(
        `Debug Stripe - Assinaturas do cliente ${customer.id}:`,
        subscriptions.data.length
      );

      for (const subscription of subscriptions.data) {
        console.log(
          `Debug Stripe - Assinatura: ${subscription.id}, Status: ${subscription.status}`
        );

        stripeData.push({
          customerId: customer.id,
          customerEmail: customer.email,
          customerName: customer.name,
          subscriptionId: subscription.id,
          subscriptionStatus: subscription.status,
          planId: subscription.items.data[0]?.price?.id,
          currentPeriodStart: subscription.current_period_start
            ? new Date(subscription.current_period_start * 1000)
            : null,
          currentPeriodEnd: subscription.current_period_end
            ? new Date(subscription.current_period_end * 1000)
            : null,
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          trialEnd: subscription.trial_end
            ? new Date(subscription.trial_end * 1000)
            : null,
          metadata: subscription.metadata,
        });
      }
    }

    return NextResponse.json({
      debug: {
        user: {
          id: session.user.id,
          email: session.user.email,
          name: session.user.name,
        },
        stripeCustomers: customers.data.map((c) => ({
          id: c.id,
          email: c.email,
          name: c.name,
        })),
        stripeSubscriptions: stripeData,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar debug do Stripe:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
