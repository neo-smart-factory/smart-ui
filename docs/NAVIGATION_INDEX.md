# 🗺️ Índice Visual de Navegação — Documentação NΞØ Smart Factory

**Data:** 2026-01-24  
**Status:** Ativo  
**Categoria:** Guia  
**Audiência:** Todos

Este índice organiza toda a documentação do projeto de forma visual e navegável.

---

## 📚 Início Rápido

| Documento                                             | Descrição                   | Para Quem       |
| ----------------------------------------------------- | --------------------------- | --------------- |
| [README.md](./README.md)                              | Visão geral do projeto      | Todos           |
| [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)          | Visão técnica e estratégica | Desenvolvedores |
| [FRONTEND_MAP.md](./FRONTEND_MAP.md)                  | Mapa dos 3 frontends        | Desenvolvedores |
| [ADR 0002](./adr/0002-ui-as-demo-and-intent-layer.md) | UI as Demo and Intent Layer | Todos           |

---

## 🏗️ Arquitetura e Decisões

### Arquitetura Geral

| Documento                                                                              | Descrição                          | Status   |
| -------------------------------------------------------------------------------------- | ---------------------------------- | -------- |
| [ARCHITECTURAL_ADDENDUMS.md](./ARCHITECTURAL_ADDENDUMS.md)                             | Adendos arquiteturais fundamentais | ✅ Ativo |
| [ARCHITECTURE_WORKFLOWS_AND_DEPLOYMENT.md](./ARCHITECTURE_WORKFLOWS_AND_DEPLOYMENT.md) | Workflows GitHub e Deploy          | ✅ Ativo |
| [NEO_STRATEGIC_PLAN_V1.md](./NEO_STRATEGIC_PLAN_V1.md)                                 | Plano estratégico de arquitetura   | ✅ Ativo |

### Architecture Decision Records (ADRs)

| ADR                                                            | Título                             | Descrição                           |
| -------------------------------------------------------------- | ---------------------------------- | ----------------------------------- |
| [0001](./adr/0001-smart-ui-backend-boundary.md)                | Smart UI Backend Boundary          | Define limites do backend no UI     |
| [0002](./adr/0002-ui-as-demo-and-intent-layer.md)              | UI as Demo and Intent Layer        | Classifica o UI como camada de demo |
| [0003](./adr/0003-wallet-extensions-mpc-automation-posture.md) | Wallet Extensions & MPC Automation | Estratégia de wallets e automação   |
| [0004](./adr/0004-kyc-governance-strategy.md)                  | KYC & Governance Strategy          | Estratégia de KYC e governança      |

---

## 🚀 Deploy e Infraestrutura

> 📁 Todos os guias estão organizados em [`guides/`](./guides/)

### Setup e Configuração

| Documento                                                   | Descrição                     | Para Quem |
| ----------------------------------------------------------- | ----------------------------- | --------- |
| [DEPLOY_DASHBOARD.md](./guides/DEPLOY_DASHBOARD.md)         | Guia completo de deploy       | DevOps    |
| [NEON_SETUP_GUIDE.md](./guides/NEON_SETUP_GUIDE.md)         | Configuração do Neon Database | DevOps    |
| [RUN_MIGRATIONS.md](./guides/RUN_MIGRATIONS.md)             | Como executar migrations      | DevOps    |
| [GITHUB_ACTIONS_SETUP.md](./guides/GITHUB_ACTIONS_SETUP.md) | Configuração de workflows     | DevOps    |

### Operações

| Documento                                                               | Descrição                            | Para Quem |
| ----------------------------------------------------------------------- | ------------------------------------ | --------- |
| [SYNC_ENV_FROM_VERCEL.md](./guides/SYNC_ENV_FROM_VERCEL.md)             | Sincronizar variáveis do Vercel      | DevOps    |
| [SYNC_POLICIES_TO_DOCS_REPO.md](./guides/SYNC_POLICIES_TO_DOCS_REPO.md) | Sincronizar políticas para docs repo | DevOps    |
| [ECOSYSTEM_GRAPH_ACCESS.md](./guides/ECOSYSTEM_GRAPH_ACCESS.md)         | Acesso ao gráfico do ecossistema     | DevOps    |
| [ECOSYSTEM_GRAPH_REPOS.md](./guides/ECOSYSTEM_GRAPH_REPOS.md)           | Dados do gráfico de repositórios     | DevOps    |

---

## 💻 Desenvolvimento

### Frontend

| Documento                                  | Descrição                       | Para Quem       |
| ------------------------------------------ | ------------------------------- | --------------- |
| [FRONTEND_MAP.md](./FRONTEND_MAP.md)       | Mapa dos 3 frontends            | Desenvolvedores |
| [SIMULATION_MODE.md](./SIMULATION_MODE.md) | Documentação do simulation mode | Desenvolvedores |

