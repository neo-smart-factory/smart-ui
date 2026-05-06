#!/bin/bash

# Script de Validação de Consistência entre Repositórios
# Uso: ./scripts/validate-repo-consistency.sh [ui-core|landing|mobile]
# Ou execute dentro do repositório que deseja validar

set -e

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

REPO_TYPE="${1:-auto}"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}🔍 Validação de Consistência do Repo${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Detectar tipo de repo automaticamente
if [ "$REPO_TYPE" = "auto" ]; then
  if [ -f "package.json" ]; then
    REPO_NAME=$(grep -o '"name"[[:space:]]*:[[:space:]]*"[^"]*"' package.json | cut -d'"' -f4)
    if echo "$REPO_NAME" | grep -qi "landing"; then
      REPO_TYPE="landing"
    elif echo "$REPO_NAME" | grep -qi "mobile"; then
      REPO_TYPE="mobile"
    else
      REPO_TYPE="ui-core"
    fi
  else
    echo -e "${RED}❌ package.json não encontrado. Execute este script na raiz do repositório.${NC}"
    exit 1
  fi
fi

echo -e "${BLUE}📦 Tipo detectado: ${REPO_TYPE}${NC}"
echo ""

PASSED=0
FAILED=0
WARNINGS=0

# ============================================
# 1. ESTRUTURA DE ARQUIVOS
# ============================================
echo -e "${BLUE}📁 1. Verificando Estrutura de Arquivos...${NC}"

REQUIRED_FILES=("package.json" "README.md" ".gitignore" "vite.config.js" "index.html" "src")
for file in "${REQUIRED_FILES[@]}"; do
  if [ -e "$file" ]; then
    echo -e "${GREEN}✅ $file existe${NC}"
    ((PASSED++))
  else
    echo -e "${RED}❌ $file NÃO encontrado${NC}"
    ((FAILED++))
  fi
done

# Verificar se vercel.json existe (pode ser vazio)
if [ -f "vercel.json" ]; then
  echo -e "${GREEN}✅ vercel.json existe${NC}"
  ((PASSED++))
else
  echo -e "${YELLOW}⚠️  vercel.json não existe (opcional, mas recomendado)${NC}"
  ((WARNINGS++))
fi

# Verificar se NÃO tem pastas de workspace
if [ -d "landing" ] || [ -d "nuxt-app" ]; then
  echo -e "${RED}❌ Pastas de workspace encontradas (landing/ ou nuxt-app/)${NC}"
  echo -e "${RED}   Este repo deve ter tudo na raiz, não em subpastas${NC}"
  ((FAILED++))
else
  echo -e "${GREEN}✅ Sem pastas de workspace (correto)${NC}"
  ((PASSED++))
fi

echo ""

# ============================================
# 2. CONFIGURAÇÃO (package.json)
# ============================================
echo -e "${BLUE}⚙️  2. Verificando package.json...${NC}"

if [ -f "package.json" ]; then
  # Verificar se NÃO tem workspaces
  if grep -q '"workspaces"' package.json; then
    echo -e "${RED}❌ package.json ainda tem campo 'workspaces'${NC}"
    echo -e "${RED}   Deve ser removido (single repo)${NC}"
    ((FAILED++))
  else
    echo -e "${GREEN}✅ package.json não tem workspaces (correto)${NC}"
    ((PASSED++))
  fi

  # Verificar scripts
  if grep -q '"dev"' package.json && grep -q '"build"' package.json; then
    echo -e "${GREEN}✅ Scripts 'dev' e 'build' encontrados${NC}"
    ((PASSED++))
  else
    echo -e "${RED}❌ Scripts 'dev' ou 'build' faltando${NC}"
    ((FAILED++))
  fi
else
  echo -e "${RED}❌ package.json não encontrado${NC}"
  ((FAILED++))
fi

echo ""

# ============================================
# 3. vercel.json
# ============================================
echo -e "${BLUE}🚀 3. Verificando vercel.json...${NC}"

if [ -f "vercel.json" ]; then
  # Verificar se tem ignoreCommand (não deveria ter mais)
  if grep -q "ignoreCommand" vercel.json; then
    echo -e "${YELLOW}⚠️  vercel.json tem 'ignoreCommand'${NC}"
    echo -e "${YELLOW}   Não é mais necessário (não é monorepo)${NC}"
    ((WARNINGS++))
  else
    echo -e "${GREEN}✅ vercel.json sem ignoreCommand (correto)${NC}"
    ((PASSED++))
  fi

  # Verificar se é muito simples (ideal: {} ou configurações básicas)
  VERCEL_SIZE=$(wc -c < vercel.json | tr -d ' ')
  if [ "$VERCEL_SIZE" -lt 100 ]; then
    echo -e "${GREEN}✅ vercel.json simples (correto)${NC}"
    ((PASSED++))
  else
    echo -e "${YELLOW}⚠️  vercel.json pode estar muito complexo${NC}"
    ((WARNINGS++))
  fi
else
  echo -e "${YELLOW}⚠️  vercel.json não existe (pode criar com {})${NC}"
  ((WARNINGS++))
fi

echo ""

# ============================================
# 4. WORKFLOWS GITHUB
# ============================================
echo -e "${BLUE}🔄 4. Verificando Workflows GitHub...${NC}"

if [ -d ".github/workflows" ]; then
  if [ -f ".github/workflows/docs-guard.yml" ]; then
    echo -e "${GREEN}✅ docs-guard.yml existe${NC}"
    ((PASSED++))
    
    # Verificar se não menciona monorepo
    if grep -qi "landing\|nuxt-app\|monorepo\|workspace" .github/workflows/docs-guard.yml; then
      echo -e "${YELLOW}⚠️  docs-guard.yml menciona monorepo/workspace${NC}"
      ((WARNINGS++))
    else
      echo -e "${GREEN}✅ docs-guard.yml sem referências ao monorepo${NC}"
      ((PASSED++))
    fi
  else
    echo -e "${YELLOW}⚠️  docs-guard.yml não encontrado${NC}"
    ((WARNINGS++))
  fi
else
  echo -e "${YELLOW}⚠️  .github/workflows/ não existe${NC}"
  ((WARNINGS++))
fi

echo ""

# ============================================
# 5. REFERÊNCIAS OBSOLETAS
# ============================================
echo -e "${BLUE}🔍 5. Buscando Referências Obsoletas...${NC}"

# Buscar referências a landing/ ou nuxt-app/ (exceto node_modules e .git)
OBSOLETE_REFS=$(grep -r "landing/\|nuxt-app/\|monorepo\|workspace" . \
  --exclude-dir=node_modules \
  --exclude-dir=.git \
  --exclude="*.lock" \
  --exclude="validate-repo-consistency.sh" \
  2>/dev/null | wc -l | tr -d ' ')

if [ "$OBSOLETE_REFS" -eq 0 ]; then
  echo -e "${GREEN}✅ Nenhuma referência obsoleta encontrada${NC}"
  ((PASSED++))
else
  echo -e "${YELLOW}⚠️  $OBSOLETE_REFS referência(s) obsoleta(s) encontrada(s)${NC}"
  echo -e "${YELLOW}   Execute: grep -r 'landing/\\|nuxt-app/\\|monorepo' . --exclude-dir=node_modules${NC}"
  ((WARNINGS++))
fi

echo ""

# ============================================
# 6. README.md
# ============================================
echo -e "${BLUE}📖 6. Verificando README.md...${NC}"

if [ -f "README.md" ]; then
  # Verificar se menciona outros repos
  if grep -qi "smart-ui\|neo-smart" README.md; then
    echo -e "${GREEN}✅ README.md menciona ecossistema${NC}"
    ((PASSED++))
  else
    echo -e "${YELLOW}⚠️  README.md não menciona outros repos do ecossistema${NC}"
    ((WARNINGS++))
  fi

  # Verificar se NÃO menciona monorepo
  if grep -qi "monorepo\|workspace" README.md; then
    echo -e "${YELLOW}⚠️  README.md menciona monorepo/workspace${NC}"
    ((WARNINGS++))
  else
    echo -e "${GREEN}✅ README.md sem referências ao monorepo${NC}"
    ((PASSED++))
  fi
else
  echo -e "${RED}❌ README.md não encontrado${NC}"
  ((FAILED++))
fi

echo ""

# ============================================
# RESUMO
# ============================================
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}📊 RESUMO DA VALIDAÇÃO${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${GREEN}✅ Passou: $PASSED${NC}"
echo -e "${YELLOW}⚠️  Avisos: $WARNINGS${NC}"
echo -e "${RED}❌ Falhou: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ] && [ $WARNINGS -eq 0 ]; then
  echo -e "${GREEN}🎉 Repositório está 100% consistente!${NC}"
  exit 0
elif [ $FAILED -eq 0 ]; then
  echo -e "${YELLOW}✅ Repositório está OK, mas tem alguns avisos para revisar.${NC}"
  exit 0
else
  echo -e "${RED}❌ Repositório tem problemas que precisam ser corrigidos.${NC}"
  exit 1
fi
