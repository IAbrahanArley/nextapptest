import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { subscriptions, stores } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

const PRICE_IDS = {
  basico: process.env.STRIPE_BASICO_PRICE_ID!,
  premium: process.env.STRIPE_PREMIUM_PRICE_ID!,
  enterprise: process.env.STRIPE_ENTERPRISE_PRICE_ID!,
};

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const { newPlanId } = body;

    if (!newPlanId || !PRICE_IDS[newPlanId as keyof typeof PRICE_IDS]) {
      return NextResponse.json({ error: "Plano inválido" }, { status: 400 });
    }

    const store = await db.query.stores.findFirst({
      where: eq(stores.owner_id, session.user.id),
    });

    if (!store) {
      return NextResponse.json(
        { error: "Loja não encontrada" },
        { status: 404 }
      );
    }

    const subscription = await db
      .select()
      .from(subscriptions)
      .where(
        and(
          eq(subscriptions.store_id, store.id),
          eq(subscriptions.status, "active")
        )
      )
      .limit(1);

    if (!subscription.length) {
      return NextResponse.json(
        { error: "Nenhuma assinatura ativa encontrada" },
        { status: 404 }
      );
    }

    const sub = subscription[0];
    const newPriceId = PRICE_IDS[newPlanId as keyof typeof PRICE_IDS];

    const stripeSubscription = await stripe.subscriptions.retrieve(
      sub.stripe_subscription_id
    );

    const updatedSubscription = await stripe.subscriptions.update(
      sub.stripe_subscription_id,
      {
        items: [
          {
            id: stripeSubscription.items.data[0].id,
            price: newPriceId,
          },
        ],
        proration_behavior: "create_prorations",
      }
    );

    await db
      .update(subscriptions)
      .set({
        plan_id: newPlanId,
        updated_at: new Date(),
      })
      .where(eq(subscriptions.id, sub.id));

    return NextResponse.json({
      message: "Plano alterado com sucesso",
      newPlanId,
      subscriptionId: updatedSubscription.id,
      prorationDate: new Date(
        (updatedSubscription as any).current_period_start * 1000
      ),
    });
  } catch (error) {
    console.error("Erro ao alterar plano:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
