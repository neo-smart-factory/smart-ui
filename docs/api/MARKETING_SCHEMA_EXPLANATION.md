# 📊 Marketing & User Recovery Schema - Explicação

**Data:** 2026-01-24  
**Status:** Ativo  
**Categoria:** Arquitetura  
**Audiência:** Desenvolvedores

---

## 🎯 Problema Identificado

O schema atual (`deploys` + `drafts`) só captura:

- ✅ Usuários que **conectaram wallet** (drafts)
- ✅ Tokens **criados com sucesso** (deploys)

**Faltava:**

- ❌ Visitantes que **não conectaram wallet**
- ❌ Email para **follow-up e campanhas**
- ❌ Tracking de **abandono** (onde pararam)
- ❌ Analytics de **conversão** (funnel)
- ❌ Dados para **recuperação de usuários**

---

## 🗄️ Novas Tabelas Propostas

### 1. `leads` - Prospecção Completa

**Propósito:** Capturar **TODOS** os visitantes, mesmo sem wallet.

**Campos principais:**

- `email`: Para campanhas de email marketing
- `wallet_address`: Se conectou depois (nullable)
- `session_id`: Identificador único da sessão (cookie/localStorage)
- `conversion_status`: Onde está no funil
  - `visitor` → Visitou a página
  - `engaged` → Interagiu com o form
  - `wallet_connected` → Conectou wallet
  - `draft_started` → Começou a preencher
  - `token_created` → Concluiu!
- `utm_source/medium/campaign`: Tracking de origem
- `metadata`: Dados flexíveis (JSONB)

**Quando criar:**

- Na primeira visita (mesmo sem wallet)
- Atualizar quando usuário progride no funil

---

### 2. `user_sessions` - Tracking de Jornada

**Propósito:** Rastrear cada sessão e onde o usuário abandonou.

**Campos principais:**

- `step_reached`: Qual step do formulário alcançou (1-4)
- `form_data_snapshot`: O que preencheu até abandonar
- `time_on_page`: Tempo em segundos
- `abandoned_at`: Quando abandonou (NULL se completou)
- `conversion_funnel`: JSON com timestamps de cada step

**Uso:**

- Identificar onde usuários abandonam mais
- Recuperar dados do que preencheram
- Analisar tempo médio por step

---

### 3. `email_subscriptions` - Newsletter/Follow-up

**Propósito:** Gerenciar campanhas de email marketing.

**Campos principais:**

- `email`: Email do lead
- `source`: De onde veio (landing_page, newsletter_form, etc.)
- `status`: active, unsubscribed, bounced
- `preferences`: Preferências de comunicação

**Uso:**

- Enviar emails de recuperação
- Newsletter
- Notificações de novos recursos

---

### 4. `conversion_events` - Analytics Detalhado

**Propósito:** Eventos importantes para análise.

**Eventos possíveis:**

- `page_view`: Visitou a página
- `wallet_connect`: Tentou conectar wallet
- `form_start`: Começou a preencher form
- `form_step_1`, `form_step_2`, etc.: Progresso no form
- `form_abandon`: Abandonou o form
- `token_created`: Criou token com sucesso

**Uso:**

- Analytics de conversão
- Identificar gargalos no funil
- A/B testing

---

## 🔄 Fluxo Completo com Marketing

