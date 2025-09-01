import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { subscriptions, stores } from "@/lib/db/schema";
import { eq, and, sql } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

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

    // Buscar todas as assinaturas da loja para debug
    const allSubscriptions = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.store_id, store.id));

    console.log("Todas as assinaturas encontradas:", allSubscriptions);

    // Buscar assinatura ativa ou em trial
    const subscription = await db
      .select()
      .from(subscriptions)
      .where(
        and(
          eq(subscriptions.store_id, store.id),
          sql`${subscriptions.status} IN ('active', 'trialing', 'past_due')`
        )
      )
      .limit(1);

    console.log("Assinatura encontrada:", subscription);
    console.log("Status da assinatura:", subscription[0]?.status);

    if (!subscription.length) {
      // Retornar informações de debug
      return NextResponse.json(
        {
          error: "Nenhuma assinatura ativa encontrada",
          debug: {
            storeId: store.id,
            userId: session.user.id,
            allSubscriptions: allSubscriptions.map((sub) => ({
              id: sub.id,
              status: sub.status,
              planId: sub.plan_id,
              stripeSubscriptionId: sub.stripe_subscription_id,
            })),
          },
        },
        { status: 404 }
      );
    }

    const sub = subscription[0];

    // Buscar dados completos da assinatura no Stripe
    const stripeSubscription = await stripe.subscriptions.retrieve(
      sub.stripe_subscription_id
    );

    // Buscar dados do cliente no Stripe
    const customer = await stripe.customers.retrieve(sub.stripe_customer_id);

    // Buscar método de pagamento padrão
    let defaultPaymentMethod = null;
    if (customer.default_source) {
      defaultPaymentMethod = await stripe.paymentMethods.retrieve(
        customer.default_source as string
      );
    }

    // Buscar histórico de faturas
    const invoices = await stripe.invoices.list({
      customer: sub.stripe_customer_id,
      limit: 10,
    });

    const paymentHistory = invoices.data.map((invoice) => ({
      id: invoice.id,
      date: new Date(invoice.created * 1000),
      amount: invoice.amount_paid / 100, // Stripe usa centavos
      status: invoice.status,
      description: invoice.description || `Fatura ${invoice.number}`,
      invoiceUrl: invoice.hosted_invoice_url,
      pdfUrl: invoice.invoice_pdf,
    }));

    return NextResponse.json({
      subscription: {
        id: sub.id,
        planId: sub.plan_id,
        status: sub.status,
        currentPeriodStart: sub.current_period_start,
        currentPeriodEnd: sub.current_period_end,
        stripeSubscriptionId: sub.stripe_subscription_id,
        stripeCustomerId: sub.stripe_customer_id,
      },
      stripeData: {
        status: stripeSubscription.status,
        currentPeriodStart: new Date(
          stripeSubscription.current_period_start * 1000
        ),
        currentPeriodEnd: new Date(
          stripeSubscription.current_period_end * 1000
        ),
        cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
        trialEnd: stripeSubscription.trial_end
          ? new Date(stripeSubscription.trial_end * 1000)
          : null,
        isTrialing: stripeSubscription.status === "trialing",
        trialDaysRemaining: stripeSubscription.trial_end
          ? Math.max(
              0,
              Math.ceil(
                (stripeSubscription.trial_end * 1000 - Date.now()) /
                  (1000 * 60 * 60 * 24)
              )
            )
          : null,
      },
      customer: {
        email: customer.email,
        name: customer.name,
        defaultPaymentMethod: defaultPaymentMethod
          ? {
              type: defaultPaymentMethod.type,
              card: defaultPaymentMethod.card
                ? {
                    brand: defaultPaymentMethod.card.brand,
                    last4: defaultPaymentMethod.card.last4,
                    expMonth: defaultPaymentMethod.card.exp_month,
                    expYear: defaultPaymentMethod.card.exp_year,
                  }
                : null,
            }
          : null,
      },
      paymentHistory,
    });
  } catch (error) {
    console.error("Erro ao buscar assinatura:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