### API e Backend

> 📁 Documentação de API está em [`api/`](./api/)

| Documento                                                                    | Descrição                                   | Para Quem       |
| ---------------------------------------------------------------------------- | ------------------------------------------- | --------------- |
| [openapi.yaml](./api/openapi.yaml)                                           | Especificação OpenAPI completa              | Desenvolvedores |
| [API_MARKETING_ROUTES.md](./api/API_MARKETING_ROUTES.md)                     | Rotas de API para marketing                 | Desenvolvedores |
| [MARKETING_SCHEMA_EXPLANATION.md](./api/MARKETING_SCHEMA_EXPLANATION.md)     | Explicação do schema de marketing           | Desenvolvedores |
| [FRONTEND_MARKETING_INTEGRATION.md](./api/FRONTEND_MARKETING_INTEGRATION.md) | Integração de marketing no frontend         | Desenvolvedores |
| [TAVILY_INTEGRATION.md](./guides/TAVILY_INTEGRATION.md)                      | Integração Tavily AI (pesquisa e validação) | Desenvolvedores |
| [DATABASE_SCHEMA.sql](./DATABASE_SCHEMA.sql)                                 | Schema do banco de dados                    | Desenvolvedores |

---

## 📋 Organização e Políticas

### Organização

| Documento                                                            | Descrição                  | Para Quem |
| -------------------------------------------------------------------- | -------------------------- | --------- |
| [ORGANIZATION.md](./ORGANIZATION.md)                                 | Organização técnica GitHub | Todos     |
| [REPOSITORY_VISIBILITY_POLICY.md](./REPOSITORY_VISIBILITY_POLICY.md) | Política de visibilidade   | Todos     |
| [SECURITY_ENFORCEMENT_REPORT.md](./SECURITY_ENFORCEMENT_REPORT.md)   | Relatório de enforcement   | Todos     |

### Validação e Consistência

| Documento                                                                    | Descrição                       | Para Quem |
| ---------------------------------------------------------------------------- | ------------------------------- | --------- |
| [VALIDATE_NEW_REPOS.md](./VALIDATE_NEW_REPOS.md)                             | Validação de novos repositórios | DevOps    |
| [REPOSITORY_CONSISTENCY_CHECKLIST.md](./REPOSITORY_CONSISTENCY_CHECKLIST.md) | Checklist de consistência       | DevOps    |

---

## 📖 Documentação e Padrões

### Padrões

| Documento                                                                | Descrição                | Para Quem |
| ------------------------------------------------------------------------ | ------------------------ | --------- |
| [.DOCUMENTATION_STANDARD.md](./.DOCUMENTATION_STANDARD.md)               | Padrão de documentação   | Todos     |
| [DOCS_AUDIT_AND_STANDARDIZATION.md](./DOCS_AUDIT_AND_STANDARDIZATION.md) | Auditoria e padronização | Todos     |
| [SUGGESTIONS.md](./SUGGESTIONS.md)                                       | Sugestões de melhorias   | Todos     |

### Versionamento

| Documento                                                 | Descrição                                      | Para Quem |
| --------------------------------------------------------- | ---------------------------------------------- | --------- |
| [CRITICAL_DOCUMENTS.md](./versions/CRITICAL_DOCUMENTS.md) | Rastreamento de versões de documentos críticos | Todos     |

### Roadmap

| Documento                        | Descrição                 | Para Quem       |
| -------------------------------- | ------------------------- | --------------- |
| [NEXT_STEPS.md](./NEXT_STEPS.md) | Próximos passos e roadmap | Desenvolvedores |

---

## 📦 Arquivo Histórico

Documentos históricos e relatórios de processos concluídos estão em [`archive/`](./archive/):

| Documento                                                                                | Descrição                       | Status       |
| ---------------------------------------------------------------------------------------- | ------------------------------- | ------------ |
| [MIGRATION_TO_MULTI_REPOS.md](./archive/MIGRATION_TO_MULTI_REPOS.md)                     | Migração monorepo → multi-repos | ✅ Concluído |
| [VALIDATION_REPORT.md](./archive/VALIDATION_REPORT.md)                                   | Relatório intermediário         | 📦 Histórico |
| [VALIDATION_FINAL_REPORT.md](./archive/VALIDATION_FINAL_REPORT.md)                       | Relatório final                 | 📦 Histórico |
| [ANALISE_CONEXAO_DOCS_REPO.md](./archive/ANALISE_CONEXAO_DOCS_REPO.md)                   | Análise de conexão              | 📦 Histórico |
| [AUDITORIA_VISIBILIDADE_ORGANIZACAO.md](./archive/AUDITORIA_VISIBILIDADE_ORGANIZACAO.md) | Auditoria de visibilidade       | 📦 Histórico |

