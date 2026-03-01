# 🧪 Guia de Teste de APIs — NΞØ Smart Factory

**Data:** 2026-01-26  
**Status:** Ativo  
**Categoria:** Testes  
**Audiência:** Desenvolvedores

---

## 🚀 Início Rápido

### Pré-requisitos

1. **Vercel CLI instalado:**

   ```bash
   npm i -g vercel
   ```

2. **Servidor rodando:**

   ```bash
   make dev-vercel
   # ou
   npm run dev:vercel
   ```

3. **Variáveis de ambiente configuradas:**
   - `DATABASE_URL` (obrigatório)
   - `TAVILY_API_KEY` (para APIs Tavily)

---

## 📋 Teste Automatizado

### Script de Teste Completo

Execute o script de teste que testa todas as APIs:

```bash
# Testar localmente (localhost:3000)
./scripts/test-apis.sh

# Testar em produção
./scripts/test-apis.sh https://smart-ui-delta.vercel.app
```

**O script testa:**

- ✅ Operations Status
- ✅ Deploys (GET e POST)
- ✅ Drafts (GET e POST)
- ✅ Marketing & Analytics (leads, sessions, events, analytics)
- ✅ Tavily AI (4 rotas)

---

## 🔍 Teste Manual por Categoria

### 1. Operations & Status

#### `GET /api/ops-status`

```bash
curl http://localhost:3000/api/ops-status
```

**Resposta esperada:**

```json
{
  "version": "0.5.3",
  "codename": "MULTICHAIN FOUNDATION",
  "status": "online",
  "deploy": "production"
}
```

---

### 2. Deploys

#### `GET /api/deploys`

```bash
curl http://localhost:3000/api/deploys
```

**Resposta esperada:** Array de deploys (pode estar vazio)

#### `POST /api/deploys`

```bash
curl -X POST http://localhost:3000/api/deploys \
  -H "Content-Type: application/json" \
  -d '{
    "contract_address": "0x1234567890123456789012345678901234567890",
    "owner_address": "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
    "network": "base",
    "tx_hash": "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    "token_name": "Test Token",
    "token_symbol": "TEST"
  }'
```

**Resposta esperada:** `{ "success": true, "id": 1 }`

---

### 3. Drafts

#### `GET /api/drafts?address={address}`

```bash
curl "http://localhost:3000/api/drafts?address=0xabcdefabcdefabcdefabcdefabcdefabcdefabcd"
```

**Resposta esperada:** `{ "token_config": {...} }` ou `404`

#### `POST /api/drafts`

```bash
curl -X POST http://localhost:3000/api/drafts \
  -H "Content-Type: application/json" \
  -d '{
    "user_address": "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
    "token_config": {
      "tokenName": "Test Token",
      "tokenSymbol": "TEST",
      "tokenSupply": "1000000",
      "description": "Test description"
    }
  }'
```

**Resposta esperada:** `{ "success": true }`

---

### 4. Marketing & Analytics

#### `GET /api/leads?session_id={id}`

```bash
curl "http://localhost:3000/api/leads?session_id=test_session_123"
```

#### `POST /api/leads`

```bash
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "test_session_123",
    "conversion_status": "engaged"
  }'
```

#### `GET /api/sessions?session_id={id}`

```bash
curl "http://localhost:3000/api/sessions?session_id=test_session_123"
```

#### `POST /api/sessions`

```bash
curl -X POST http://localhost:3000/api/sessions \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "test_session_123",
    "lead_id": "test_lead_123",
    "step_reached": 1
  }'
```

#### `GET /api/events?lead_id={id}`

```bash
curl "http://localhost:3000/api/events?lead_id=test_lead_123"
```

#### `POST /api/events`

```bash
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "lead_id": "test_lead_123",
    "session_id": "test_session_123",
    "event_type": "form_start"
  }'
```

#### `GET /api/analytics`

```bash
curl http://localhost:3000/api/analytics
```

---

### 5. Tavily AI Integration

#### `POST /api/tavily/validate-token-name`

