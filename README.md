# NΞØ SMART FACTORY — Interface de Gestão e Fábrica de Tokens

```
==============================================
      AVISO DE STATUS ARQUITETURAL
==============================================
```

Este repositório está **intencionalmente congelado** em termos de **estrutura e arquitetura**.

O Smart UI é classificado como **Demo and Intent Layer**, conforme definido em:
• `ADR 0002 — Smart UI as Demo and Intent Layer` (ver `docs/adr/0002-ui-as-demo-and-intent-layer.md`)

```
----------------------------------------------------------------
 O QUE ISSO SIGNIFICA
----------------------------------------------------------------
Este repositório é um **projeto ativo** para desenvolvimento de UI/UX e features de interface, mas com limites arquiteturais claros:

- **Estrutura e arquitetura:** Congeladas (arquitetura NEØ)
- **Lógica de protocolo:** Não pode ser adicionada (autoridade está no core)
- **Transações reais:** Suportadas quando `phase2.web3` e `phase2.realTransactions` estão ativas e existe signer conectado
- **Fallback operacional:** Se Web3/signer não estiver disponível, o fluxo entra em simulation mode

Desenvolvimento permitido: UI/UX, features de interface, integração de wallet, tracking/analytics e API routes de suporte.
```

```
----------------------------------------------------------------
 MUDANÇAS PERMITIDAS
----------------------------------------------------------------
 [✓] Correções críticas de build
 [✓] Atualizações de segurança de dependências
 [✓] Melhorias de UI/UX
 [✓] Features de interface (sem lógica de protocolo)
 [✓] Tracking e analytics
 [✓] Rotulagem explícita de demo/simulação
```

```
----------------------------------------------------------------
 MUDANÇAS PROIBIDAS
----------------------------------------------------------------
 [✗] Modificar estrutura de pastas (arquitetura NEØ)
 [✗] Adicionar lógica de protocolo/autoridade
 [✗] Integrações diretas com smart-core
 [✗] Transferir autoridade de protocolo para este repositório
 [✗] Expandir backend como infraestrutura de produção
```

**Qualquer mudança fora deste escopo requer uma decisão arquitetural explícita (ADR).**

==============================================

## 🌐 Visão Geral

A **NΞØ Smart Factory** é uma interface de gestão para criação de ativos no ecossistema NEO. A aplicação opera como camada de orquestração de UI com suporte multichain e integração Web3.

**Importante:** O runtime atual é **híbrido**. Quando wallet e signer estão disponíveis, executa fluxo on-chain; quando não estão, usa simulation mode como fallback seguro.

## 🚀 Estética e Design

```
─────────────────────────────────────────────
 ▓▓▓ VISUAL
──────────────────────────────────────────────
 └─ Tema: Modo Escuro (Obsidian)
 └─ Destaque: Neon Acid (#D8F244)
 └─ Efeitos: Glassmorphism e Gradientes Cinéticos
 └─ Interações: Micro-animações fluidas
──────────────────────────────────────────────
```

## 🛠️ Stack Técnica

```
──────────────────────────────────────────────
 ▓▓▓ TECNOLOGIAS
──────────────────────────────────────────────
 └─ Build Tool: Vite 7.3.1 (ultra-rápido HMR)
 └─ Framework: React 18 + Vite
 └─ Escopo: Dashboard Principal (src/)
      + API routes (api/)
 └─ Estilo: Tailwind CSS + Design Tokens Customizados
 └─ Ícones: Lucide React
 └─ Web3: Dynamic.xyz + Wagmi + Ethers.js v6
 └─ Database: Neon PostgreSQL (persistência operacional + analytics)
──────────────────────────────────────────────
```

## 📦 Funcionalidades Demonstradas

```
==============================================
    STATUS DE IMPLEMENTAÇÃO - v0.5.6
==============================================

[####] FABRICA MULTICHAIN ................................................. OK
       Suporte ativo para Ethereum, Polygon e Base via Wagmi config

[####] COMPILACAO DE CONTRATOS ............................................ OK
       Interface para configurar e compilar novos tokens sem código
       Fluxo real com signer + fallback para simulação quando indisponível

[####] GERADOR DE ATIVOS .................................................. OK
       Criação automática de planos de marketing e rascunhos de whitepaper
       ⚠️ Funcionalidade de demonstração

[####] PRONTO PARA MINIAPP ................................................ OK
       Design responsivo otimizado para frames do Telegram MiniApp

[####] MARKETING & ANALYTICS .............................................. OK
       Sistema completo de tracking de leads, eventos e recuperação de usuários
       ✅ Funcional (captura visitantes, eventos, abandono)
```

```
==============================================
STATUS: 5/5 funcionalidades demonstradas
==============================================
```

## 🏃 Como Rodar Localmente

```bash
make install
make dev-vercel   # Inicia com API routes (Recomendado)
make dev          # Apenas frontend (Vite puro)
```

**Guia Detalhado:** Veja [docs/guides/DEVELOPMENT.md](docs/guides/DEVELOPMENT.md).

