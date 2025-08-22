-- Adicionar novas colunas na tabela stores
ALTER TABLE stores ADD COLUMN IF NOT EXISTS banner_url TEXT;
ALTER TABLE stores ADD COLUMN IF NOT EXISTS cnpj VARCHAR(18);
ALTER TABLE stores ADD COLUMN IF NOT EXISTS email VARCHAR(320);
ALTER TABLE stores ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
ALTER TABLE stores ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE stores ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE stores ADD COLUMN IF NOT EXISTS instagram TEXT;
ALTER TABLE stores ADD COLUMN IF NOT EXISTS facebook TEXT;
ALTER TABLE stores ADD COLUMN IF NOT EXISTS whatsapp TEXT;

-- Adicionar novas colunas na tabela store_settings
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS notification_whatsapp BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS notification_email BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS notification_expiration BOOLEAN NOT NULL DEFAULT FALSE;

-- Atualizar pontos_validity_days para ter valor padrão
ALTER TABLE store_settings ALTER COLUMN points_validity_days SET NOT NULL;
ALTER TABLE store_settings ALTER COLUMN points_validity_days SET DEFAULT 365;

