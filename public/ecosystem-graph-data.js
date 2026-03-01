/**
 * NEØ Ecosystem Graph — Dados COMPLETOS (pré-lançamento)
 * Todos os repos (públicos + privados), componentes, workflows.
 * Conexões rastreadas: Makefile, workflows CI, sync, referências.
 * @see docs/ECOSYSTEM_GRAPH_REPOS.md
 */
(function (global) {
  "use strict";

  const NEO_ECOSYSTEM_GRAPH_DATA = {
    meta: {
      version: "2.0.0",
      scope: "full",
      includePrivate: true,
      updated: "2026-01-27",
      note: "Pré-lançamento: inclui repos privados. Conexões mapeadas em profundidade.",
    },
    nodes: [
      {
        id: "smart-ui",
        label: "smart-ui",
        type: "repo-public",
        description:
          "Dashboard React + API. Makefile: CORE_DIR, CLI_DIR, OPS_DIR, DOCS_DIR. Roda protocol-health, docs-guard, ops-sync.",
      },
      {
        id: "docs",
        label: "docs",
        type: "repo-public",
        description:
          "Documentação central. Recebe sync de políticas/ADRs do smart-ui.",
      },
      {
        id: "smart-ui-landing",
        label: "smart-ui-landing",
        type: "repo-public",
        description:
          "Landing (repo separado pós-migração). Deploy Vercel. Referências docs, smart-ui.",
      },
      {
        id: "smart-ui-mobile",
        label: "smart-ui-mobile",
        type: "repo-public",
        description:
          "Mobile Vue (repo separado). Deploy Vercel. Referências docs, smart-ui.",
      },
      {
        id: "neo-smart-factory",
        label: "neo-smart-factory",
        type: "repo-private",
        description:
          "Core: smart-core, smart-cli, internal-ops, changelog. Checkout via protocol-health.",
      },
      {
        id: "smart-core",
        label: "smart-core",
        type: "repo-private",
        description:
          "Autoridade de protocolo. Acesso apenas via smart-cli (ADR).",
      },
      {
        id: "smart-cli",
        label: "smart-cli",
        type: "repo-private",
        description: "CLI, gateway para smart-core. Makefile CLI_DIR.",
      },
      {
        id: "internal-ops",
        label: "internal-ops",
        type: "repo-private",
        description: "Ops e estado. Makefile OPS_DIR. ops-sync atualiza state.",
      },
      {
        id: "smart-core-contracts",
        label: "smart-core-contracts",
        type: "component",
        description:
          "Contratos (neo-smart-factory). Makefile CORE_DIR. smart-mint sync ABIs.",
      },
      {
        id: "smart-cli-tool",
        label: "smart-cli-tool",
        type: "component",
        description:
          "CLI tool (neo-smart-factory). smart-mint verifica atualizações.",
      },
      {
        id: "state",
        label: "state.json",
        type: "component",
        description: "Estado operacional (internal-ops). smart-mint, ops-sync.",
      },
      {
        id: "changelog",
        label: "changelog",
        type: "component",
        description:
          "Changelog (neo-smart-factory/docs). ops-sync, smart-mint.",
      },
      {
        id: "protocol-health",
        label: "protocol-health",
        type: "workflow",
        description: "CI: checkout smart-ui + neo-smart-factory. make health.",
      },
      {
        id: "docs-guard",
        label: "docs-guard",
        type: "workflow",
        description: "CI: valida docs/* e *.md em PRs do smart-ui.",
      },
      {
        id: "smart-mint",
        label: "smart-mint",
        type: "workflow",
        description:
          "Workflow doc: sync smart-core, changelog, state; verifica smart-cli.",
      },
      {
        id: "ops-sync",
        label: "ops-sync",
        type: "workflow",
        description: "Makefile: sync com internal-ops e docs (changelog).",
      },
    ],
    edges: [
      {
        source: "smart-ui",
        target: "docs",
        label: "sync + references",
        type: "connected",
      },
      {
        source: "smart-ui-landing",
        target: "docs",
        label: "references",
        type: "connected",
      },
      {
        source: "smart-ui-mobile",
        target: "docs",
        label: "references",
        type: "connected",
      },
      {
        source: "protocol-health",
        target: "smart-ui",
        label: "checkout, runs",
        type: "workflow",
      },
      {
        source: "protocol-health",
        target: "neo-smart-factory",
        label: "checkout",
        type: "workflow",
      },
      {
        source: "docs-guard",
        target: "smart-ui",
        label: "validates",
        type: "workflow",
      },
      {
        source: "smart-ui",
        target: "docs-guard",
        label: "runs",
        type: "workflow",
      },
      {
        source: "ops-sync",
        target: "smart-ui",
        label: "runs (Makefile)",
        type: "workflow",
      },
      {
        source: "ops-sync",
        target: "internal-ops",
        label: "sync state",
        type: "workflow",
      },
      {
        source: "ops-sync",
        target: "docs",
        label: "changelog check",
        type: "workflow",
      },
      {
        source: "smart-ui",
        target: "smart-core-contracts",
        label: "CORE_DIR (Makefile)",
        type: "connected",
      },
      {
        source: "smart-ui",
        target: "smart-cli",
        label: "CLI_DIR (Makefile)",
        type: "connected",
      },
      {
        source: "smart-ui",
        target: "internal-ops",
        label: "OPS_DIR, ops-sync",
        type: "connected",
      },
      {
        source: "neo-smart-factory",
        target: "smart-core-contracts",
        label: "contains",
        type: "structure",
      },
      {
        source: "neo-smart-factory",
        target: "smart-cli-tool",
        label: "contains",
        type: "structure",
      },
      {
        source: "neo-smart-factory",
        target: "internal-ops",
        label: "contains",
        type: "structure",
      },
      {
        source: "neo-smart-factory",
        target: "changelog",
        label: "contains",
        type: "structure",
      },
      {
        source: "internal-ops",
        target: "state",
        label: "contains",
        type: "structure",
      },
      {
        source: "smart-mint",
        target: "smart-core-contracts",
        label: "sync ABIs",
        type: "workflow",
      },
      {
        source: "smart-mint",
        target: "changelog",
        label: "update",
        type: "workflow",
      },
      {
        source: "smart-mint",
        target: "state",
        label: "update",
        type: "workflow",
      },
      {
        source: "smart-mint",
        target: "smart-cli-tool",
        label: "check",
        type: "workflow",
      },
      {
        source: "smart-ui",
        target: "smart-mint",
        label: "follows (doc)",
        type: "workflow",
      },
      {
        source: "smart-cli",
        target: "smart-core",
        label: "gateway (ADR)",
        type: "connected",
      },
      {
        source: "smart-ui-landing",
        target: "smart-ui",
        label: "references",
        type: "connected",
      },
      {
        source: "smart-ui-mobile",
        target: "smart-ui",
        label: "references",
        type: "connected",
      },
      {
        source: "smart-ui-landing",
        target: "smart-ui-mobile",
        label: "references",
        type: "connected",
      },
    ],
    notConnected: [
      {
        source: "smart-ui",
        target: "smart-ui-landing",
        reason: "Repos distintos; sem link direto.",
      },
      {
        source: "smart-core",
        target: "smart-ui",
        reason: "Sem integração direta (apenas via smart-cli).",
      },
      {
        source: "smart-core",
        target: "smart-ui-landing",
        reason: "Sem conexão.",
      },
      { source: "smart-core", target: "docs", reason: "Sem conexão direta." },
      {
        source: "smart-core-contracts",
        target: "smart-ui-landing",
        reason: "Sem conexão.",
      },
      { source: "state", target: "smart-ui-landing", reason: "Sem conexão." },
      {
        source: "smart-ui-landing",
        target: "smart-ui-mobile",
        reason: "Repos distintos; sem link direto.",
      },
    ],
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = NEO_ECOSYSTEM_GRAPH_DATA;
  } else {
    global.NEO_ECOSYSTEM_GRAPH_DATA = NEO_ECOSYSTEM_GRAPH_DATA;
  }
})(typeof window !== "undefined" ? window : this);
