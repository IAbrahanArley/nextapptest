import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { stores, store_settings } from "@/lib/db/schema";

export async function GET(request: NextRequest) {
  try {
    // Testar conexão com o banco
    console.log("Testando conexão com o banco...");

    // Verificar se conseguimos fazer uma query simples
    const storesCount = await db.select().from(stores).limit(1);
    console.log("Query de stores executada:", storesCount);

    // Verificar se conseguimos fazer uma query na tabela store_settings
    const settingsCount = await db.select().from(store_settings).limit(1);
    console.log("Query de store_settings executada:", settingsCount);

    // Verificar estrutura das tabelas
    const storeColumns = Object.keys(stores);
    const settingsColumns = Object.keys(store_settings);

    return NextResponse.json({
      success: true,
      message: "Conexão com banco funcionando",
      storesCount: storesCount.length,
      settingsCount: settingsCount.length,
      storeColumns,
      settingsColumns,
      databaseUrl: process.env.DATABASE_URL ? "Configurado" : "Não configurado",
    });
  } catch (error) {
    console.error("Erro no debug do banco:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}








