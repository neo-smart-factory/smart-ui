# 📡 API Routes - Marketing & Analytics

**Data:** 2026-01-24  
**Status:** Ativo  
**Categoria:** API  
**Audiência:** Desenvolvedores

Documentação das novas API routes para marketing e recuperação de usuários.

---

## 🎯 Rotas Disponíveis

| Rota             | Método    | Descrição                      |
| ---------------- | --------- | ------------------------------ |
| `/api/leads`     | GET, POST | Criar/atualizar/buscar leads   |
| `/api/events`    | GET, POST | Registrar eventos de conversão |
| `/api/sessions`  | GET, POST | Gerenciar sessões de usuário   |
| `/api/analytics` | GET       | Analytics e métricas           |

---

## 1️⃣ `/api/leads` - Gerenciamento de Leads

### POST - Criar/Atualizar Lead

**Quando usar:** Na primeira visita do usuário (mesmo sem wallet).

```javascript
// Criar lead na primeira visita
const response = await fetch("/api/leads", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    session_id: "abc123...", // Obrigatório
    email: "user@example.com", // Opcional
    ip_address: "192.168.1.1", // Opcional
    user_agent: navigator.userAgent,
    referrer: document.referrer,
    utm_source: "google", // Opcional
    utm_medium: "cpc", // Opcional
    utm_campaign: "summer2024", // Opcional
    conversion_status: "visitor", // Opcional (default: 'visitor')
  }),
});

const lead = await response.json();
// { id: 1, session_id: 'abc123...', email: '...', ... }
```

**Atualizar lead (mesmo session_id):**

```javascript
// Quando usuário conecta wallet ou progride no funil
await fetch("/api/leads", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    session_id: "abc123...",
    wallet_address: "0x123...", // Quando conectar wallet
    conversion_status: "wallet_connected", // Atualizar status
  }),
});
```

### GET - Buscar Lead

```javascript
// Por session_id
const lead = await fetch("/api/leads?session_id=abc123").then((r) => r.json());

// Por wallet_address
const lead = await fetch("/api/leads?wallet_address=0x123...").then((r) =>
  r.json()
);

// Por email
const lead = await fetch("/api/leads?email=user@example.com").then((r) =>
  r.json()
);
```

---

## 2️⃣ `/api/events` - Eventos de Conversão

### POST - Registrar Evento

**Quando usar:** Para cada ação importante do usuário no funil.

```javascript
// Evento: Usuário visitou a página
await fetch("/api/events", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    lead_id: 1, // Opcional (se lead já existe)
    session_id: "abc123...", // Obrigatório se não tiver lead_id
    event_type: "page_view",
    event_data: {
      page: "/",
      timestamp: new Date().toISOString(),
    },
  }),
});

// Evento: Tentou conectar wallet
await fetch("/api/events", {
  method: "POST",
  body: JSON.stringify({
    lead_id: 1,
    event_type: "wallet_connect",
    event_data: { provider: "metamask" },
  }),
});

// Evento: Começou a preencher form
await fetch("/api/events", {
  method: "POST",
  body: JSON.stringify({
    lead_id: 1,
    event_type: "form_start",
  }),
});

// Evento: Progresso no form
await fetch("/api/events", {
  method: "POST",
  body: JSON.stringify({
    lead_id: 1,
    event_type: "form_step_2", // form_step_1, form_step_2, etc.
    event_data: { step: 2, fields_filled: ["tokenName", "tokenSymbol"] },
  }),
});

// Evento: Abandonou o form
await fetch("/api/events", {
  method: "POST",
  body: JSON.stringify({
    lead_id: 1,
    event_type: "form_abandon",
    event_data: { step_reached: 2, time_spent: 120 },
  }),
});

// Evento: Criou token
await fetch("/api/events", {
  method: "POST",
  body: JSON.stringify({
    lead_id: 1,
    event_type: "token_created",
    event_data: { contract_address: "0x...", network: "base" },
  }),
});
```

**Tipos de eventos suportados:**

- `page_view` - Visitou a página
- `wallet_connect` - Tentou conectar wallet
- `form_start` - Começou a preencher form
- `form_step_1`, `form_step_2`, etc. - Progresso no form
- `form_abandon` - Abandonou o form
- `token_created` - Criou token com sucesso

### GET - Buscar Eventos

```javascript
// Eventos de um lead específico
const events = await fetch("/api/events?lead_id=1").then((r) => r.json());

// Eventos de uma sessão
const events = await fetch("/api/events?session_id=abc123").then((r) =>
  r.json()
);

// Eventos de um tipo específico
const events = await fetch("/api/events?event_type=form_abandon").then((r) =>
  r.json()
);

// Limitar resultados
const events = await fetch("/api/events?limit=50").then((r) => r.json());
```

