#!/usr/bin/env bash
# NΞØ Smart Factory — Sync policies, standards, audits, org & ADRs to docs repo
# Source: smart-ui (base de padrões, POLICIES). Target: neo-smart-factory/docs.
# Usage: ./scripts/sync-policies-to-docs-repo.sh [DOCS_REPO_PATH]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SMART_UI_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
DOCS_REPO="${1:-${DOCS_REPO:-$SMART_UI_ROOT/../docs}}"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}📤 Sync: smart-ui → docs repo (base de padrões, POLICIES)${NC}"
echo "   Source: $SMART_UI_ROOT"
echo "   Target: $DOCS_REPO"
echo ""

if [[ ! -d "$DOCS_REPO" ]]; then
  echo -e "${RED}❌ Docs repo not found: $DOCS_REPO${NC}"
  echo "   Clone it: git clone git.com:neo-smart-factory/docs.git $DOCS_REPO"
  exit 1
fi

if [[ ! -d "$DOCS_REPO/.git" ]]; then
  echo -e "${RED}❌ Not a git repo: $DOCS_REPO${NC}"
  exit 1
fi

# Ensure target dirs exist
mkdir -p "$DOCS_REPO/operations/standards"
mkdir -p "$DOCS_REPO/auditoria"
mkdir -p "$DOCS_REPO/ecosystem"
mkdir -p "$DOCS_REPO/architecture/adr"

# Mapping: smart-ui path -> docs path
copy() {
  local src="$SMART_UI_ROOT/$1"
  local dst="$DOCS_REPO/$2"
  if [[ -f "$src" ]]; then
    cp "$src" "$dst"
    echo -e "   ${GREEN}✓${NC} $1 → $2"
  else
    echo -e "   ${RED}✗${NC} Missing: $1"
    return 1
  fi
}

echo -e "${YELLOW}Policies & standards${NC}"
copy "docs/REPOSITORY_VISIBILITY_POLICY.md" "operations/standards/REPOSITORY_VISIBILITY_POLICY.md"
copy "docs/SECURITY_ENFORCEMENT_REPORT.md" "operations/standards/SECURITY_ENFORCEMENT_REPORT.md"

echo -e "${YELLOW}Audits${NC}"
copy "docs/AUDITORIA_VISIBILIDADE_ORGANIZACAO.md" "auditoria/AUDITORIA_VISIBILIDADE_ORGANIZACAO.md"

echo -e "${YELLOW}Ecosystem & analysis${NC}"
copy "docs/ANALISE_CONEXAO_DOCS_REPO.md" "ecosystem/ANALISE_CONEXAO_DOCS_REPO.md"

echo -e "${YELLOW}Organization & architecture${NC}"
copy "docs/ORGANIZATION.md" "ORGANIZATION.md"
copy "docs/ARCHITECTURAL_ADDENDUMS.md" "architecture/ARCHITECTURAL_ADDENDUMS.md"

echo -e "${YELLOW}ADRs${NC}"
copy "docs/adr/0001-smart-ui-backend-boundary.md" "architecture/adr/0001-smart-ui-backend-boundary.md"
copy "docs/adr/0002-ui-as-demo-and-intent-layer.md" "architecture/adr/0002-ui-as-demo-and-intent-layer.md"
copy "docs/adr/0003-wallet-extensions-mpc-automation-posture.md" "architecture/adr/0003-wallet-extensions-mpc-automation-posture.md"
copy "docs/adr/0004-kyc-governance-strategy.md" "architecture/adr/0004-kyc-governance-strategy.md"

# Manifest: origin and last sync
MANIFEST="$DOCS_REPO/operations/standards/POLICIES_ORIGIN.md"
cat > "$MANIFEST" << EOF
# Origem das políticas e padrões

Estes arquivos em \`operations/standards/\` e relacionados (auditoria, ecosystem, architecture/adr, ORGANIZATION) são **sincronizados** a partir do repositório **smart-ui**.

- **Fonte:** [neo-smart-factory/smart-ui](https://github.com/neo-smart-factory/smart-ui)
- **Última sincronização:** $(date +%Y-%m-%d)
- **Script:** \`smart-ui/scripts/sync-policies-to-docs-repo.sh\`

Consulte [SYNC_POLICIES_TO_DOCS_REPO.md](https://github.com/neo-smart-factory/smart-ui/blob/main/docs/SYNC_POLICIES_TO_DOCS_REPO.md) no smart-ui para o guia completo.
EOF
echo -e "   ${GREEN}✓${NC} Wrote operations/standards/POLICIES_ORIGIN.md"

echo ""
echo -e "${GREEN}✅ Sync complete.${NC}"
echo ""
echo "Next steps:"
echo "  1. cd $DOCS_REPO"
echo "  2. Update internal links (see docs/SYNC_POLICIES_TO_DOCS_REPO.md in smart-ui)"
echo "  3. Update INDEX.md with new entries (see guide)"
echo "  4. git add -A && git status"
echo "  5. git commit -m 'chore: sync policies, standards, audits, org & ADRs from smart-ui'"
echo "  6. git push origin main"
echo ""
