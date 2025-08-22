-- Adicionar campo verification_code na tabela reward_redemption_qr_codes
ALTER TABLE "reward_redemption_qr_codes" ADD COLUMN "verification_code" varchar(12) NOT NULL;

-- Adicionar constraint unique para verification_code
ALTER TABLE "reward_redemption_qr_codes" ADD CONSTRAINT "reward_redemption_qr_codes_verification_code_unique" UNIQUE("verification_code");

-- Criar índice para melhorar performance de busca por código verificador
CREATE INDEX "idx_reward_redemption_qr_codes_verification_code" ON "reward_redemption_qr_codes" ("verification_code");