```bash
curl -X POST http://localhost:3000/api/tavily/validate-token-name \
  -H "Content-Type: application/json" \
  -d '{
    "tokenName": "NeoToken",
    "symbol": "NEO"
  }'
```

**Resposta esperada:**

```json
{
  "valid": false,
  "conflicts": [...],
  "suggestions": [...],
  "totalResults": 10
}
```

#### `POST /api/tavily/market-research`

```bash
curl -X POST http://localhost:3000/api/tavily/market-research \
  -H "Content-Type: application/json" \
  -d '{
    "category": "DeFi",
    "keywords": "lending protocol"
  }'
```

**Resposta esperada:**

```json
{
  "trends": [...],
  "competitors": [...],
  "marketGaps": [...],
  "summary": "..."
}
```

#### `POST /api/tavily/generate-whitepaper-base`

```bash
curl -X POST http://localhost:3000/api/tavily/generate-whitepaper-base \
  -H "Content-Type: application/json" \
  -d '{
    "tokenName": "NeoToken",
    "category": "DeFi",
    "useCase": "Lending protocol",
    "targetAudience": "Institutional investors"
  }'
```

**Resposta esperada:**

```json
{
  "introduction": "...",
  "tokenomics": "...",
  "useCase": "...",
  "marketAnalysis": "...",
  "references": [...]
}
```

#### `POST /api/tavily/marketing-suggestions`

```bash
curl -X POST http://localhost:3000/api/tavily/marketing-suggestions \
  -H "Content-Type: application/json" \
  -d '{
    "tokenName": "NeoToken",
    "category": "DeFi",
    "launchDate": "2026-02-01"
  }'
```

**Resposta esperada:**

```json
{
  "socialMedia": [...],
  "contentIdeas": [...],
  "timing": {...},
  "channels": [...],
  "messaging": [...]
}
```

---

## ⚠️ Troubleshooting

### Erro: "404 Not Found"

**Causa:** Usando `vite dev` em vez de `vercel dev`

**Solução:**

```bash
# Parar vite dev (Ctrl+C)
make dev-vercel
```

### Erro: "TAVILY_API_KEY não configurada"

**Causa:** Variável de ambiente não configurada

**Solução:**

1. Verificar `.env` local:

   ```bash
   grep TAVILY_API_KEY .env
   ```

2. Configurar no Vercel (produção):
   ```bash
   vercel env add TAVILY_API_KEY production
   ```

### Erro: "Database connection failed"

**Causa:** `DATABASE_URL` inválida ou database inativo

**Solução:**

1. Verificar `.env`:

   ```bash
   grep DATABASE_URL .env
   ```

2. Testar conexão:
   ```bash
   psql $DATABASE_URL -c "SELECT 1;"
   ```

---

## 📊 Checklist de Testes

### APIs Básicas

- [ ] `GET /api/ops-status` retorna status
- [ ] `GET /api/deploys` retorna array
- [ ] `POST /api/deploys` cria deploy
- [ ] `GET /api/drafts` busca draft
- [ ] `POST /api/drafts` salva draft

### Marketing & Analytics

- [ ] `GET /api/leads` busca lead
- [ ] `POST /api/leads` cria lead
- [ ] `GET /api/sessions` busca sessão
- [ ] `POST /api/sessions` cria sessão
- [ ] `GET /api/events` busca eventos
- [ ] `POST /api/events` cria evento
- [ ] `GET /api/analytics` retorna analytics

### Tavily AI

- [ ] `POST /api/tavily/validate-token-name` valida nome
- [ ] `POST /api/tavily/market-research` pesquisa mercado
- [ ] `POST /api/tavily/generate-whitepaper-base` gera whitepaper
- [ ] `POST /api/tavily/marketing-suggestions` gera sugestões

---

## 🔗 Referências

- [API Documentation](./api/README.md)
- [Tavily Integration Guide](../guides/TAVILY_INTEGRATION.md)
- [OpenAPI Specification](./api/openapi.yaml)
- [DEV_SETUP.md](../../DEV_SETUP.md)

---

**Última atualização:** 2026-01-26