Ver [`archive/README.md`](./archive/README.md) para índice completo.

---

## 🎯 Navegação por Perfil

### 👨‍💻 Desenvolvedor Frontend

1. Comece por: [FRONTEND_MAP.md](./FRONTEND_MAP.md)
2. Entenda o modo: [SIMULATION_MODE.md](./SIMULATION_MODE.md)
3. Veja a integração: [FRONTEND_MARKETING_INTEGRATION.md](./api/FRONTEND_MARKETING_INTEGRATION.md)
4. Consulte APIs: [openapi.yaml](./api/openapi.yaml) ou [API_MARKETING_ROUTES.md](./api/API_MARKETING_ROUTES.md)

### 🔧 DevOps

1. Setup inicial: [DEPLOY_DASHBOARD.md](./guides/DEPLOY_DASHBOARD.md)
2. Database: [NEON_SETUP_GUIDE.md](./guides/NEON_SETUP_GUIDE.md)
3. Migrations: [RUN_MIGRATIONS.md](./guides/RUN_MIGRATIONS.md)
4. CI/CD: [GITHUB_ACTIONS_SETUP.md](./guides/GITHUB_ACTIONS_SETUP.md)

### 🏛️ Arquitetura

1. Visão geral: [ARCHITECTURAL_ADDENDUMS.md](./ARCHITECTURAL_ADDENDUMS.md)
2. ADRs: [`adr/`](./adr/) (4 decisões arquiteturais)
3. Estratégia: [NEO_STRATEGIC_PLAN_V1.md](./NEO_STRATEGIC_PLAN_V1.md)
4. Status: [ADR 0002](./adr/0002-ui-as-demo-and-intent-layer.md)

### 📊 Gestão/Stakeholders

1. Visão geral: [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)
2. Organização: [ORGANIZATION.md](./ORGANIZATION.md)
3. Roadmap: [NEXT_STEPS.md](./NEXT_STEPS.md)
4. Políticas: [REPOSITORY_VISIBILITY_POLICY.md](./REPOSITORY_VISIBILITY_POLICY.md)

---

## 🔍 Busca Rápida

### Por Tema

**Web3 / Blockchain:**

- [SIMULATION_MODE.md](./SIMULATION_MODE.md)
- [adr/0003-wallet-extensions-mpc-automation-posture.md](./adr/0003-wallet-extensions-mpc-automation-posture.md)

**Marketing / Analytics:**

- [openapi.yaml](./api/openapi.yaml)
- [API_MARKETING_ROUTES.md](./api/API_MARKETING_ROUTES.md)
- [MARKETING_SCHEMA_EXPLANATION.md](./api/MARKETING_SCHEMA_EXPLANATION.md)
- [FRONTEND_MARKETING_INTEGRATION.md](./api/FRONTEND_MARKETING_INTEGRATION.md)

**Database:**

- [DATABASE_SCHEMA.sql](./DATABASE_SCHEMA.sql)
- [NEON_SETUP_GUIDE.md](./NEON_SETUP_GUIDE.md)
- [RUN_MIGRATIONS.md](./RUN_MIGRATIONS.md)

**Deploy:**

- [DEPLOY_DASHBOARD.md](./guides/DEPLOY_DASHBOARD.md)
- [GITHUB_ACTIONS_SETUP.md](./guides/GITHUB_ACTIONS_SETUP.md)
- [ARCHITECTURE_WORKFLOWS_AND_DEPLOYMENT.md](./ARCHITECTURE_WORKFLOWS_AND_DEPLOYMENT.md)

**API:**

- [openapi.yaml](./api/openapi.yaml)
- [API_MARKETING_ROUTES.md](./api/API_MARKETING_ROUTES.md)

**Organização:**

- [ORGANIZATION.md](./ORGANIZATION.md)
- [REPOSITORY_VISIBILITY_POLICY.md](./REPOSITORY_VISIBILITY_POLICY.md)
- [REPOSITORY_CONSISTENCY_CHECKLIST.md](./guides/REPOSITORY_CONSISTENCY_CHECKLIST.md)

---

## 📝 Notas

- Todos os documentos seguem o padrão definido em [.DOCUMENTATION_STANDARD.md](./.DOCUMENTATION_STANDARD.md)
- Documentos históricos estão em [`archive/`](./archive/)
- ADRs estão em [`adr/`](./adr/)
- Para sugestões de melhorias, veja [SUGGESTIONS.md](./SUGGESTIONS.md)

---

**Última atualização:** 2026-01-24  
**Total de documentos ativos:** ~35  
**ADRs:** 4  
**Documentos históricos:** 5
