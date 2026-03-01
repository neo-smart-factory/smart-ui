# 🎛️ Guia de Administração e Gerenciamento — NΞØ Smart Factory

**Data:** 2026-01-26  
**Status:** Ativo  
**Versão:** 1.0  
**Audiência:** Administradores de Sistema, Product Owners

Este guia descreve como gerenciar e monitorar os recursos críticos do ecossistema NΞØ Smart Factory, incluindo Banco de Dados, APIs de IA e Infraestrutura Blockchain.

---

## 1. 📊 Monitoramento Operacional (Ops Dashboard)

O painel de monitoramento está integrado diretamente na interface principal.

- **Localização:** Seção "Protocol Intel" no Dashboard.
- **Função:** Exibe o status em tempo real dos componentes (Core Engine, Web3, AI, Database).
- **Ação:** Clique em **"Neural Link Active"** ou no ícone da **Cérebro (BrainCircuit)** para abrir o **Intelligence Modal**.
  - **Alchemy Pulse:** Mostra o preço do gás na rede Base e o número do bloco atual.
  - **Tavily Research:** Mostra gaps de mercado e fontes de inteligência detectadas por IA.

---

## 2. 🔑 Gerenciamento de Chaves e APIs

As credenciais são gerenciadas via variáveis de ambiente.

### 2.1 Alchemy (Blockchain)

- **Console:** [Alchemy Dashboard](https://dashboard.alchemy.com/)
- **Variável:** `NEXT_PUBLIC_ALCHEMY_ID`
- **Uso:** RPC para redes Base e monitoramento on-chain.

### 2.2 Tavily (AI Research)

- **Console:** [Tavily Dashboard](https://tavily.com/dashboard)
- **Variável:** `TAVILY_API_KEY`
- **Uso:** Pesquisa de mercado, validação de nomes de tokens e geração de whitepapers.

### 2.3 Modal (AI Compute)

- **Console:** [Modal Dashboard](https://modal.com/)
- **Variáveis:** `MODAL_TOKEN_ID`, `MODAL_TOKEN_SECRET`, `MODAL_API_URL`
- **Uso:** Execução de modelos de IA para análise de código e diagnósticos do "Doctor AI".

---

## 3. 🗄️ Banco de Dados (Neon.tech)

Utilizamos o **Neon.tech** para PostgreSQL Serverless.

- **Console:** [Neon Console](https://console.neon.tech/)
- **Ações Comuns:**
  - **Logs:** Ver logs de consultas lentas ou erros de conexão.
  - **Snapshot:** Restaurar o banco de dados em caso de falha crítica.
  - **Variável:** `DATABASE_URL` (Sempre use a versão com `?sslmode=require`).

---

## 4. 🛠️ Comandos de Verificação (Health Check)

Sempre que houver suspeita de instabilidade, execute o script de verificação de features:

```bash
# Executa teste real em Tavily, Alchemy e Postgres
node --env-file=.env scripts/verify-features.js
```

Se todos retornarem `✅ PASSED`, o problema provavelmente está no frontend ou em configurações específicas de rede do usuário.

---

## 5. 🚀 Gerenciamento de Deploy (Vercel)

O painel da Vercel é o hub central para gerenciamento do site.

- **Console:** [Vercel Dashboard](https://vercel.com/)
- **Logs de Produção:** [Vercel Logs](https://vercel.com/dashboard/logs)
- **Sincronização Local:**
  Para puxar as variáveis de ambiente mais recentes da produção para o seu `.env.local`:
  ```bash
  vercel env pull .env.local
  ```

---

## 🛡️ Políticas de Segurança

1. **Rotação de Keys:** Recomenda-se rotacionar a `TAVILY_API_KEY` a cada 90 dias.
2. **Access Control:** Acesso ao banco de dados Neon deve ser restrito ao IP da Vercel e IPs de administradores autorizados.
3. **Audit Trail:** Todas as mudanças em variáveis de ambiente na Vercel são logadas e devem ser revisadas semanalmente.

---

**Assinado:** NΞØ Node Architecture Team  
**Data de Última Revisão:** 26 de Janeiro de 2026
