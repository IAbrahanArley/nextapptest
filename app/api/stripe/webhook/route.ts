import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/db";
import { subscriptions, stores } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      if (session.mode === "subscription" && session.subscription) {
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        );

        const userId = session.metadata?.userId;
        const storeName = session.metadata?.storeName;
        const planId = session.metadata?.plan;

        if (!userId) {
          console.error("userId não encontrado nos metadados");
          return NextResponse.json(
            { error: "userId não encontrado" },
            { status: 400 }
          );
        }

        let store = await db.query.stores.findFirst({
          where: eq(stores.owner_id, userId),
        });

        if (!store) {
          const storeSlug = storeName
            ? storeName
                .toLowerCase()
                .replace(/[^a-z0-9]/g, "-")
                .replace(/-+/g, "-")
            : `store-${userId.slice(0, 8)}`;

          const newStore = await db
            .insert(stores)
            .values({
              owner_id: userId,
              name: storeName || `Loja ${userId.slice(0, 8)}`,
              slug: storeSlug,
              description: `Loja criada automaticamente para o plano ${planId}`,
              currency: "BRL",
            })
            .returning();

          store = newStore[0];
        }

        await db
          .insert(subscriptions)
          .values({
            user_id: userId,
            store_id: store.id,
            stripe_subscription_id: subscription.id,
            stripe_customer_id: subscription.customer as string,
            status: subscription.status,
            plan_id: planId!,
            current_period_start: new Date(
              (subscription as any).current_period_start * 1000
            ),
            current_period_end: new Date(
              (subscription as any).current_period_end * 1000
            ),
            created_at: new Date(),
            updated_at: new Date(),
          })
          .onConflictDoUpdate({
            target: subscriptions.stripe_subscription_id,
            set: {
              status: subscription.status,
              current_period_start: new Date(
                (subscription as any).current_period_start * 1000
              ),
              current_period_end: new Date(
                (subscription as any).current_period_end * 1000
              ),
              updated_at: new Date(),
            },
          });

        console.log("✅ Assinatura criada com sucesso:", {
          subscriptionId: subscription.id,
          status: subscription.status,
          trialEnd: subscription.trial_end
            ? new Date(subscription.trial_end * 1000)
            : null,
          isTrialing: subscription.status === "trialing",
          storeId: store.id,
          planId: planId,
        });
      }
    }

    if (event.type === "customer.subscription.updated") {
      const subscription = event.data.object as Stripe.Subscription;

      await db
        .update(subscriptions)
        .set({
          status: subscription.status,
          current_period_start: new Date(
            (subscription as any).current_period_start * 1000
          ),
          current_period_end: new Date(
            (subscription as any).current_period_end * 1000
          ),
          updated_at: new Date(),
        })
        .where(eq(subscriptions.stripe_subscription_id, subscription.id));

      console.log("Assinatura atualizada:", subscription.id);
    }

    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription;

      await db
        .update(subscriptions)
        .set({
          status: "canceled",
          updated_at: new Date(),
        })
        .where(eq(subscriptions.stripe_subscription_id, subscription.id));
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
