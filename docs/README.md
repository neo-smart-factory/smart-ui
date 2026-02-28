# NΞØ Smart Factory — Documentação Técnica

> **Repositório**: smart-ui  
> **Organização**: [neo-smart-factory](https://github.com/neo-smart-factory)  
> **Status**: Ativo

> 🗺️ **Navegação:** Para um índice visual completo de todos os documentos, veja [NAVIGATION_INDEX.md](./NAVIGATION_INDEX.md)

---

## 📚 Índice de Documentação

### 🏛️ Documentos Arquiteturais Fundamentais

#### [ARCHITECTURAL_ADDENDUMS.md](./ARCHITECTURAL_ADDENDUMS.md)

**Adendos Arquiteturais — Considerações Fundamentais**

Documento crítico que estabelece as posições técnicas e estratégicas do projeto sobre:

- MCP, Automação, MPC e Extensões de Carteiras
- KYC, Governança e Estratégia de Lançamento
- Organização Técnica e Governança Pública

**Complexidade**: ⭐⭐⭐⭐⭐ (Crítico)  
**Audiência**: Todos os stakeholders

---

#### [ORGANIZATION.md](./ORGANIZATION.md)

**Organização Técnica neo-smart-factory**

Descrição da organização pública que governa o projeto:
- Composição e perfil dos membros
- Atividades e repositórios
- Princípios de governança
- Como contribuir

**Complexidade**: ⭐⭐⭐  
**Audiência**: Contribuidores, parceiros, comunidade

---

### 📋 ADRs (Architecture Decision Records)

Decisões arquiteturais documentadas seguindo o padrão ADR.

#### [adr/0001-smart-ui-backend-boundary.md](./adr/0001-smart-ui-backend-boundary.md)
**Fronteira entre Smart UI e Backend**

Define a separação de responsabilidades entre frontend e backend.

---

#### [adr/0002-ui-as-demo-and-intent-layer.md](./adr/0002-ui-as-demo-and-intent-layer.md)
**UI como Camada de Demo e Intenção**

Estabelece o papel da UI como interface de demonstração e captura de intenção.

---

#### [adr/0003-wallet-extensions-mpc-automation-posture.md](./adr/0003-wallet-extensions-mpc-automation-posture.md)
**Postura sobre Extensões de Carteiras, MPC e Automação**

Formaliza a decisão de não adotar prematuramente:
- Wallet Snaps e extensões de terceiros
- MPC wallets experimentais
- Automação sem controle explícito

**Complexidade**: ⭐⭐⭐⭐⭐ (Crítico)  
**Status**: Aceito

---

#### [adr/0004-kyc-governance-strategy.md](./adr/0004-kyc-governance-strategy.md)
**Estratégia de KYC e Governança Estruturada**

Documenta a decisão de adotar modelo de início 100% estruturado com:
- KYC progressivo
- Controles de governança
- Conformidade regulatória

**Complexidade**: ⭐⭐⭐⭐⭐ (Crítico)  
**Status**: Aceito

---

### 📖 Documentação de Projeto

#### [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)
**Visão Geral do Projeto**

Introdução ao projeto, objetivos, arquitetura e componentes principais.

**Complexidade**: ⭐⭐  
**Audiência**: Novos contribuidores, stakeholders

---

#### [NEO_STRATEGIC_PLAN_V1.md](./NEO_STRATEGIC_PLAN_V1.md)
**Plano Estratégico v1**

Roadmap estratégico, fases de desenvolvimento e objetivos de longo prazo.

**Complexidade**: ⭐⭐⭐  
**Audiência**: Liderança, parceiros

---

#### [NEXT_STEPS.md](./NEXT_STEPS.md)
**Próximos Passos**

Lista de tarefas pendentes e próximas ações prioritárias.

**Complexidade**: ⭐  
**Audiência**: Time de desenvolvimento

---

### 🎨 Documentação de Frontend

#### [FRONTEND_MAP.md](./FRONTEND_MAP.md)
**Mapa de Frontends**

Descrição dos múltiplos frontends do projeto:
- Landing Page (React + Vite)
- Nuxt App (Vue 3 + Vite)
- App Principal (React + TypeScript + Web3)

**Complexidade**: ⭐⭐  
**Audiência**: Desenvolvedores frontend

---

#### [ADR 0002 — UI as Demo and Intent Layer](./adr/0002-ui-as-demo-and-intent-layer.md)
**Status da UI**

Estado atual da interface de usuário, features implementadas e pendentes.

**Complexidade**: ⭐  
**Audiência**: Time de desenvolvimento

---

#### [ui-diagnostic-checklist.md](./archive/ui-diagnostic-checklist.md) (Arquivado)
**Checklist de Diagnóstico da UI**

Lista de verificação para diagnóstico e validação da interface.

**Complexidade**: ⭐⭐  
**Audiência**: QA, desenvolvedores

---

#### [ECOSYSTEM_GRAPH_REPOS.md](./ECOSYSTEM_GRAPH_REPOS.md)
**Grafo de Repositórios e Conexões**

Nodes (repos da org), conexões e não conectados. Onde hospedar (smart-ui, ops, novo repo). Dados em `public/ecosystem-graph-data.js`.

**Complexidade**: ⭐  
**Audiência**: DevOps, governança

---

### 🗄️ Documentação de Infraestrutura

#### [DATABASE_SCHEMA.sql](./DATABASE_SCHEMA.sql)
**Schema do Banco de Dados**

Definição do schema PostgreSQL (Neon) para:
- Deploys
- Drafts
- Leads

**Complexidade**: ⭐⭐  
**Audiência**: Backend developers, DBAs

---

#### [GITHUB_ACTIONS_SETUP.md](./GITHUB_ACTIONS_SETUP.md)
**Configuração de GitHub Actions**

Guia para configurar CI/CD com GitHub Actions.

**Complexidade**: ⭐⭐  
**Audiência**: DevOps, desenvolvedores

---

## 🎯 Guia de Leitura por Perfil

### Para Novos Contribuidores
1. [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)
2. [ORGANIZATION.md](./ORGANIZATION.md)
3. [FRONTEND_MAP.md](./FRONTEND_MAP.md)

### Para Decisores Técnicos
1. [ARCHITECTURAL_ADDENDUMS.md](./ARCHITECTURAL_ADDENDUMS.md)
2. [ADRs completos](./adr/)
3. [NEO_STRATEGIC_PLAN_V1.md](./NEO_STRATEGIC_PLAN_V1.md)

### Para Parceiros e Stakeholders
1. [ARCHITECTURAL_ADDENDUMS.md](./ARCHITECTURAL_ADDENDUMS.md)
2. [ORGANIZATION.md](./ORGANIZATION.md)
3. [ADR 0004 - KYC Strategy](./adr/0004-kyc-governance-strategy.md)

### Para Desenvolvedores
1. [FRONTEND_MAP.md](./FRONTEND_MAP.md)
2. [DATABASE_SCHEMA.sql](./DATABASE_SCHEMA.sql)
3. [ui-diagnostic-checklist.md](./ui-diagnostic-checklist.md)

---

## 🔄 Processo de Atualização

### Documentos Vivos
Alguns documentos são atualizados frequentemente:
- `NEXT_STEPS.md`
- `adr/0002-ui-as-demo-and-intent-layer.md` (substitui ui-status.md)
- `archive/ui-diagnostic-checklist.md` (arquivado - desatualizado após migração multi-repos)

### Documentos Estáveis
Outros documentos são mais estáveis e requerem revisão formal:
- `ARCHITECTURAL_ADDENDUMS.md`
- ADRs (Architecture Decision Records)
- `NEO_STRATEGIC_PLAN_V1.md`

### Versionamento
- Documentos críticos devem incluir número de versão
- Mudanças significativas devem ser documentadas
- ADRs são imutáveis após aceitos (criar novo ADR para mudanças)

### Sync para o repositório docs

- [SYNC_POLICIES_TO_DOCS_REPO.md](./SYNC_POLICIES_TO_DOCS_REPO.md) — Envio da base de padrões, políticas, auditorias, organização e ADRs para [neo-smart-factory/docs](https://github.com/neo-smart-factory/docs).

---

## 📝 Como Contribuir com Documentação

### 1. Identifique a Necessidade

- Lacuna na documentação existente
- Nova decisão arquitetural
- Mudança significativa no projeto

### 2. Escolha o Formato Apropriado

- **ADR**: Para decisões arquiteturais
- **Guia**: Para tutoriais e how-tos
- **Referência**: Para especificações técnicas
- **Overview**: Para visões gerais

### 3. Siga os Padrões

- Use markdown com formatação consistente
- Inclua metadados (data, versão, status)
- Adicione links para documentos relacionados
- Use linguagem clara e objetiva

### 4. Revise e Submeta

- Revise ortografia e gramática
- Valide links
- Solicite revisão de pares
- Abra pull request

---

## 🔗 Links Úteis

### Organização

- [neo-smart-factory](https://github.com/neo-smart-factory)

### Repositórios

- [smart-ui](https://github.com/neo-smart-factory/smart-ui)
- [landing](https://github.com/neo-smart-factory/landing)
- [docs](https://github.com/neo-smart-factory/docs)

### Padrões

- [ADR Template](https://github.com/joelparkerhenderson/architecture-decision-record)
- [Markdown Guide](https://www.markdownguide.org/)

---

## 📦 Documentos Arquivados

Documentos históricos e relatórios de processos concluídos foram movidos para [`archive/`](./archive/):

- `MIGRATION_TO_MULTI_REPOS.md` - Migração monorepo → multi-repos (concluída)
- `archive/VALIDATION_REPORT.md` - Relatório intermediário de validação (arquivado)
- `archive/VALIDATION_FINAL_REPORT.md` - Relatório final de validação (arquivado)
- `archive/ANALISE_CONEXAO_DOCS_REPO.md` - Análise de conexão com repositório docs (arquivado)
- `archive/AUDITORIA_VISIBILIDADE_ORGANIZACAO.md` - Auditoria de visibilidade (arquivado)

Estes documentos são mantidos para referência histórica.

---

## 📊 Estatísticas da Documentação

- **Total de Documentos Ativos**: 28
- **ADRs**: 4
- **Documentos Arquivados**: 5
- **Guias Técnicos**: 8
- **Documentos Estratégicos**: 4

**Última Atualização**: 2026-01-24

---

**NΞØ SMART FACTORY** — Documentação é Infraestrutura
