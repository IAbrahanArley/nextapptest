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

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const { cancelAtPeriodEnd = true } = body;

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

    if (cancelAtPeriodEnd) {
      await stripe.subscriptions.update(sub.stripe_subscription_id, {
        cancel_at_period_end: true,
      });

      await db
        .update(subscriptions)
        .set({
          status: "canceled",
          updated_at: new Date(),
        })
        .where(eq(subscriptions.id, sub.id));

      return NextResponse.json({
        message: "Assinatura será cancelada no final do período atual",
        cancelAtPeriodEnd: true,
      });
    } else {
      await stripe.subscriptions.cancel(sub.stripe_subscription_id);

      await db
        .update(subscriptions)
        .set({
          status: "canceled",
          updated_at: new Date(),
        })
        .where(eq(subscriptions.id, sub.id));

      return NextResponse.json({
        message: "Assinatura cancelada com sucesso",
        cancelAtPeriodEnd: false,
      });
    }
  } catch (error) {
    console.error("Erro ao cancelar assinatura:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
