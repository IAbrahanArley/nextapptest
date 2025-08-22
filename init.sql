-- Arquivo de inicialização do banco de dados
-- Este arquivo é executado automaticamente quando o container PostgreSQL é criado

-- Criar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Criar banco de dados se não existir
-- (O PostgreSQL já cria o banco baseado nas variáveis de ambiente)

-- Mensagem de confirmação
DO $$
BEGIN
    RAISE NOTICE 'Database loyalty_saas initialized successfully!';
    RAISE NOTICE 'Connection string: postgresql://postgres:postgres@localhost:5432/loyalty_saas';
END $$;

