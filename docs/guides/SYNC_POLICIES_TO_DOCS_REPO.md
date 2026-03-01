# Sync: Base de Padrões e POLICIES → docs repo

**Data:** 2026-01-24  
**Status:** Ativo  
**Categoria:** Guia  
**Audiência:** DevOps

**Objetivo:** Enviar ao repositório [neo-smart-factory/docs](https://github.com/neo-smart-factory/docs) a base de padrões, políticas, auditorias, organização e ADRs mantidos no **smart-ui**.

**Quando usar:** Antes de remediar violações ou esboçar visibility-guard; sempre que políticas/audits forem atualizados e precisarem refletir no docs central.

---

## 1. O que é sincronizado

| Origem (smart-ui)                                           | Destino (docs)                                                      |
| ----------------------------------------------------------- | ------------------------------------------------------------------- |
| `docs/REPOSITORY_VISIBILITY_POLICY.md`                      | `operations/standards/REPOSITORY_VISIBILITY_POLICY.md`              |
| `docs/SECURITY_ENFORCEMENT_REPORT.md`                       | `operations/standards/SECURITY_ENFORCEMENT_REPORT.md`               |
| `docs/archive/AUDITORIA_VISIBILIDADE_ORGANIZACAO.md`        | `auditoria/AUDITORIA_VISIBILIDADE_ORGANIZACAO.md`                   |
| `docs/ANALISE_CONEXAO_DOCS_REPO.md`                         | `ecosystem/ANALISE_CONEXAO_DOCS_REPO.md`                            |
| `docs/ORGANIZATION.md`                                      | `ORGANIZATION.md` (raiz)                                            |
| `docs/ARCHITECTURAL_ADDENDUMS.md`                           | `architecture/ARCHITECTURAL_ADDENDUMS.md`                           |
| `docs/adr/0001-smart-ui-backend-boundary.md`                | `architecture/adr/0001-smart-ui-backend-boundary.md`                |
| `docs/adr/0002-ui-as-demo-and-intent-layer.md`              | `architecture/adr/0002-ui-as-demo-and-intent-layer.md`              |
| `docs/adr/0003-wallet-extensions-mpc-automation-posture.md` | `architecture/adr/0003-wallet-extensions-mpc-automation-posture.md` |
| `docs/adr/0004-kyc-governance-strategy.md`                  | `architecture/adr/0004-kyc-governance-strategy.md`                  |

O script também gera `operations/standards/POLICIES_ORIGIN.md` no docs (origem, data do sync, link para este guia).

---

## 2. Como executar

### Pré-requisito

Clone do **docs** como irmão do **smart-ui** (ex.: `.../NEO SMART TOKEN/docs` e `.../NEO SMART TOKEN/smart-ui`), com `origin` apontando para `git.com:neo-smart-factory/docs.git`.

### Comando

```bash
cd /caminho/para/smart-ui
chmod +x scripts/sync-policies-to-docs-repo.sh
./scripts/sync-policies-to-docs-repo.sh
```

Para usar outro caminho do docs:

```bash
./scripts/sync-policies-to-docs-repo.sh /caminho/para/docs
# ou
DOCS_REPO=/caminho/para/docs ./scripts/sync-policies-to-docs-repo.sh
```

---

## 3. Ajustes pós-sync (links)

Os arquivos no smart-ui usam paths relativos como `./ARCHITECTURAL_ADDENDUMS.md`, `./adr/0003-...`, `./ORGANIZATION.md`. No **docs**, eles ficam em pastas diferentes. Após o sync, ajuste os links nos arquivos **no repositório docs**:

### `operations/standards/REPOSITORY_VISIBILITY_POLICY.md`

Na seção **RELATED POLICIES**, troque:

| De                                                       | Para                                                                      |
| -------------------------------------------------------- | ------------------------------------------------------------------------- |
| `./ARCHITECTURAL_ADDENDUMS.md`                           | `../../architecture/ARCHITECTURAL_ADDENDUMS.md`                           |
| `./adr/0003-wallet-extensions-mpc-automation-posture.md` | `../../architecture/adr/0003-wallet-extensions-mpc-automation-posture.md` |
| `./adr/0004-kyc-governance-strategy.md`                  | `../../architecture/adr/0004-kyc-governance-strategy.md`                  |
| `./ORGANIZATION.md`                                      | `../../ORGANIZATION.md`                                                   |
| `./archive/AUDITORIA_VISIBILIDADE_ORGANIZACAO.md`        | `../../auditoria/AUDITORIA_VISIBILIDADE_ORGANIZACAO.md`                   |

### `operations/standards/SECURITY_ENFORCEMENT_REPORT.md`

Se houver referências a `./REPOSITORY_VISIBILITY_POLICY.md` ou `./AUDITORIA_...`, use `./REPOSITORY_VISIBILITY_POLICY.md` (mesmo diretório) e `../../auditoria/AUDITORIA_VISIBILIDADE_ORGANIZACAO.md`.

### `auditoria/AUDITORIA_VISIBILIDADE_ORGANIZACAO.md`

Links para `./REPOSITORY_VISIBILITY_POLICY` ou `./SECURITY_ENFORCEMENT_REPORT` → use `../operations/standards/REPOSITORY_VISIBILITY_POLICY.md` e `../operations/standards/SECURITY_ENFORCEMENT_REPORT.md`.

---

## 4. Atualizar INDEX.md (docs)

Inclua as políticas e auditorias no **INDEX** do docs para que apareçam na navegação.

### Seção 4 — Operações & Padrões

Em **Padrões de Repositório (Standards)**, acrescente **antes** dos itens existentes (Workflow Baseline, etc.):

```markdown
- **Políticas e conformidade:**
  - [Repository Visibility Policy](operations/standards/REPOSITORY_VISIBILITY_POLICY.md) — Público vs privado, compliance.
  - [Security Enforcement Report](operations/standards/SECURITY_ENFORCEMENT_REPORT.md) — Enforcement e checklist.
```

### Seção 5 — Histórico & Auditoria

Acrescente:

```markdown
- **[Auditoria de Visibilidade](auditoria/AUDITORIA_VISIBILIDADE_ORGANIZACAO.md)** — Conformidade org, violações e sugestões.
```

### Seção 1 — Core & Governança (opcional)

Se quiser linkar a organização no índice:

```markdown
- **[Organização Técnica](ORGANIZATION.md)** — neo-smart-factory, repos, governança.
```

### Seção 3 — Arquitetura & Decisões

Em **Decision Log (ADRs)**, além do `decision-log.md`, cite os ADRs numerados:

```markdown
- **ADRs numerados:** [0001](architecture/adr/0001-smart-ui-backend-boundary.md) · [0002](architecture/adr/0002-ui-as-demo-and-intent-layer.md) · [0003](architecture/adr/0003-wallet-extensions-mpc-automation-posture.md) · [0004](architecture/adr/0004-kyc-governance-strategy.md)
```

---

## 5. Commit e push (docs)

```bash
cd /caminho/para/docs
git add -A
git status   # conferir
git commit -m "chore: sync policies, standards, audits, org & ADRs from smart-ui"
git push origin main
```

---

## 6. Resumo

1. Rodar `./scripts/sync-policies-to-docs-repo.sh` a partir do smart-ui.
2. Ajustar links em `operations/standards/*` e `auditoria/AUDITORIA_*` conforme a seção 3.
3. Atualizar `INDEX.md` no docs com as entradas da seção 4 (e 3, se desejar).
4. Commit e push no repositório **docs**.

Com isso, a base de padrões, POLICIES e documentos relacionados passa a constar no [repositório docs](https://github.com/neo-smart-factory/docs) antes de qualquer remediação ou esboço de automatização.

---

**Última atualização:** 2026-01-24
