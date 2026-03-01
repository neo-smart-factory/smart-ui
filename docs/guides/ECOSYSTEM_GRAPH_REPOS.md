# Grafo de Repositórios e Conexões — NEØ

**Data:** 2026-01-27  
**Status:** Ativo  
**Categoria:** Guia  
**Audiência:** DevOps

**Objetivo:** Visualizar **nodes** (repositórios da organização), **conexões entre eles e **não conectados\*\*, em conformidade com a [REPOSITORY_VISIBILITY_POLICY](./REPOSITORY_VISIBILITY_POLICY.md).

---

## 1. O que o grafo mostra

| Elemento               | Descrição                                                                                                                                          |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Nodes**              | Repos (públicos + privados), componentes (smart-core, smart-cli, state, changelog), workflows (protocol-health, docs-guard, smart-mint, ops-sync). |
| **Edges (conectados)** | Conexões rastreadas em profundidade: sync, referências, Makefile (CORE_DIR, CLI_DIR, OPS_DIR), CI checkout, contains, etc.                         |
| **Não conectados**     | Pares **sem** sync, link direto ou workflow entre si.                                                                                              |

**Visão atual (pré-lançamento):** Inclui **todos** os repos (públicos e privados), componentes e workflows. Conexões mapeadas a partir de Makefile, workflows CI, sync script, ADRs e docs. Após lançamento, pode ser alterada para só públicos (conforme política de visibilidade).

---

## 2. Onde está hoje

| Artefato   | Local                                                 | Uso                                                                                                         |
| ---------- | ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| **Dados**  | `public/ecosystem-graph-data.js`                      | Nodes (repos, componentes, workflows), edges, `notConnected`. Visão completa (pré-lançamento).              |
| **Grafo**  | `public/ecosystem-graph.html`                         | D3.js, tipos (repo-public, repo-private, workflow, component), legenda. Servido em `/ecosystem-graph.html`. |
| **Acesso** | [ECOSYSTEM_GRAPH_ACCESS](./ECOSYSTEM_GRAPH_ACCESS.md) | URLs produção/dev, verificação pós-deploy.                                                                  |

O grafo vive no **smart-ui** e é servido com o dashboard (Vercel). **Pré-lançamento:** inclui privados; após lançamento, ver [AUDITORIA_VISIBILIDADE_ORGANIZACAO](./archive/AUDITORIA_VISIBILIDADE_ORGANIZACAO.md) para conformidade.

---

## 3. Onde hospedar: UI vs Ops vs novo repo

### Opção A: **smart-ui** (atual) ✅

- **O quê:** Grafo **público** (apenas repos públicos, conexões e não conectados).
- **Vantagem:** Já existe deploy, `public/`, sem repo extra.
- **Restrição:** Não incluir repos privados. Política de visibilidade exige isso.

**Recomendação:** Manter o grafo público no **smart-ui**.

---

### Opção B: **internal-ops** (ou repo de ops)

- **O quê:** Grafo **interno** com **todos** os repos (públicos + privados), conexões e não conectados.
- **Vantagem:** Visão completa para governança, onboarding interno, auditoria.
- **Onde:** Repo **privado** (internal-ops ou outro de ops). HTML + `ecosystem-graph-data-internal.js` (ou JSON). **Não** deploy em URL pública.
- **Uso:** Abrir localmente (`open ecosystem-graph-internal.html`) ou servir em ferramenta interna (ex.: GitHub Pages **privado**, S3 interno, etc.).

**Recomendação:** Se precisar de grafo com repos privados, hospedar em **ops** (ou repo privado dedicado), nunca em smart-ui público.

---

### Opção C: **Novo repositório**

- **O quê:** Repo só para “ecosystem graph” (ex.: `neo-smart-factory/ecosystem-graph`).
- **Público:** Só dados públicos (como em smart-ui). Deploy estático (Vercel, Pages).
- **Privado:** Dados completos (públicos + privados). Deploy **não** público.
- **Vantagem:** Separação clara; dá para ter dois deploys (um público, um interno).
- **Desvantagem:** Mais um repo para manter.

**Recomendação:** Útil se quiser **um único lugar** para o grafo, com variantes pública vs interna, sem misturar com smart-ui ou ops.

---

## 4. Resumo

| Onde                      | Grafo                  | Repos                                             | Acesso                             |
| ------------------------- | ---------------------- | ------------------------------------------------- | ---------------------------------- |
| **smart-ui** (atual)      | Público                | smart-ui, smart-ui-landing, smart-ui-mobile, docs | `/ecosystem-graph.html` (produção) |
| **Ops** (ou repo privado) | Interno                | Todos (incl. privados)                            | Local ou URL interna               |
| **Novo repo**             | Público **ou** interno | Conforme deploy                                   | Conforme escolha                   |

**Manter no smart-ui:** grafo público (nodes, conexões, não conectados).  
**Adicionar em ops ou novo repo:** grafo interno, **somente** se for necessário mostrar repos privados e **sem** expor em ambiente público.

---

## 5. Origem das conexões rastreadas

As conexões do grafo foram mapeadas a partir de:

- **Makefile:** `CORE_DIR`, `CLI_DIR`, `OPS_DIR`, `DOCS_DIR` → smart-core, smart-cli, internal-ops, docs.
- **Workflows CI:** `protocol-health` (checkout smart-ui + neo-smart-factory), `docs-guard` (valida docs do smart-ui).
- **Makefile targets:** `ops-sync` (sync com internal-ops e docs/changelog), `health` (checagem de componentes).
- **Workflow doc:** `smart-mint-protocol` → smart-core (sync ABIs), changelog, state, smart-cli.
- **Referências:** README, ORGANIZATION, checklist (smart-ui-landing, smart-ui-mobile ↔ docs, smart-ui).
- **ADRs / ui-status:** smart-cli como gateway para smart-core; smart-ui não integra direto com smart-core.

Ao adicionar novos repos, workflows ou integrações, atualizar `ecosystem-graph-data.js` (nodes, edges, notConnected) e, se preciso, a legenda no HTML.

---

## 6. Como alterar dados

1. **Público ou completo:** editar `public/ecosystem-graph-data.js`:

   - `nodes`: repos públicos.
   - `edges`: conexões (sync, references, etc.).
   - `notConnected`: pares sem conexão.

2. **Interno (quando existir):** usar outro arquivo (ex.: `ecosystem-graph-data-internal.js`) no repo de ops ou no novo repo, com nodes/edges que incluam repos privados. **Não** commitar em repo público.

---

## 7. Links

- [REPOSITORY_VISIBILITY_POLICY](./REPOSITORY_VISIBILITY_POLICY.md)
- [AUDITORIA_VISIBILIDADE_ORGANIZACAO](./archive/AUDITORIA_VISIBILIDADE_ORGANIZACAO.md)
- [ECOSYSTEM_GRAPH_ACCESS](./ECOSYSTEM_GRAPH_ACCESS.md)

---

**Última atualização:** 2026-01-27
