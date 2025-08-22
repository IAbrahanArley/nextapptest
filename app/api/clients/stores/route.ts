import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { stores, user_store_balances } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    if (session.user.role !== "customer") {
      return NextResponse.json(
        { error: "Acesso negado. Apenas clientes podem acessar esta rota." },
        { status: 403 }
      );
    }

    // Buscar todos os estabelecimentos
    const allStores = await db
      .select({
        id: stores.id,
        name: stores.name,
        description: stores.description,
        logo_url: stores.logo_url,
        slug: stores.slug,
        address: stores.address,
        phone: stores.phone,
        website: stores.website,
        instagram: stores.instagram,
        created_at: stores.created_at,
      })
      .from(stores)
      .orderBy(desc(stores.created_at));

    // Buscar saldos do usuário para cada loja
    const userBalances = await db
      .select({
        store_id: user_store_balances.store_id,
        points: user_store_balances.points,
      })
      .from(user_store_balances)
      .where(eq(user_store_balances.user_id, session.user.id));

    // Criar um mapa de saldos por loja
    const balanceMap = new Map(
      userBalances.map((balance) => [balance.store_id, balance.points])
    );

    // Combinar dados das lojas com os saldos do usuário
    const storesWithBalances = allStores.map((store) => ({
      id: store.id,
      name: store.name,
      description: store.description,
      logo_url: store.logo_url,
      slug: store.slug,
      address: store.address,
      phone: store.phone,
      website: store.website,
      instagram: store.instagram,
      points: balanceMap.get(store.id) || 0,
      // Campos mockados para compatibilidade (podem ser implementados depois)
      category: "Geral",
      rating: 4.5,
      total_customers: 100,
      is_partner: true, // Por enquanto todas são parceiras
    }));

    return NextResponse.json({
      success: true,
      stores: storesWithBalances,
      totalStores: storesWithBalances.length,
      partnerStores: storesWithBalances.filter((s) => s.is_partner).length,
    });
  } catch (error) {
    console.error("Erro ao buscar estabelecimentos:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
