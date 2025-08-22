# Sistema de QR Codes para Resgate de Prêmios

## Visão Geral

Este sistema implementa um fluxo completo de reconhecimento de resgate de prêmios usando QR codes. Quando um cliente resgata um prêmio, um QR code é gerado automaticamente que deve ser apresentado na loja para validação.

## Funcionalidades

### Para Lojistas

1. **Configuração de Prêmios**: Ao criar um prêmio, é possível definir quantos dias ele tem de validade para resgate
2. **Validação de Resgates**: Interface para ler QR codes e validar resgates de clientes
3. **Scanner de Câmera**: Leitura automática de QR codes via câmera do dispositivo
4. **Códigos Verificadores**: Sistema alternativo para quando a câmera não estiver disponível
5. **Controle de Quantidade**: Quantidade de prêmios é automaticamente reduzida após validação
6. **Histórico de Validações**: Registro completo de quem validou, quando e onde

### Para Clientes

1. **QR Codes Automáticos**: QR codes são gerados automaticamente ao resgatar prêmios
2. **Códigos Verificadores**: Códigos alfanuméricos únicos para validação alternativa
3. **Visualização de Resgates**: Página dedicada para ver todos os prêmios resgatados
4. **Download de QR Codes**: Possibilidade de baixar QR codes para uso offline
5. **Status de Validação**: Acompanhamento do status de cada resgate

## Fluxo do Sistema

### 1. Criação de Prêmio

- Lojista cria prêmio definindo validade para resgate (padrão: 30 dias)
- Sistema armazena configuração de validade

### 2. Resgate de Prêmio

- Cliente resgata prêmio usando pontos
- Sistema gera QR code automaticamente
- Sistema gera código verificador único baseado no nome da loja
- QR code contém informações do resgate e expiração
- Status inicial: "pending" (pendente)

### 3. Validação na Loja

- Cliente apresenta QR code na loja
- Lojista pode usar:
  - **Scanner de Câmera**: Leitura automática via câmera
  - **Código Verificador**: Entrada manual do código alfanumérico
  - **QR Code Manual**: Cole o conteúdo do QR code
- Sistema exibe detalhes do resgate
- Lojista confirma validação com informações adicionais
- Status muda para "completed" (concluído)
- Quantidade do prêmio é reduzida (se aplicável)

## Scanner de Câmera

### Funcionalidades

- **Leitura Automática**: Detecta QR codes em tempo real
- **Guias Visuais**: Overlay com área de alinhamento para melhor precisão
- **Validação em Tempo Real**: Verifica se o QR code pertence à loja
- **Gerenciamento de Permissões**: Solicita e gerencia acesso à câmera
- **Tratamento de Erros**: Mensagens claras para diferentes tipos de erro
- **Interface Responsiva**: Funciona em dispositivos móveis e desktop

### Requisitos Técnicos

- Navegador com suporte a `getUserMedia` API
- Câmera disponível no dispositivo
- Permissão de acesso à câmera concedida pelo usuário
- HTTPS (requerido para acesso à câmera em produção)

### Como Usar

1. Clique no botão "Scanner" na interface de validação
2. Permita o acesso à câmera quando solicitado
3. Posicione o QR code dentro da área delimitada
4. O sistema detectará automaticamente o QR code
5. Confirme os detalhes e valide o resgate

## Códigos Verificadores

### Formato

- **Estrutura**: `XXXX-XXXXXXXX`
- **Exemplo**: `LOJA-A1B2C3D4`
- **Composição**:
  - 4 letras do nome da loja (padrão: "LOJA")
  - Hífen separador
  - 8 caracteres alfanuméricos únicos

### Geração

- Baseado no nome da loja e ID do resgate
- Hash SHA-256 para garantir unicidade
- Substituição automática de caracteres especiais
- Validação de formato em tempo real

### Vantagens

- Funciona sem câmera
- Fácil de ler e digitar
- Identificação visual da loja
- Sistema de fallback robusto

## Estrutura do Banco de Dados

### Novos Campos na Tabela `rewards`

- `redemption_validity_days`: Dias de validade para resgate (padrão: 30)
- `redemption_qr_code`: QR code do prêmio (opcional)

### Novos Campos na Tabela `reward_redemptions`

- `validation_status`: Status da validação (pending, validated, rejected, expired)
- `redeemed_at`: Data/hora do resgate
- `qr_code`: QR code do resgate

### Nova Tabela `reward_redemption_qr_codes`

- `redemption_id`: Referência ao resgate
- `qr_code`: Conteúdo do QR code
- `verification_code`: Código verificador único
- `expires_at`: Data de expiração
- `is_used`: Se foi utilizado
- `validated_by_store`: Se foi validado pela loja
- `store_validation_metadata`: Metadados da validação

## Novos Enums