---

## 3️⃣ `/api/sessions` - Sessões de Usuário

### POST - Criar/Atualizar Sessão

**Quando usar:** Para rastrear a jornada do usuário no formulário.

```javascript
// Criar sessão quando usuário começa a preencher
await fetch("/api/sessions", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    lead_id: 1, // Opcional
    session_id: "abc123...", // Obrigatório
    step_reached: 1,
    form_data_snapshot: {
      tokenName: "My Token",
      tokenSymbol: "MTK",
    },
    time_on_page: 45, // segundos
    conversion_funnel: {
      step1_at: "2026-01-23T10:00:00Z",
      step2_at: "2026-01-23T10:01:00Z",
    },
  }),
});

// Marcar como abandonada
await fetch("/api/sessions", {
  method: "POST",
  body: JSON.stringify({
    session_id: "abc123...",
    abandoned_at: new Date().toISOString(),
    step_reached: 2,
  }),
});

// Marcar como completada
await fetch("/api/sessions", {
  method: "POST",
  body: JSON.stringify({
    session_id: "abc123...",
    completed_at: new Date().toISOString(),
    step_reached: 4,
  }),
});
```

### GET - Buscar Sessão

```javascript
const session = await fetch("/api/sessions?session_id=abc123").then((r) =>
  r.json()
);
```

---

## 4️⃣ `/api/analytics` - Analytics e Métricas

### GET - Métricas

```javascript
// Funnel de conversão
const funnel = await fetch("/api/analytics?type=funnel").then((r) => r.json());
// {
//   visitors: 1000,
//   engaged: 800,
//   wallet_connected: 300,
//   draft_started: 250,
//   token_created: 50,
//   conversion_rate: 5.0
// }

// Leads abandonados (para recuperação)
const abandoned = await fetch(
  "/api/analytics?type=abandoned&hours=24&limit=50"
).then((r) => r.json());
// Array de leads com email, dados preenchidos, etc.

// Leads com email (para campanhas)
const marketable = await fetch("/api/analytics?type=marketable&limit=100").then(
  (r) => r.json()
);

// Eventos por tipo (últimos 30 dias)
const events = await fetch("/api/analytics?type=events&days=30").then((r) =>
  r.json()
);

// Resumo geral
const summary = await fetch("/api/analytics?type=summary").then((r) =>
  r.json()
);
// {
//   total_leads: 1000,
//   leads_with_email: 300,
//   converted: 50,
//   abandoned_sessions: 200,
//   active_subscriptions: 250,
//   events_last_24h: 500
// }

// Resumo padrão (sem type)
const summary = await fetch("/api/analytics").then((r) => r.json());
```

---

## 🔄 Fluxo Completo de Integração

### 1. Primeira Visita (sem wallet)

```javascript
// Gerar session_id único
const sessionId =
  localStorage.getItem("session_id") ||
  `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
localStorage.setItem("session_id", sessionId);

// Criar lead
const lead = await fetch("/api/leads", {
  method: "POST",
  body: JSON.stringify({
    session_id: sessionId,
    user_agent: navigator.userAgent,
    referrer: document.referrer,
    conversion_status: "visitor",
  }),
}).then((r) => r.json());

// Registrar evento
await fetch("/api/events", {
  method: "POST",
  body: JSON.stringify({
    lead_id: lead.id,
    session_id: sessionId,
    event_type: "page_view",
  }),
});
```

### 2. Usuário Interage com Form

```javascript
// Atualizar status para 'engaged'
await fetch("/api/leads", {
  method: "POST",
  body: JSON.stringify({
    session_id: sessionId,
    conversion_status: "engaged",
  }),
});

// Registrar evento
await fetch("/api/events", {
  method: "POST",
  body: JSON.stringify({
    lead_id: lead.id,
    event_type: "form_start",
  }),
});

// Criar sessão
await fetch("/api/sessions", {
  method: "POST",
  body: JSON.stringify({
    lead_id: lead.id,
    session_id: sessionId,
    step_reached: 1,
  }),
});
```

### 3. Usuário Conecta Wallet

```javascript
// Atualizar lead com wallet
await fetch("/api/leads", {
  method: "POST",
  body: JSON.stringify({
    session_id: sessionId,
    wallet_address: userAddress,
    conversion_status: "wallet_connected",
  }),
});

