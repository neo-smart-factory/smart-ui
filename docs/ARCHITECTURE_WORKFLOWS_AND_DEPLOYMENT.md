# 🏗️ Arquitetura: Workflows GitHub e Deploy Vercel

**Documento Técnico Completo**  
**Data:** Janeiro 2026  
**Versão:** 2.0 (pós-migração multi-repos)

---

## 📋 Índice

1. [Workflows do GitHub Actions](#workflows-do-github-actions)
2. [Arquitetura de Conexão Frontend-Backend](#arquitetura-de-conexão-frontend-backend)
3. [Estrutura de Deploy no Vercel](#estrutura-de-deploy-no-vercel)
4. [Avaliação Técnica](#avaliação-técnica)

---

## 🔄 Workflows do GitHub Actions

### 1. Docs Guard (`docs-guard.yml`)

**Trigger:** Pull Requests para `main`

**Objetivo:** Garantir que mudanças de código sejam acompanhadas de documentação.

**Fluxo de Execução:**

```
PR Criado → GitHub Actions Trigger
    ↓
Checkout do código
    ↓
Análise de arquivos modificados
    ↓
Categorização: Código vs Documentação
    ↓
Validação:
  - Se código mudou E docs não mudaram → ❌ FAIL
  - Se código mudou E docs mudaram → ✅ PASS
  - Se apenas docs mudaram → ✅ PASS
```

**Arquivos Monitorados:**

- **Código:** `.github/workflows/*`, `src/*`, `components/*`, `pages/*`, `api/*`, `scripts/*`, `Makefile`, `package.json`, arquivos de config
- **Documentação:** `docs/*`, `*.md` (README, etc.)

**Sugestões Automáticas:**

O workflow sugere arquivos de documentação específicos baseado no tipo de mudança:

- Workflows → `docs/GITHUB_ACTIONS_SETUP.md`
- Código Frontend → `docs/PROJECT_OVERVIEW.md`, `README.md`
- API Routes → `docs/PROJECT_OVERVIEW.md`
- Scripts/Makefile → `README.md`

**Status Atual:** ✅ Funcional

---

### 2. Protocol Health Check (`protocol-health.yml`)

**Trigger:** Push e Pull Requests para `main` ou `master`

**Objetivo:** Verificar saúde do ecossistema NΞØ, incluindo integração cross-repository.

**Fluxo de Execução:**

```
Push/PR → GitHub Actions Trigger
    ↓
Checkout smart-ui (repositório atual)
    ↓
Checkout neo-smart-factory (repositório externo)
    ↓
Setup Node.js 20 + Cache npm
    ↓
npm install (smart-ui)
    ↓
make health (executa validações)
    ↓
Report de saúde do protocolo
```

**Integração Cross-Repository:**

```yaml
- name: Checkout Smart Factory (Core/Docs/Ops)
  uses: actions/checkout@v4
  continue-on-error: true
  with:
    repository: neo-smart-factory/neo-smart-factory
    path: neo-smart-factory
    token: ${{ secrets.NEO_ECOSYSTEM_TOKEN }}
```

**Requisitos:**

- **Secret Necessário:** `NEO_ECOSYSTEM_TOKEN` (Personal Access Token com scope `repo`)
- **Repositório Externo:** `neo-smart-factory/neo-smart-factory`
- **Comando:** `make health` (deve estar implementado no Makefile)

**Status Atual:** ⚠️ Requer `NEO_ECOSYSTEM_TOKEN` configurado

---

## 🔌 Arquitetura de Conexão Frontend-Backend

### Visão Geral

┌─────────────────────────────────────────────────────────────────────────────┐
│ ARQUITETURA DO SISTEMA │
└─────────────────────────────────────────────────────────────────────────────┘

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ FRONTEND ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · ┃
┃ · · · · · ┃
┃ · · Dashboard NΞØ Smart UI · · · ┃
┃ · · (React 18 + Vite 7.3.1) · · · ┃
┃ · · · · · ┃
┃ · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
│
▼
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ API LAYER ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ┃
┃ ░ ░ ░ ░ ░ ┃
┃ ░ ░ Vercel Serverless Functions (/api/\*) ░ ░ ░ ┃
┃ ░ ░ ░ ░ ░ ┃
┃ ░ ░ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ ░ ░ ░ ┃
┃ ░ ░ │ /api/deploys │ │ /api/drafts │ │ /api/ops-status │ ░ ░ ░ ┃
┃ ░ ░ └────────┬────────┘ └────────┬────────┘ └────────┬────────┘ ░ ░ ░ ┃
┃ ░ ░ │ │ │ ░ ░ ░ ┃
┃ ░ ░ └────────────────────┴────────────────────┘ ░ ░ ░ ┃
┃ ░ ░ │ ░ ░ ░ ┃
┃ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
│
▼
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ DATABASE ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ┃
┃ ▒ ▒ ▒ ▒ ▒ ┃
┃ ▒ ▒ Neon Database ▒ ▒ ▒ ┃
┃ ▒ ▒ (PostgreSQL) ▒ ▒ ▒ ┃
┃ ▒ ▒ ▒ ▒ ▒ ┃
┃ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

````

### Dashboard (Raiz `/`)

**Stack:** React 18 + Vite 7.3.1

**Conexões com Backend:**

#### API Routes Utilizadas:

1. **`GET /api/deploys`**
   - **Uso:** Carregar histórico de deploys
   - **Componente:** `App.jsx` → `fetchDeploys()`
   - **Resposta:** Array de deploys ordenados por `created_at DESC` (limite 50)
   - **Tratamento de Erro:** Silencioso em modo `vite dev` (API não disponível)

2. **`POST /api/deploys`**
   - **Uso:** Registrar novo deploy após minting
   - **Componente:** `App.jsx` → `handleDeploy()`
   - **Payload:**
     ```json
     {
       "contract_address": "0x...",
       "owner_address": "0x...",
       "network": "base",
       "tx_hash": "0x...",
       "token_name": "Token Name",
       "token_symbol": "SYMBOL"
     }
     ```
   - **Tratamento de Erro:** Não bloqueia o fluxo se API falhar

3. **`GET /api/drafts?address={address}`**
   - **Uso:** Carregar draft salvo do usuário
   - **Componente:** `App.jsx` → `loadDraft()`
   - **Resposta:** `token_config` (JSON) ou 404
   - **Tratamento de Erro:** Silencioso se não encontrar

4. **`POST /api/drafts`**
   - **Uso:** Salvar draft do usuário
   - **Componente:** `App.jsx` → `saveDraft()`
   - **Payload:**
     ```json
     {
       "user_address": "0x...",
       "token_config": { ... }
     }
     ```
   - **Lógica:** Upsert (INSERT ... ON CONFLICT DO UPDATE)

5. **`GET /api/ops-status`**
   - **Uso:** Status operacional do protocolo
   - **Componente:** `OpsDashboard.tsx`
   - **Resposta:** Estado operacional (version, codename, status, deploy)

**Modo de Desenvolvimento:**

- **`vite dev`:** API routes não funcionam (retornam 404 ou código fonte)
- **`vercel dev`:** API routes funcionam completamente
- **Tratamento:** Frontend detecta ausência de API e continua em modo degradado

**Conexão com Database:**

- **Cliente:** `@neondatabase/serverless` (via `lib/db.js`)
- **Variável de Ambiente:** `DATABASE_URL` (Neon PostgreSQL)
- **Schema:** Tabelas `deploys` e `drafts`
- **Migrations:** `migrations/01_init.sql` (executar via `make migratedb`)

---

## 🚀 Estrutura de Deploy no Vercel

### Dashboard (`smart-ui-dashboard`)

**Configuração Vercel:**

| Configuração | Valor |
|-------------|-------|
| **Repository** | `neo-smart-factory/smart-ui` |
| **Root Directory** | `.` (raiz) |
| **Framework Preset** | Vite |
| **Build Command** | `npm run build` (auto-detectado) |
| **Output Directory** | `dist` (auto-detectado) |
| **Install Command** | `npm install` (auto-detectado) |
| **Development Command** | `vite` |

**URLs:**

- **Produção:** `https://smart-ui-dashboard.vercel.app` (ou custom domain)
- **Preview:** `https://smart-ui-dashboard-{branch}.vercel.app`

**Variáveis de Ambiente:**

- `DATABASE_URL` (obrigatório) - Neon PostgreSQL connection string
- `VITE_CHAIN_ID` - Chain ID para Web3 (ex: `8453` para Base)
- `VITE_RPC_URL` - RPC endpoint
- `VITE_ENABLE_WEB3` - `false` para simulation mode (padrão)
- `NEO_ECOSYSTEM_TOKEN` - GitHub PAT (opcional, para workflows)
- `MODAL_TOKEN_ID` / `MODAL_TOKEN_SECRET` - Modal.com credentials (opcional)

**API Routes:**

✅ **Disponíveis** (Vercel Serverless Functions em `/api`)

- `/api/deploys` → `api/deploys.js`
- `/api/drafts` → `api/drafts.js`
- `/api/ops-status` → `api/ops-status.js`

**Build Process:**

````

1. Vercel clona repositório
2. Executa npm install (raiz)
3. Executa npm run build (raiz)
4. Vite build gera /dist
5. Deploy de /dist + /api como Serverless Functions

````

**📖 Guia Completo:** Veja [docs/DEPLOY_DASHBOARD.md](./DEPLOY_DASHBOARD.md)

---

## 📊 Avaliação Técnica

### ✅ Pontos Fortes

1. **Arquitetura Limpa e Focada**
   - Dashboard: Funcionalidade completa + API routes
   - Repositório único = deploy simples
   - Sem complexidade de monorepo

2. **Workflows GitHub Actions Bem Estruturados**
   - Docs Guard: Garante qualidade de documentação
   - Protocol Health: Integração cross-repo funcional

3. **Tratamento de Erro Robusto**
   - Frontend não quebra se API não estiver disponível
   - Modo degradado funcional em desenvolvimento

4. **Deploy Simples no Vercel**
   - 1 projeto = deploy direto
   - Root Directory = `.` (sem configuração especial)
   - API routes funcionam out-of-the-box

5. **Database Integrado**
   - Neon PostgreSQL serverless
   - Migrations automatizadas via `make migratedb`
   - Schema bem definido (`deploys`, `drafts`)

---

### ⚠️ Pontos de Atenção

1. **Protocol Health Check Requer Secret**
   - **Problema:** `NEO_ECOSYSTEM_TOKEN` não configurado = workflow falha silenciosamente
   - **Solução:** Documentar claramente a necessidade do secret

2. **Dependência de `make health`**
   - **Problema:** Workflow chama `make health` mas não sabemos se está implementado
   - **Recomendação:** Validar implementação do comando

3. **API Routes Apenas em Produção**
   - **Status Atual:** Funcionam apenas com `vercel dev` ou em deploy
   - **Desenvolvimento:** Usar `make dev-vercel` para testar API localmente

---

### 🔧 Recomendações de Melhoria

#### Curto Prazo

1. **Validar `make health`**
   ```bash
   # Verificar se comando existe e funciona
   make health
````

2. **Documentar Secret Necessário**

   - Adicionar ao `README.md` ou `docs/DEPLOY_DASHBOARD.md`
   - Instruções claras de como criar PAT do GitHub

3. **Testar Workflows Localmente**
   ```bash
   # Usar act (https://github.com/nektos/act)
   act -W .github/workflows/docs-guard.yml
   act -W .github/workflows/protocol-health.yml
   ```

#### Médio Prazo

1. **Monitoramento de Deploys**

   - Adicionar notificações de sucesso/falha de deploy
   - Integração com Slack/Discord (opcional)

2. **Testes Automatizados**

   - Adicionar testes E2E para workflows
   - Validar que API routes funcionam após deploy

3. **Health Check Endpoint**
   - Adicionar `/api/health` para monitoramento
   - Verificar conexão com DB, status de serviços

---

### 📈 Métricas de Saúde

| Métrica                  | Status | Nota                                         |
| ------------------------ | ------ | -------------------------------------------- |
| **Workflows Funcionais** | ✅     | Docs Guard OK, Protocol Health requer secret |
| **Deploy Dashboard**     | ✅     | Funcional com API routes                     |
| **Tratamento de Erro**   | ✅     | Robusto e silencioso                         |
| **Documentação**         | ✅     | Bem documentado                              |
| **Database Integration** | ✅     | Neon configurado, migrations funcionais      |
| **API Routes**           | ✅     | Funcionam em produção e `vercel dev`         |

---

### 🎯 Conclusão

A arquitetura atual é **sólida e bem estruturada** para um projeto em fase de desenvolvimento. A migração para repositório único simplificou significativamente o deploy e a manutenção.

**Principais Destaques:**

- ✅ Arquitetura clara e focada
- ✅ Deploy simples e direto
- ✅ Tratamento de erro robusto
- ✅ Documentação completa
- ✅ Database integrado com migrations

**Principais Desafios:**

- ⚠️ Protocol Health requer secret configurado
- ⚠️ Validação de `make health` pendente

**Recomendação Geral:** ✅ **Arquitetura pronta para produção**, com pequenos ajustes de configuração e validação.

---

**Última atualização:** Janeiro 2026 (pós-migração multi-repos)  
**Repositórios Relacionados:**

- **Landing:** `neo-smart-factory/smart-ui-landing`
- **Mobile:** `neo-smart-factory/smart-ui-mobile`
