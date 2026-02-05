#!/bin/bash

# NΞØ SMART FACTORY - Pre-Deploy Validation
# Runs comprehensive checks before any production deployment
# PHASE 2: Backup & Rollback Strategy
#
# Usage:
#   ./scripts/pre-deploy-check.sh
#   Or: make pre-deploy-check

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

ERRORS=0
WARNINGS=0

echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}🔍 NΞØ PRE-DEPLOY VALIDATION - PHASE 2${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""

# CHECK 1: Git status
echo -e "${YELLOW}[1/8] Checking git status...${NC}"
if [[ -n $(git status --porcelain) ]]; then
  echo -e "  ${YELLOW}⚠️  Uncommitted changes detected${NC}"
  WARNINGS=$((WARNINGS + 1))
  git status --short
else
  echo -e "  ${GREEN}✓ Working directory clean${NC}"
fi
echo ""

# CHECK 2: Git branch
echo -e "${YELLOW}[2/8] Checking git branch...${NC}"
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" != "main" ]; then
  echo -e "  ${YELLOW}⚠️  Not on main branch (currently: $CURRENT_BRANCH)${NC}"
  WARNINGS=$((WARNINGS + 1))
else
  echo -e "  ${GREEN}✓ On main branch${NC}"
fi
echo ""

# CHECK 3: Environment variables
echo -e "${YELLOW}[3/8] Checking environment configuration...${NC}"
if [ ! -f ".env.example" ]; then
  echo -e "  ${RED}✗ .env.example not found${NC}"
  ERRORS=$((ERRORS + 1))
else
  echo -e "  ${GREEN}✓ .env.example exists${NC}"
fi

# Check critical environment variables (from .env.example)
REQUIRED_VARS=("DATABASE_URL" "VITE_CHAIN_ID" "VITE_RPC_URL")
for var in "${REQUIRED_VARS[@]}"; do
  if grep -q "^$var=" .env.example; then
    echo -e "  ${GREEN}✓${NC} $var documented"
  else
    echo -e "  ${YELLOW}⚠️${NC}  $var not documented"
    WARNINGS=$((WARNINGS + 1))
  fi
done
echo ""

# CHECK 4: Dependencies
echo -e "${YELLOW}[4/8] Checking dependencies...${NC}"
if [ ! -d "node_modules" ]; then
  echo -e "  ${RED}✗ node_modules not found - run: npm install${NC}"
  ERRORS=$((ERRORS + 1))
else
  echo -e "  ${GREEN}✓ node_modules exists${NC}"
fi

# Check for security vulnerabilities
echo -e "  ${YELLOW}Running security audit...${NC}"
if npm audit --audit-level=critical 2>&1 | grep -q "0 vulnerabilities"; then
  echo -e "  ${GREEN}✓ No critical vulnerabilities${NC}"
else
  echo -e "  ${YELLOW}⚠️  Security vulnerabilities found - review 'npm audit'${NC}"
  WARNINGS=$((WARNINGS + 1))
fi
echo ""

# CHECK 5: Code quality (lint)
echo -e "${YELLOW}[5/8] Checking code quality...${NC}"
if npm run lint > /dev/null 2>&1; then
  echo -e "  ${GREEN}✓ Linting passed${NC}"
else
  echo -e "  ${RED}✗ Linting failed - run: npm run lint${NC}"
  ERRORS=$((ERRORS + 1))
fi
echo ""

# CHECK 6: Build verification
echo -e "${YELLOW}[6/8] Verifying build...${NC}"
if npm run build > /dev/null 2>&1; then
  echo -e "  ${GREEN}✓ Build successful${NC}"

  # Check build size
  if [ -d "dist" ]; then
    BUILD_SIZE=$(du -sh dist | cut -f1)
    echo -e "  ${CYAN}ℹ${NC}  Build size: $BUILD_SIZE"
  fi
else
  echo -e "  ${RED}✗ Build failed - run: npm run build${NC}"
  ERRORS=$((ERRORS + 1))
fi
echo ""

# CHECK 7: Database connectivity (if DATABASE_URL is set)
echo -e "${YELLOW}[7/8] Checking database connectivity...${NC}"
if [ -z "$DATABASE_URL" ]; then
  echo -e "  ${YELLOW}⊘${NC}  DATABASE_URL not set (skipping)"
else
  if node -e "
    import postgres from 'postgres';
    const sql = postgres(process.env.DATABASE_URL, { max: 1 });
    sql\`SELECT 1\`.then(() => { console.log('OK'); process.exit(0); }).catch(() => process.exit(1)).finally(() => sql.end());
  " 2>/dev/null; then
    echo -e "  ${GREEN}✓ Database connection successful${NC}"
  else
    echo -e "  ${RED}✗ Database connection failed${NC}"
    ERRORS=$((ERRORS + 1))
  fi
fi
echo ""

# CHECK 8: Backup readiness
echo -e "${YELLOW}[8/8] Checking backup readiness...${NC}"

# Check if backup directory exists
if [ ! -d "backups" ]; then
  mkdir -p backups
  echo -e "  ${YELLOW}⚠️  Backups directory created${NC}"
fi

# Check for recent backups
RECENT_BACKUPS=$(find backups -name "*.sql" -mtime -7 2>/dev/null | wc -l)
if [ "$RECENT_BACKUPS" -gt 0 ]; then
  echo -e "  ${GREEN}✓ Recent database backups exist ($RECENT_BACKUPS in last 7 days)${NC}"
else
  echo -e "  ${YELLOW}⚠️  No recent database backups - run: make backup-db${NC}"
  WARNINGS=$((WARNINGS + 1))
fi

# Check for backup scripts
BACKUP_SCRIPTS=("backup-database.js" "restore-database.js" "snapshot-config.sh" "rollback.sh")
for script in "${BACKUP_SCRIPTS[@]}"; do
  if [ -f "scripts/$script" ]; then
    echo -e "  ${GREEN}✓${NC} $script exists"
  else
    echo -e "  ${RED}✗${NC} $script missing"
    ERRORS=$((ERRORS + 1))
  fi
done
echo ""

# SUMMARY
echo -e "${CYAN}========================================${NC}"
if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
  echo -e "${GREEN}✅ ALL CHECKS PASSED${NC}"
  echo -e "${CYAN}========================================${NC}"
  echo ""
  echo -e "${GREEN}✓ Ready for deployment${NC}"
  echo ""
  echo -e "${YELLOW}📋 Pre-deployment checklist:${NC}"
  echo -e "  1. Create backup: make backup-db"
  echo -e "  2. Create snapshot: make snapshot-config"
  echo -e "  3. Deploy: make deploy msg=\"feat: description\""
  echo ""
  exit 0
elif [ $ERRORS -eq 0 ]; then
  echo -e "${YELLOW}⚠️  CHECKS PASSED WITH WARNINGS${NC}"
  echo -e "${CYAN}========================================${NC}"
  echo -e "  Warnings: $WARNINGS"
  echo ""
  echo -e "${YELLOW}Review warnings above before deploying${NC}"
  echo ""
  exit 0
else
  echo -e "${RED}❌ CHECKS FAILED${NC}"
  echo -e "${CYAN}========================================${NC}"
  echo -e "  Errors: $ERRORS"
  echo -e "  Warnings: $WARNINGS"
  echo ""
  echo -e "${RED}Fix errors above before deploying${NC}"
  echo ""
  exit 1
fi
