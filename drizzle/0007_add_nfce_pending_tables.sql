-- Migration: Adicionar tabelas para NFC-e pendentes
-- Data: 2024-12-19

-- Tabela para NFC-e pendentes
CREATE TABLE IF NOT EXISTS "pending_nfce" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "store_id" uuid NOT NULL REFERENCES "stores"("id") ON DELETE CASCADE,
  "chave_acesso" text NOT NULL UNIQUE,
  "estado" text NOT NULL,
  "sefaz_url" text NOT NULL,
  "status" text NOT NULL DEFAULT 'pending' CHECK ("status" IN ('pending', 'approved', 'rejected')),
  "valor_total" numeric(10,2),
  "data_emissao" timestamp,
  "estabelecimento" text,
  "cnpj" text,
  "pontos_atribuidos" integer,
  "observacoes" text,
  "validado_por" uuid REFERENCES "users"("id"),
  "validado_em" timestamp,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now()
);

-- Tabela para log de validações
CREATE TABLE IF NOT EXISTS "nfce_validation_log" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "nfce_id" uuid NOT NULL REFERENCES "pending_nfce"("id") ON DELETE CASCADE,
  "action" text NOT NULL CHECK ("action" IN ('created', 'approved', 'rejected', 'updated')),
  "user_id" uuid NOT NULL REFERENCES "users"("id"),
  "details" text,
  "created_at" timestamp NOT NULL DEFAULT now()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS "pending_nfce_user_id_idx" ON "pending_nfce"("user_id");
CREATE INDEX IF NOT EXISTS "pending_nfce_store_id_idx" ON "pending_nfce"("store_id");
CREATE INDEX IF NOT EXISTS "pending_nfce_status_idx" ON "pending_nfce"("status");
CREATE INDEX IF NOT EXISTS "pending_nfce_chave_acesso_idx" ON "pending_nfce"("chave_acesso");
CREATE INDEX IF NOT EXISTS "nfce_validation_log_nfce_id_idx" ON "nfce_validation_log"("nfce_id");





