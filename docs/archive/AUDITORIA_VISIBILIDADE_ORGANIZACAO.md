# Auditoria de Visibilidade — Organização neo-smart-factory

> **⚠️ ARCHIVED DOCUMENT**  
> This document is preserved for historical reference. The content reflects the state of the project at the time of archiving and may contain outdated nomenclature (e.g., "forge" instead of "deploy/smart"). Please refer to current documentation for up-to-date information.

**Data:** 2026-01-24  
**Classificação:** SECURITY CRITICAL  
**Base:** [REPOSITORY_VISIBILITY_POLICY.md](./REPOSITORY_VISIBILITY_POLICY.md)

---

## 1. Entendimento

Na organização **neo-smart-factory**, **nem tudo pode estar público**. A política de visibilidade define:

| Tipo | Repositórios | Uso |
|------|--------------|-----|
| **Públicos** | `smart-ui`, `landing`, `docs` | Demo, narrativa, marketing, ADRs, governança. Podem ser linkados e referenciados. |
| **Privados / restritos** | `smart-core`, `smart-cli`, `internal-ops` | Lógica operacional, automação, ops, infraestrutura. **Nunca** expostos publicamente. |

Repos privados **não** devem ser: linkados, citados em UI, em landing, em pitch, em documentação pública, em fóruns/issues, nem em gráficos de dependência públicos.

---

## 2. Escopo da Auditoria

- Conteúdo **user-facing**: `src/`, `public/`, footer da UI, links em README/docs públicos.
- Artefatos **versionados** no repo público `smart-ui`: Makefile, workflows, `docs/`.
- Verificação de **violações** (exposição de nomes/existência de repos privados) vs **exceções aceitas** (política, ADRs, setup de CI).

---

## 3. Resultados da Auditoria

### 3.1 ✅ Conforme