### `redemption_validation_status`

- `pending`: Aguardando validação
- `validated`: Validado pela loja
- `rejected`: Rejeitado pela loja
- `expired`: Expirado

## Rotas da API

### `/api/stores/validate-redemption`

- **POST**: Valida resgates via QR code ou código verificador
- Aceita ambos os tipos de entrada

### `/api/stores/redemption-by-code`

- **POST**: Busca detalhes de resgate por código verificador
- Validação de formato e propriedade da loja

### `/api/stores/redemption-details/[redemptionId]`

- **GET**: Busca detalhes de um resgate específico
- Usado pela interface de validação da loja

## Páginas Criadas

### Cliente

- `/cliente/premios-resgatados`: Lista todos os prêmios resgatados com QR codes e códigos verificadores

### Loja

- `/dashboard-loja/validar-resgates`: Interface para validar resgates via QR code, scanner ou código verificador

## Componentes Criados

### `QRScanner`

- Scanner de câmera com interface intuitiva
- Gerenciamento de permissões
- Tratamento de erros robusto
- Guias visuais para alinhamento

### `useCameraPermissions`

- Hook para gerenciar permissões de câmera
- Verificação automática de suporte
- Solicitação de permissões
- Tratamento de diferentes tipos de erro

## Hooks Customizados

### `useCreateRedemptionQr`

- Gera QR codes para resgates existentes
- Útil para casos onde QR code não foi gerado automaticamente

### `useValidateRedemption`

- Valida resgates via QR code ou código verificador
- Atualiza status e metadados de validação

### `useCameraPermissions`

- Gerencia permissões de câmera
- Verifica suporte do navegador
- Solicita acesso quando necessário

## Como Usar

### Para Lojistas

1. Acesse "Validar Resgates" no menu lateral
2. Escolha entre:
   - **QR Code**: Cole o QR code ou use o scanner
   - **Código Verificador**: Digite o código alfanumérico
3. Use o scanner de câmera para leitura automática
4. Confirme os detalhes do resgate
5. Preencha informações de validação (nome, local, observações)
6. Clique em "Confirmar Validação"

### Para Clientes

1. Acesse "Prêmios Resgatados" no menu lateral
2. Visualize todos os prêmios resgatados
3. Baixe QR codes para uso offline
4. Copie códigos verificadores para área de transferência
5. Apresente QR code ou código verificador na loja para validação

## Segurança

- QR codes são únicos e não podem ser reutilizados
- Códigos verificadores são únicos e baseados em hash criptográfico
- Validação só pode ser feita pela loja que emitiu o prêmio
- Sistema verifica expiração automaticamente
- Metadados de validação são armazenados para auditoria
- Permissões de câmera são solicitadas explicitamente

## Tratamento de Erros

### Scanner de Câmera

- **NotAllowedError**: Permissão negada
- **NotFoundError**: Câmera não encontrada
- **NotSupportedError**: Câmera não suportada
- **QR Code Inválido**: Formato incorreto
- **QR Code de Outra Loja**: Propriedade incorreta

### Códigos Verificadores

- **Formato Inválido**: Não segue o padrão XXXX-XXXXXXXX
- **Código Não Encontrado**: Não existe no sistema
- **Código Expirado**: Passou da data de validade
- **Código Já Utilizado**: Foi validado anteriormente

## Próximos Passos

1. ✅ **Scanner de Câmera**: Implementado com `react-qr-reader`
2. ✅ **Códigos Verificadores**: Sistema alternativo implementado
3. **Notificações**: Alertas para resgates próximos do vencimento
4. **Relatórios**: Estatísticas de validação e resgates
5. **Integração Mobile**: App para leitura de QR codes
6. **Validação Offline**: Sistema para funcionar sem internet
7. **Múltiplas Câmeras**: Seleção entre câmera frontal e traseira
8. **Modo Noturno**: Interface adaptada para baixa luminosidade

## Dependências

- `qrcode`: Geração de QR codes
- `@types/qrcode`: Tipos TypeScript para qrcode
- `react-qr-reader`: Leitura de QR codes via câmera

## Migração

Execute as migrações para adicionar as novas funcionalidades:

```bash
npm run db:migrate
```

## Suporte

Para dúvidas ou problemas, consulte a documentação ou entre em contato com a equipe de desenvolvimento.

## Troubleshooting

### Problemas Comuns

1. **Câmera não funciona**

   - Verifique permissões do navegador
   - Certifique-se de estar usando HTTPS
   - Teste em outro navegador

2. **QR code não é detectado**

   - Verifique a iluminação
   - Mantenha o QR code estável
   - Limpe a lente da câmera

3. **Código verificador inválido**
   - Verifique o formato (XXXX-XXXXXXXX)
   - Confirme se não há espaços extras
   - Use apenas letras maiúsculas e números
