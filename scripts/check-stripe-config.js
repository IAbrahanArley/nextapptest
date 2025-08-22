#!/usr/bin/env node

/**
 * Script para verificar a configuração do Stripe
 * Execute com: node scripts/check-stripe-config.js
 */

require("dotenv").config({ path: ".env.local" });

const Stripe = require("stripe");

async function checkStripeConfig() {
  console.log("🔍 Verificando configuração do Stripe...\n");

  // Verificar variáveis de ambiente
  const requiredEnvVars = [
    "STRIPE_SECRET_KEY",
    "STRIPE_BASICO_PRICE_ID",
    "STRIPE_PREMIUM_PRICE_ID",
    "STRIPE_ENTERPRISE_PRICE_ID",
  ];

  console.log("📋 Variáveis de ambiente:");
  for (const envVar of requiredEnvVars) {
    const value = process.env[envVar];
    if (value) {
      console.log(`✅ ${envVar}: ${value.substring(0, 20)}...`);
    } else {
      console.log(`❌ ${envVar}: NÃO CONFIGURADA`);
    }
  }

  // Verificar se a chave do Stripe está configurada
  if (!process.env.STRIPE_SECRET_KEY) {
    console.log("\n❌ STRIPE_SECRET_KEY não configurada");
    return;
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-07-30.basil",
    });

    console.log("\n🔑 Testando conexão com Stripe...");

    // Testar conexão
    const account = await stripe.accounts.retrieve();
    console.log(
      `✅ Conectado ao Stripe como: ${
        account.business_profile?.name || "Conta padrão"
      }`
    );

    // Verificar price IDs
    const priceIds = {
      basico: process.env.STRIPE_BASICO_PRICE_ID,
      premium: process.env.STRIPE_PREMIUM_PRICE_ID,
      enterprise: process.env.STRIPE_ENTERPRISE_PRICE_ID,
    };

    console.log("\n💰 Verificando Price IDs:");

    for (const [plan, priceId] of Object.entries(priceIds)) {
      if (!priceId) {
        console.log(`❌ ${plan}: Price ID não configurado`);
        continue;
      }

      try {
        const price = await stripe.prices.retrieve(priceId);
        console.log(
          `✅ ${plan}: ${priceId} - ${
            price.unit_amount / 100
          } ${price.currency.toUpperCase()}/${price.recurring?.interval}`
        );
      } catch (err) {
        console.log(`❌ ${plan}: ${priceId} - ERRO: ${err.message}`);
      }
    }

    console.log("\n✅ Verificação concluída!");
  } catch (err) {
    console.error("\n❌ Erro ao conectar com Stripe:", err.message);
  }
}

checkStripeConfig().catch(console.error);