| Item | Status |
|------|--------|
| **App.jsx (footer)** | Apenas org, ARCHITECTURAL_ADDENDUMS, ADRs, PROJECT_OVERVIEW. Sem smart-core, smart-cli, internal-ops. |
| **docs/ORGANIZATION.md** | Lista só `smart-ui`, `landing`, `docs`. |
| **docs/README.md** | Links úteis só para org e esses três repos. |
| **docs/REPOSITORY_VISIBILITY_POLICY.md** | Define público vs privado; referência a privados é **contexto de política**. |
| **docs/SECURITY_ENFORCEMENT_REPORT.md** | Relato de conformidade; cita privados só em contexto de enforcement. |
| **src/** | Nenhuma referência a smart-core, smart-cli, internal-ops, neo-smart-factory. |

### 3.2 ❌ Violações

| Onde | O quê | Severidade (política) |
|------|--------|------------------------|
| **`public/ecosystem-graph.html`** | Nomes explícitos: `neo-smart-factory`, `internal-ops`, `forge-core`, `forge-cli`, `state.json`. Arquivo servido em **produção** (`/ecosystem-graph.html`), sem auth. Comentário diz "visualização interna", mas está em `public/` e é acessível. | **MEDIUM** — Exposição de nomes/existência de repos e componentes privados. |
| **Makefile** | `CORE_DIR`, `CLI_DIR`, `OPS_DIR` expõem caminhos para `../smart-cli`, `../../neo_smart_factory/forge-core`, `../../neo_smart_factory/internal-ops`. Repo é público. | **MEDIUM** — Exposição de existência e estrutura de componentes privados. |

### 3.3 ⚠️ Exceções aceitas (documentadas)

Estes arquivos **citam** repos/componentes privados em **contexto de governança, política ou setup**. O [SECURITY_ENFORCEMENT_REPORT](./SECURITY_ENFORCEMENT_REPORT.md) já os considera aceitáveis:

- `docs/REPOSITORY_VISIBILITY_POLICY.md` — define o que é privado.
- `docs/adr/0001-smart-ui-backend-boundary.md`, `0002-ui-as-demo-and-intent-layer.md` — ADRs históricos que delimitam fronteiras.
- `docs/GITHUB_ACTIONS_SETUP.md` — guia de setup de CI (cita `neo-smart-factory` para token/workflow).
- `docs/ui-status.md` — status interno; declara autoridade em smart-core, smart-cli, docs.

**Nuance:** Estão em repo **público**. A política proíbe “Mentioned in public documentation”. O relatório de enforcement considera que a **função** é definir políticas ou descrever arquitetura, não divulgar ou linkar para privados. Recomendação: **formalizar allowlist** na própria política (ver sugestões).

### 3.4 ⚠️ Configuração de CI (workflows)

- **`.github/workflows/protocol-health.yml`** faz checkout de `neo-smart-factory/neo-smart-factory`. O **nome do repo** aparece em YAML versionado publicamente.

**Nuance:** Workflows precisam identificar o repo para checkout. Não há “exceção” explícita na política para “config de CI”. Sugestão: **documentar exceção** — configuração de workflow pode referenciar identificadores de repos privados **apenas** para checkout/automação, sem uso user-facing.

---

## 4. Repositório `neo-smart-factory`

A política lista **smart-core**, **smart-cli**, **internal-ops** como privados. **neo-smart-factory** não está listado, mas:

- Contém `internal-ops`, `forge-core`, etc.
- É usado em `protocol-health` e em vários docs.

**Recomendação:** Incluir **neo-smart-factory** explicitamente na lista de repos **privados/restritos** (ou equivalente) na política, para alinhar com a prática e evitar ambiguidade.

---

## 5. Sugestões de Remediação

### 5.1 Imediatas

1. **`public/ecosystem-graph.html`**
   - **Opção A:** Remover ou genéricar nomes privados. Ex.: nós “Core”, “Ops”, “Internal” em vez de `neo-smart-factory`, `internal-ops`, `forge-cli`. Manter apenas smart-ui, landing, docs como identificadores reais.
   - **Opção B:** Tirar o arquivo de `public/` (não servir em produção). Manter só para uso local/interno, se necessário.
   - **Opção C:** Servir apenas em rota/URL restrita (ex.: autenticada) ou em ambiente que não seja o site público do dashboard.

2. **Makefile**
   - Usar **variáveis de ambiente** para `CORE_DIR`, `CLI_DIR`, `OPS_DIR` (e semelhantes), sem defaults que exponham `smart-cli`, `neo-smart-factory`, `internal-ops`. Ex.: `CORE_DIR ?= $(CORE_DIR)` etc.
   - Documentar em `DEV_SETUP.md` ou equivalente que membros da org devem configurar esses env vars localmente. O Makefile em si não revela estrutura privada.

### 5.2 Política e Governança

3. **REPOSITORY_VISIBILITY_POLICY**
   - Incluir **neo-smart-factory** na seção de repos **PRIVATE / RESTRICTED** (ou “Restricted”).
   - Adicionar subseção **“Exceções documentadas”**:
     - **Allowlist de documentos:** Lista explícita de arquivos que podem **nomear** (sem linkar) repos/componentes privados apenas para: definição de política, ADRs, guias de setup de CI, status interno. Ex.: `REPOSITORY_VISIBILITY_POLICY`, `SECURITY_ENFORCEMENT_REPORT`, `adr/0001` e `0002`, `GITHUB_ACTIONS_SETUP`, `ui-status`.
     - **Configuração de CI:** Workflows podem referenciar identificadores de repos privados **somente** para checkout e automação (ex.: `protocol-health`). Proibido uso em conteúdo user-facing.

4. **SECURITY_ENFORCEMENT_REPORT**
   - Atualizar com os resultados desta auditoria: novas violações (ecosystem-graph, Makefile), exceções formalizadas e passos de remediação aplicados.

### 5.3 Automatização

5. **Checagem em CI (ex.: “visibility-guard”)**
   - Job que falha se `smart-core`, `smart-cli`, `internal-ops` ou `neo-smart-factory` aparecerem em:
     - `src/**`
     - `public/**` (em especial `*.html`, `*.js` servidos)
     - Outros caminhos considerados user-facing (a definir).
   - **Allowlist:** Arquivos da exceção documentada (política, ADRs, setup, ui-status) + Makefile (se mantiver referências via env) + workflows. Manter allowlist explícita (path ou padrão) no próprio workflow ou em config.

6. **Checklist de conformidade**
   - Reutilizar o [Compliance Checklist](./REPOSITORY_VISIBILITY_POLICY.md#-compliance-checklist) da política antes de releases. Opcionalmente, tornar parte do processo de PR (ex.: checklist no template de PR) ou de um job de release.

### 5.4 Manutenção

7. **Revisão periódica**
   - Revisar conteúdo público (UI, `public/`, docs linkados no footer) sempre que houver mudança relevante. Incluir visibilidade na **documentation review** já prevista na política.

8. **Onboarding**
   - Garantir que `DEV_SETUP` e onboarding técnico expliquem: (a) o que é público vs privado; (b) onde **não** mencionar repos privados; (c) uso de env vars para paths internos (Makefile).

---

## 6. Resumo

| Aspecto | Situação |
|--------|----------|
| **Entendimento** | Sim — na org, nem tudo é público. Público: smart-ui, landing, docs. Privado: smart-core, smart-cli, internal-ops (e neo-smart-factory). |
| **Conformidade atual** | Footer, ORGANIZATION, README, `src/` conformes. Violações em **ecosystem-graph** (public/) e **Makefile**. |
| **Exceções** | Política, ADRs, setup, ui-status — aceitas como exceção; falta formalizar allowlist e exceção para CI. |
| **Próximos passos** | Corrigir ecosystem-graph e Makefile; atualizar política (neo-smart-factory, exceções, allowlist); considerar visibility-guard em CI; manter checklist e revisões. |

---

**Última atualização:** 2026-01-24
