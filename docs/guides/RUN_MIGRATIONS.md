# 🗄️ Executar Migrations - Opções

**Data:** 2026-01-24  
**Status:** Ativo  
**Categoria:** Guia  
**Audiência:** DevOps

Como você já tem as variáveis configuradas no Vercel, aqui estão as opções para executar as migrations:

> 💡 **Dica:** Se quiser trazer TODAS as variáveis do Vercel para `.env` local, use: `make sync-env`  
> Veja: [SYNC_ENV_FROM_VERCEL.md](./SYNC_ENV_FROM_VERCEL.md)

---

## Opção 1: Usando Vercel Dev (Recomendado) ⭐

O `vercel dev` carrega automaticamente as variáveis de ambiente do Vercel, então você não precisa criar `.env` local.

### Passo a Passo:

1. **Fazer login no Vercel (se ainda não fez):**
   ```bash
   vercel login
   ```

2. **Linkar o projeto (se ainda não linkou):**
   ```bash
   cd /caminho/para/neo-smart-factory/smart-ui
   vercel link
   ```
   - Escolha o projeto `smart-ui-dashboard`
   - Aceite as configurações padrão

3. **Executar migrations via Vercel Dev:**
   ```bash
   # O vercel dev carrega as variáveis do Vercel automaticamente
   vercel dev --listen 3000 &
   
   # Em outro terminal, executar migrations
   # (as variáveis estarão disponíveis via vercel dev)
   DATABASE_URL=$(vercel env pull --yes | grep DATABASE_URL | cut -d'=' -f2) pnpm run migrate
   ```

**⚠️ Nota:** Essa opção é mais complexa. Prefira a **Opção 2** ou **Opção 3**.

---

## Opção 2: Criar .env Local Temporário ⭐⭐

Criar `.env` local apenas para executar migrations, depois pode deletar.

### Passo a Passo:

1. **Obter DATABASE_URL do Vercel:**
   - Acesse: https://vercel.com → Seu projeto → Settings → Environment Variables
   - Copie o valor de `DATABASE_URL`

2. **Criar .env:**
   ```bash
   cd /caminho/para/neo-smart-factory/smart-ui
   echo 'DATABASE_URL="cole-aqui-sua-url-do-vercel"' > .env
   ```

3. **Executar migrations:**
   ```bash
   make migratedb
   ```

4. **Verificar sucesso:**
   ```text
   ✅ Tabelas "deploys" e "drafts" criadas ou já existem.
   📊 Status: 0 deploy(s) registrado(s).
   ```

5. **Opcional: Deletar .env (se quiser):**
   ```bash
   rm .env
   ```

---

## Opção 3: Executar Direto com Variável Inline ⭐⭐⭐

Executar migrations diretamente passando a DATABASE_URL como variável de ambiente.

### Passo a Passo:

1. **Obter DATABASE_URL do Vercel:**
   - Acesse: https://vercel.com → Seu projeto → Settings → Environment Variables
   - Copie o valor de `DATABASE_URL`

2. **Executar migrations:**
   ```bash
   cd /caminho/para/neo-smart-factory/smart-ui
   DATABASE_URL="cole-aqui-sua-url-do-vercel" pnpm run migrate
   ```

**✅ Vantagem:** Não precisa criar arquivo `.env`.

---

## Opção 4: Via Neon Console (SQL Direto)

Se preferir, pode executar o SQL diretamente no Neon Console.

### Passo a Passo:

1. Acesse: https://console.neon.tech → Seu projeto
2. Vá para **"SQL Editor"** ou **"Query"**
3. Cole e execute:

```sql
-- Tabela de Deploys (Histórico de Tokens Criados)
CREATE TABLE IF NOT EXISTS deploys (
    id SERIAL PRIMARY KEY,
    contract_address TEXT NOT NULL,
    owner_address TEXT NOT NULL,
    network TEXT NOT NULL,
    tx_hash TEXT NOT NULL,
    token_name TEXT NOT NULL,
    token_symbol TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Drafts (Rascunhos Salvamento Automático)
CREATE TABLE IF NOT EXISTS drafts (
    user_address TEXT PRIMARY KEY,
    token_config JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

4. Verificar:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

Deve mostrar: `deploys` e `drafts`.

---

## ✅ Recomendação

**Opção 3** (variável inline) é a mais rápida e não deixa arquivos locais.

**Opção 2** (`.env` temporário) é boa se você quiser testar localmente depois.

---

## 🧪 Verificar se Funcionou

Após executar migrations, verifique:

### Via Neon Console:
```sql
SELECT * FROM deploys LIMIT 1;
SELECT * FROM drafts LIMIT 1;
```

### Via API (após deploy):
```bash
curl https://seu-projeto.vercel.app/api/deploys
# Deve retornar: []
```

---

## 🐛 Troubleshooting

### Erro: "DATABASE_URL não definida"
- Verifique se copiou a URL completa do Vercel
- Verifique se a URL tem `?sslmode=require` no final

### Erro: "Connection refused"
- Verifique se o projeto Neon está ativo (não pausado)
- Verifique se a URL está correta

### Erro: "relation already exists"
- ✅ **Isso é OK!** Significa que as tabelas já existem
- As migrations são idempotentes (podem rodar múltiplas vezes)

---

**Qual opção você prefere?** Recomendo a **Opção 3** (mais rápida) ou **Opção 4** (via SQL direto no Neon).
