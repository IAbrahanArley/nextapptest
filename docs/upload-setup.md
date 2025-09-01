# Configuração do Upload de Imagens

## Visão Geral

O sistema de upload de imagens utiliza o Google Cloud Storage para armazenar imagens de perfil das lojas. Para que funcione corretamente, é necessário configurar as variáveis de ambiente.

## Variáveis de Ambiente Necessárias

Adicione as seguintes variáveis ao seu arquivo `.env.local`:

```bash
# Google Cloud Storage Configuration
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_CLOUD_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
GOOGLE_CLOUD_BUCKET_NAME=your-bucket-name
```

## Configuração do Google Cloud Storage

### 1. Criar Projeto no Google Cloud

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Ative a API do Cloud Storage

### 2. Criar Service Account

1. Vá para "IAM & Admin" > "Service Accounts"
2. Clique em "Create Service Account"
3. Dê um nome e descrição
4. Atribua a role "Storage Admin" para acesso completo ao bucket

### 3. Gerar Chave Privada

1. Na lista de service accounts, clique no email
2. Vá para a aba "Keys"
3. Clique em "Add Key" > "Create new key"
4. Escolha "JSON" e baixe o arquivo
5. Extraia as informações necessárias do JSON

### 4. Criar Bucket

1. Vá para "Cloud Storage" > "Buckets"
2. Clique em "Create Bucket"
3. Escolha um nome único globalmente
4. Configure as permissões para permitir acesso público às imagens

## Estrutura do Bucket

```
your-bucket-name/
├── profile-images/
│   ├── 1234567890-image1.jpg
│   ├── 1234567891-image2.png
│   └── ...
```

## Solução de Problemas

### Erro: "Serviço de upload não configurado"

- Verifique se todas as variáveis de ambiente estão definidas
- Confirme se o arquivo `.env.local` está na raiz do projeto
- Reinicie o servidor após adicionar as variáveis

### Erro: "Erro de autenticação"

- Verifique se a chave privada está correta
- Confirme se o service account tem as permissões necessárias
- Verifique se o projeto ID está correto

### Erro: "Bucket não encontrado"

- Confirme se o nome do bucket está correto
- Verifique se o bucket existe no projeto especificado
- Confirme se o service account tem acesso ao bucket

## Testando o Upload

1. Configure todas as variáveis de ambiente
2. Reinicie o servidor de desenvolvimento
3. Tente fazer upload de uma imagem na página de configurações
4. Verifique os logs do console para mensagens de erro

## Alternativas

Se não quiser usar o Google Cloud Storage, você pode:

1. Modificar a API para usar outro serviço (AWS S3, Azure Blob, etc.)
2. Implementar upload local (não recomendado para produção)
3. Usar um serviço de terceiros como Cloudinary ou Imgur

## Segurança

- Nunca commite as chaves privadas no Git
- Use variáveis de ambiente para todas as credenciais
- Configure as permissões mínimas necessárias no service account
- Considere usar IAM roles mais específicas em produção

