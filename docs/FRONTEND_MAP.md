# NΞØ Smart UI — Mapa de Navegação

**Data:** 2026-01-24  
**Status:** Ativo  
**Categoria:** Guia  
**Audiência:** Desenvolvedores

> **⚠️ Atualizado:** Este documento reflete a estrutura atual após a migração para multi-repos (2026-01-24).

Este documento serve como guia operacional para desenvolvedores que acessam o repositório `smart-ui` (Dashboard).

---

## 🗺️ Arquitetura de Front-End

Após a migração para multi-repos, o ecossistema NΞØ Smart Factory está dividido em **3 repositórios independentes**:

### 1. smart-ui (Dashboard) — Este Repositório

- **Repositório:** [neo-smart-factory/smart-ui](https://github.com/neo-smart-factory/smart-ui)
- **Stack:** React + Vite + Tailwind CSS
- **Uso:** Dashboard interno e visualização da saúde do protocolo. Interface de demonstração (Demo & Intent Layer).
- **Comando:** `npm run dev` (Porta 3000)
- **Deploy:** Vercel (smart-ui-dashboard)

### 2. smart-ui-landing (Landing Page)

- **Repositório:** [neo-smart-factory/smart-ui-landing](https://github.com/neo-smart-factory/smart-ui-landing)
- **Stack:** React + Vite
- **Uso:** Marketing, captura de leads e narrativa do protocolo. Otimizada para SEO.
- **Status:** Repositório separado

### 3. smart-ui-mobile (Mobile App)

- **Repositório:** [neo-smart-factory/smart-ui-mobile](https://github.com/neo-smart-factory/smart-ui-mobile)
- **Stack:** Vue 3 + Nuxt 3
- **Uso:** Interface de criação de tokens para o usuário final. Focada em PWA e mobile/Telegram.
- **Status:** Repositório separado

---

## 📋 Estrutura Atual do smart-ui

Este repositório (`smart-ui`) contém apenas o **Dashboard**:

```
smart-ui/
├── src/              # Código do Dashboard
├── api/              # Vercel Serverless Functions
├── migrations/       # Database schema
├── docs/             # Documentação
└── ...
```

**Não contém mais:**

- ❌ `/landing` (movido para `smart-ui-landing`)
- ❌ `/nuxt-app` (movido para `smart-ui-mobile`)

---

## 🔗 Referências

- [Migração para Multi-Repos](./archive/MIGRATION_TO_MULTI_REPOS.md) — Histórico da migração
- [README Principal](../README.md) — Visão geral do projeto
- [ADR 0002](./adr/0002-ui-as-demo-and-intent-layer.md) — Definição do Smart UI como Demo Layer

---

_NΞØ Protocol — Operações Cirúrgicas Web3_