**Deploy:** Veja [docs/guides/DEPLOYMENT.md](docs/guides/DEPLOYMENT.md).

```
## 📐 Arquitetura do Sistema
```

```
┌─────────────────────────────────────────────
│              ARQUITETURA DO SISTEMA
└─────────────────────────────────────────────

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 FRONTEND
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Dashboard NΞØ Smart UI
 (React 18 + Vite 7.3.1)
 Hybrid Mode (on-chain + simulation fallback)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                    │
                    ▼
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 API LAYER (Vercel Serverless Functions)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 ⚠️ Para demo/persistência temporária _(não autoritativo)_

 ┌───────────┐  ┌───────────┐  ┌───────────┐
 │/api/deploy│  │/api/draft │  │ /api/leads│
 └─────┬─────┘  └─────┬─────┘  └─────┬─────┘
       │              │              │
       └──────────────┴──────────────┘
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                    │
                    ▼
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 DATABASE (Neon PostgreSQL)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Neon Database (PostgreSQL)
 ⚠️ Persistência demo/analytics (não autoritativo)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

```
**Nota sobre APIs e Database:**
- As API routes (`/api/*`) são **funcionais** e conectam a um **database real** (Neon)
- Elas servem para: persistência operacional, tracking de marketing, analytics e histórico de deploy
- A autoridade do protocolo permanece fora deste repositório (smart-core / contratos)
- Este backend não substitui camadas de custódia, policy e governança de produção

## 📜 Atribuição e Licença

Este projeto está licenciado sob a **Licença MIT**.

## 📦 Repositórios Relacionados
```

```
──────────────────────────────────────────────
 ▓▓▓ ECOSSISTEMA NEØ SMART FACTORY
──────────────────────────────────────────────
 └─ Dashboard (este repo)
    └─ https://github.com/neo-smart-factory/smart-ui
    └─ Interface de gestão (modo híbrido)
 └─ Landing Page
    └─ https://github.com/neo-smart-factory/
       smart-ui-landing
    └─ Página pública de marketing
 └─ Mobile App
    └─ https://github.com/neo-smart-factory/
       smart-ui-mobile
   └─ PWA mobile-first
──────────────────────────────────────────────
```

## ❓ Perguntas Frequentes

**Este dashboard executa transações reais?**  
Sim, quando `phase2.web3=true`, `phase2.realTransactions=true` e há signer conectado. Sem esses pré-requisitos, cai para simulation mode.

**Posso usar isso em produção?**  
Sim, como camada de interface e orquestração. A autoridade crítica de protocolo continua no smart-core.

**O database armazena dados reais?**  
Sim, para analytics, tracking, drafts e histórico operacional de deploy.

**Posso contribuir com melhorias de UI?**  
Sim! Veja a seção "MUDANÇAS PERMITIDAS" no aviso arquitetural.

---

<div align="center">

## NΞØ SMART FACTORY

**Transformando código em ativos líquidos.**

[![Website](https://img.shields.io/badge/Website-nsfactory.xyz-D8F244?style=flat-square&logo=internet-explorer&logoColor=000)](https://nsfactory.xyz)
[![GitHub](https://img.shields.io/badge/GitHub-neo--smart--token--factory-C0E030?style=flat-square&logo=github&logoColor=000)](https://github.com/neo-smart-factory)
[![Twitter](https://img.shields.io/badge/Twitter-@nsfactory.xyz-A8C81C?style=flat-square&logo=twitter&logoColor=000)](https://x.com/nsfactory_xyz)
[![Email](https://img.shields.io/badge/Email-team@nsfactory.xyz-90B008?style=flat-square&logo=gmail&logoColor=000)](mailto:team@nsfactory.xyz)

</div>

---

**Build v0.5.6** — _Demonstrando a transformação de código em ativos._  
**Status:** Demo and Intent Layer — Hybrid Mode (Web3 LIVE + simulation fallback)
**Official Domain:** [www.nsfactory.xyz](https://www.nsfactory.xyz)

## Canonical Token Metadata Update

FlowPay (NEOPAY) was registered as canonical token metadata in `config/ecosystem.json`.

- `smart-core`: added `contracts.mainnet` (`FlowPay`, `NeoSmartFactoryRouter`) and `canonicalRegistry`.
- `flowpay`: added `contracts.mainnet.FlowPay` and `tokenCanonical` (`symbol: NEOPAY`, Base chain `8453`, canonical contract address).

## Test Coverage (Issues #17 and #18)

Test suite now includes wallet-critical flows and address validation:

- `src/components/__tests__/WalletConnect.test.jsx`: connection and disconnection callbacks, simulation fallback mode.
- `src/utils/__tests__/addressValidation.test.js`: strict address validation, checksum normalization, formatting helpers.
- `src/hooks/__tests__/useDynamicWallet.test.js`: hook behavior with and without provider/authenticated wallet.
- `src/hooks/__tests__/useFeatures.test.js`: phase and feature gate behavior using environment flags.
- `src/components/__tests__/ErrorBoundary.test.jsx`: component crash fallback and reset flow.

Run locally:

```bash
npm run test:run
```
