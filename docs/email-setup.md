# Configuração de Email - BranlyClub

## 📧 Funcionalidades Implementadas

### 1. Email de Boas-vindas (Novo Cliente)

- **Função**: `sendWelcomeEmail(to, name, temporaryPassword)`
- **Quando**: Ao cadastrar um novo cliente
- **Conteúdo**: Senha temporária para primeiro acesso
- **Template**: Design moderno com gradiente azul

### 2. Email de Atribuição de Pontos

- **Função**: `sendPointsAttributionEmail(to, name, points, storeName, reason)`
- **Quando**: Ao atribuir pontos a um cliente existente
- **Conteúdo**: Quantidade de pontos, nome da loja e motivo
- **Template**: Design consistente com email de boas-vindas

## 🔧 Configuração Necessária

### Variáveis de Ambiente (.env.local)

```bash
# Resend API Key (obrigatório)
RESEND_API_KEY=re_xxxxxxxxxxxxx

# URL da aplicação (opcional, fallback para localhost)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Logo da empresa (opcional)
NEXT_PUBLIC_LOGO=https://exemplo.com/logo.png
```

## 🚀 Como Usar

### Envio Automático

Os emails são enviados automaticamente quando:

1. **Novo Cliente**: Ao cadastrar cliente com email válido
2. **Atribuição de Pontos**: Ao criar transação para cliente existente

### Envio Manual (se necessário)

```typescript
import { sendWelcomeEmail, sendPointsAttributionEmail } from "@/lib/email";

// Email de boas-vindas
await sendWelcomeEmail("cliente@email.com", "Nome do Cliente", "senha123");

// Email de atribuição de pontos
await sendPointsAttributionEmail(
  "cliente@email.com",
  "Nome do Cliente",
  100,
  "Nome da Loja",
  "Compra de R$ 50,00"
);
```

## 📱 Templates de Email

### Design Consistente

- **Cores**: Gradiente azul (#00C6FF → #0040FF)
- **Layout**: Responsivo com bordas arredondadas
- **Tipografia**: Arial com hierarquia clara
- **Elementos**: Ícones, botões CTA e seções organizadas

### Elementos Visuais

- Header com logo e nome da empresa
- Seções destacadas com cores temáticas
- Botões de ação com gradiente
- Footer com informações da empresa

## 🧪 Testes

### Durante Desenvolvimento

- Use `onboarding@resend.dev` como remetente
- Emails só podem ser enviados para seu email verificado
- Configure `RESEND_API_KEY` para testes

### Em Produção

- Verifique domínio em https://resend.com/domains
- Use email com domínio verificado como remetente
- Teste com emails reais dos clientes

## 📊 Logs e Debug

### Logs Disponíveis

- ✅ Início do envio
- ✅ Status da API Key
- ✅ Dados do destinatário
- ✅ Resultado do envio
- ❌ Erros detalhados

### Exemplo de Log

```
🔧 [EMAIL] Iniciando envio de email...
🔧 [EMAIL] API Key configurada: true
🔧 [EMAIL] Para: cliente@email.com
🔧 [EMAIL] Nome: João Silva
🔧 [EMAIL] Senha temporária: Ab3x9Y2k
✅ [EMAIL] Email enviado com sucesso: {id: "abc123"}
```

## 🔒 Segurança

### Boas Práticas

- Senhas temporárias são geradas com bcrypt
- Emails não contêm informações sensíveis
- Logs não expõem dados pessoais
- Tratamento de erros sem exposição de dados

### Validações

- Verificação de API Key antes do envio
- Validação de dados de entrada
- Tratamento de erros de rede
- Fallback para operações críticas

## 🚨 Solução de Problemas

### Erro: "API Key não configurada"

- Verifique se `RESEND_API_KEY` está em `.env.local`
- Reinicie o servidor após adicionar a variável

### Erro: "Domínio não verificado"

- Use `onboarding@resend.dev` para testes
- Verifique domínio em https://resend.com/domains

### Erro: "Email não enviado"

- Verifique logs do console
- Confirme se destinatário tem email válido
- Teste com seu próprio email primeiro

## 📈 Próximos Passos

### Funcionalidades Futuras

- [ ] Email de recuperação de senha
- [ ] Email de notificação de pontos expirando
- [ ] Email de confirmação de troca de prêmios
- [ ] Templates personalizáveis por loja
- [ ] Sistema de preferências de email
