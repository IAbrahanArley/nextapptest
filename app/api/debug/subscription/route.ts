import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { subscriptions, stores } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    console.log("Debug - User ID:", session.user.id);

    // Buscar todas as lojas do usuário
    const userStores = await db.query.stores.findMany({
      where: eq(stores.owner_id, session.user.id),
    });

    console.log("Debug - Lojas encontradas:", userStores);

    // Buscar todas as assinaturas relacionadas às lojas do usuário
    const allSubscriptions = [];
    for (const store of userStores) {
      const storeSubscriptions = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.store_id, store.id));

      console.log(
        `Debug - Assinaturas da loja ${store.name}:`,
        storeSubscriptions
      );

      allSubscriptions.push(
        ...storeSubscriptions.map((sub) => ({
          ...sub,
          storeName: store.name,
          storeId: store.id,
        }))
      );
    }

    return NextResponse.json({
      debug: {
        user: {
          id: session.user.id,
          email: session.user.email,
          name: session.user.name,
        },
        stores: userStores.map((store) => ({
          id: store.id,
          name: store.name,
          slug: store.slug,
        })),
        subscriptions: allSubscriptions.map((sub) => ({
          id: sub.id,
          status: sub.status,
          planId: sub.plan_id,
          stripeSubscriptionId: sub.stripe_subscription_id,
          stripeCustomerId: sub.stripe_customer_id,
          storeName: sub.storeName,
          storeId: sub.storeId,
          currentPeriodStart: sub.current_period_start,
          currentPeriodEnd: sub.current_period_end,
          createdAt: sub.created_at,
          updatedAt: sub.updated_at,
        })),
      },
    });
  } catch (error) {
    console.error("Erro ao buscar debug:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