```
┌─────────────────────────────────────────────────────────┐
│ 1. VISITANTE CHEGA (sem wallet)                        │
│    → Cria registro em `leads`                           │
│    → conversion_status = 'visitor'                     │
│    → Salva session_id, UTM, referrer                   │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│ 2. VISITANTE INTERAGE COM FORM                          │
│    → Atualiza `leads.conversion_status = 'engaged'`     │
│    → Cria `conversion_event` (form_start)              │
│    → Cria `user_session`                               │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│ 3. VISITANTE PREENCHE FORM (sem wallet ainda)          │
│    → Atualiza `user_session.step_reached`              │
│    → Salva `form_data_snapshot`                        │
│    → Cria `conversion_event` (form_step_1, step_2...)  │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│ 4A. ABANDONA (não conecta wallet)                       │
│    → Atualiza `user_session.abandoned_at`               │
│    → Atualiza `leads.conversion_status`                 │
│    → Salva `drafts` com `abandoned = true`             │
│    → Lead disponível para recuperação! 🎯              │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│ 4B. CONECTA WALLET                                      │
│    → Atualiza `leads.wallet_address`                    │
│    → Atualiza `leads.conversion_status = 'wallet_connected'`
│    → Cria/atualiza `drafts` (linka com lead_id)        │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│ 5. CRIA TOKEN                                           │
│    → Atualiza `leads.conversion_status = 'token_created'`
│    → Cria registro em `deploys` (linka com lead_id)    │
│    → Marca `user_session.completed_at`                  │
└─────────────────────────────────────────────────────────┘
```

---

## 📧 Recuperação de Usuários

### Cenário 1: Usuário abandonou sem wallet

**Dados disponíveis:**

- Email (se forneceu)
- O que preencheu (`form_data_snapshot`)
- Onde parou (`step_reached`)
- Quando abandonou (`abandoned_at`)

**Ação de marketing:**

```sql
-- Buscar leads abandonados para email
SELECT * FROM abandoned_leads
WHERE email IS NOT NULL
  AND hours_since_activity BETWEEN 24 AND 72;
```

**Email de recuperação:**

> "Olá! Você começou a criar seu token mas não concluiu. Quer continuar de onde parou? [Link com session_id]"

---

### Cenário 2: Usuário abandonou com wallet

**Dados disponíveis:**

- Wallet address
- Draft completo em `drafts`
- O que preencheu

**Ação:**

- Quando usuário volta e conecta mesma wallet → Carrega draft automaticamente
- Email opcional se forneceu

---

## 📊 Analytics para Marketing

### Funnel de Conversão

```sql
SELECT * FROM conversion_funnel;
```

**Resultado:**

```
visitors: 1000
engaged: 800
wallet_connected: 300
draft_started: 250
token_created: 50
conversion_rate: 5%
```

**Insights:**

- 20% abandona antes de interagir
- 62.5% não conecta wallet
- 16.7% abandona após conectar wallet
- Taxa de conversão final: 5%

---

### Leads para Campanha

```sql
SELECT * FROM marketable_leads
WHERE has_abandoned_draft = true
  AND email_status = 'active';
```

**Uso:**

- Lista de emails para campanha de recuperação
- Segmentação por origem (UTM)
- Personalização baseada no que preencheu

---

## 🎯 Benefícios para Marketing

1. **Prospecção:**

   - Captura TODOS os visitantes (não só com wallet)
   - Email para follow-up
   - Tracking de origem (UTM)

2. **Recuperação:**

   - Identifica quem abandonou
   - Sabe onde parou
   - Tem dados do que preencheu
   - Pode enviar email personalizado

3. **Analytics:**

   - Funnel completo de conversão
   - Identifica gargalos
   - Mede eficácia de campanhas
   - A/B testing

4. **Segmentação:**
   - Por origem (UTM)
   - Por comportamento (onde abandonou)
   - Por tempo (abandonou há X horas)
   - Por dados preenchidos

---

## 🚀 Próximos Passos

1. **Executar migration:**

   ```bash
   # Adicionar ao script de migrate ou executar manualmente
   psql $DATABASE_URL -f migrations/02_marketing_analytics.sql
   ```

2. **Atualizar frontend:**

   - Criar `session_id` no primeiro load
   - Criar `lead` na primeira visita
   - Atualizar `conversion_status` conforme progresso
   - Capturar email (formulário opcional)

3. **Criar API routes:**

   - `POST /api/leads` - Criar/atualizar lead
   - `POST /api/events` - Registrar eventos
   - `GET /api/leads/:session_id` - Buscar lead por sessão

4. **Integração com email:**
   - Resend, SendGrid, ou Mailchimp
   - Templates de recuperação
   - Automações baseadas em eventos

---

**Isso resolve o problema de marketing e recuperação de usuários!** 🎯
