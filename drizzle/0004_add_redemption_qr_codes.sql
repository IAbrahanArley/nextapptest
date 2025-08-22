-- Adicionar campos de validade de resgate na tabela rewards
ALTER TABLE "rewards" ADD COLUMN "redemption_validity_days" integer NOT NULL DEFAULT 30;
ALTER TABLE "rewards" ADD COLUMN "redemption_qr_code" text;

-- Adicionar campos de validação na tabela reward_redemptions
ALTER TABLE "reward_redemptions" ADD COLUMN "validation_status" "redemption_validation_status" NOT NULL DEFAULT 'pending';
ALTER TABLE "reward_redemptions" ADD COLUMN "redeemed_at" timestamp;
ALTER TABLE "reward_redemptions" ADD COLUMN "qr_code" text;

-- Criar enum para status de validação
CREATE TYPE "redemption_validation_status" AS ENUM('pending', 'validated', 'rejected', 'expired');

-- Criar tabela para QR codes de resgate
CREATE TABLE "reward_redemption_qr_codes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"redemption_id" uuid NOT NULL,
	"qr_code" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"is_used" boolean NOT NULL DEFAULT false,
	"used_at" timestamp,
	"validated_by_store" boolean NOT NULL DEFAULT false,
	"validated_at" timestamp,
	"store_validation_metadata" json,
	"created_at" timestamp DEFAULT now() NOT NULL
);

-- Adicionar constraint unique para qr_code
ALTER TABLE "reward_redemption_qr_codes" ADD CONSTRAINT "reward_redemption_qr_codes_qr_code_unique" UNIQUE("qr_code");

-- Adicionar foreign key para redemption_id
ALTER TABLE "reward_redemption_qr_codes" ADD CONSTRAINT "reward_redemption_qr_codes_redemption_id_reward_redemptions_id_fk" FOREIGN KEY ("redemption_id") REFERENCES "reward_redemptions"("id") ON DELETE no action ON UPDATE no action;