// Registrar evento
await fetch("/api/events", {
  method: "POST",
  body: JSON.stringify({
    lead_id: lead.id,
    event_type: "wallet_connect",
  }),
});
```

### 4. Usuário Preenche Form (auto-save)

```javascript
// Atualizar sessão com snapshot
await fetch("/api/sessions", {
  method: "POST",
  body: JSON.stringify({
    session_id: sessionId,
    step_reached: 2,
    form_data_snapshot: formData, // { tokenName, tokenSymbol, ... }
  }),
});

// Registrar progresso
await fetch("/api/events", {
  method: "POST",
  body: JSON.stringify({
    lead_id: lead.id,
    event_type: "form_step_2",
  }),
});
```

### 5. Usuário Abandona

```javascript
// Detectar abandono (timeout, fechou página, etc.)
await fetch("/api/sessions", {
  method: "POST",
  body: JSON.stringify({
    session_id: sessionId,
    abandoned_at: new Date().toISOString(),
    step_reached: 2,
  }),
});

// Registrar evento
await fetch("/api/events", {
  method: "POST",
  body: JSON.stringify({
    lead_id: lead.id,
    event_type: "form_abandon",
    event_data: { step_reached: 2 },
  }),
});
```

### 6. Usuário Cria Token

```javascript
// Atualizar lead para 'token_created'
await fetch("/api/leads", {
  method: "POST",
  body: JSON.stringify({
    session_id: sessionId,
    conversion_status: "token_created",
  }),
});

// Marcar sessão como completada
await fetch("/api/sessions", {
  method: "POST",
  body: JSON.stringify({
    session_id: sessionId,
    completed_at: new Date().toISOString(),
  }),
});

// Registrar evento
await fetch("/api/events", {
  method: "POST",
  body: JSON.stringify({
    lead_id: lead.id,
    event_type: "token_created",
    event_data: { contract_address: "0x...", network: "base" },
  }),
});
```

---

## 📊 Uso para Marketing

### Buscar Leads Abandonados para Email

```javascript
// Buscar leads que abandonaram há 24-72 horas
const abandoned = await fetch(
  "/api/analytics?type=abandoned&hours=24&limit=100"
).then((r) => r.json());

// Filtrar por email
const withEmail = abandoned.filter((lead) => lead.email);

// Enviar email de recuperação
for (const lead of withEmail) {
  // Usar dados do lead para personalizar email
  sendRecoveryEmail({
    to: lead.email,
    subject: `Continue criando ${lead.token_config?.tokenName || "seu token"}`,
    data: {
      tokenName: lead.token_config?.tokenName,
      stepReached: lead.last_step_reached,
      recoveryLink: `https://app.com/continue?session=${lead.session_id}`,
    },
  });
}
```

### Analytics de Conversão

```javascript
// Ver funnel completo
const funnel = await fetch("/api/analytics?type=funnel").then((r) => r.json());

console.log(`Taxa de conversão: ${funnel.conversion_rate}%`);
console.log(`Abandono no step 1: ${funnel.visitors - funnel.engaged}`);
console.log(
  `Abandono após wallet: ${funnel.wallet_connected - funnel.draft_started}`
);
```

---

## 🐛 Tratamento de Erros

Todas as rotas retornam erros padronizados:

```javascript
// Erro de validação
{
  error: "session_id is required";
} // 400

// Erro de servidor
{
  error: "Failed to save lead";
} // 500

// Banco não conectado
{
  error: "Database connection not authenticated";
} // 503
```

**Tratamento no frontend:**

```javascript
try {
  const response = await fetch('/api/leads', { ... });
  if (!response.ok) {
    const error = await response.json();
    console.error('API Error:', error.error);
    // Não bloquear UX - continuar em modo degradado
    return;
  }
  const data = await response.json();
  // Usar dados
} catch (error) {
  // Silenciosamente falhar em dev mode (API routes não disponíveis)
  if (error.message.includes('Failed to fetch')) {
    return; // Expected in vite dev
  }
  console.error('Unexpected error:', error);
}
```

---

## ✅ Checklist de Implementação

- [ ] Gerar `session_id` no primeiro load
- [ ] Criar lead na primeira visita
- [ ] Atualizar lead quando conectar wallet
- [ ] Registrar eventos importantes (page_view, wallet_connect, form_start, etc.)
- [ ] Criar/atualizar sessão ao preencher form
- [ ] Detectar abandono (beforeunload, timeout)
- [ ] Atualizar status para 'token_created ao criar token
- [ ] Usar analytics para campanhas de recuperação

---

**Próximo passo:** Integrar essas APIs no frontend (`src/App.jsx`)! 🚀
