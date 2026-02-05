#!/bin/bash

# NΞØ SMART FACTORY - Rollback Script
# Performs complete rollback: Git + Database + Configuration
#
# Usage:
#   ./scripts/rollback.sh [git-commit-hash] [database-backup-file]
#   Or: make rollback commit=<hash> backup=<file>
#
# ⚠️  CRITICAL: This is a DESTRUCTIVE operation
# Only use for disaster recovery in production

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}========================================${NC}"
echo -e "${RED}🔄 NΞØ ROLLBACK PROCEDURE - PHASE 2${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""
echo -e "${RED}⚠️  WARNING: This is a DESTRUCTIVE operation${NC}"
echo -e "${RED}⚠️  Only proceed if you need to revert to a previous state${NC}"
echo ""

GIT_COMMIT="$1"
DB_BACKUP="$2"

# Validation
if [ -z "$GIT_COMMIT" ]; then
  echo -e "${RED}❌ Git commit hash required${NC}"
  echo "Usage: ./scripts/rollback.sh [git-commit-hash] [database-backup-file]"
  echo ""
  echo "Recent commits:"
  git log --oneline -5
  exit 1
fi

# Verify git commit exists
if ! git cat-file -e "$GIT_COMMIT^{commit}" 2>/dev/null; then
  echo -e "${RED}❌ Invalid git commit: $GIT_COMMIT${NC}"
  exit 1
fi

echo -e "${CYAN}📋 ROLLBACK PLAN:${NC}"
echo -e "  1. Git rollback to: ${YELLOW}$GIT_COMMIT${NC}"
if [ -n "$DB_BACKUP" ]; then
  echo -e "  2. Database restore from: ${YELLOW}$DB_BACKUP${NC}"
else
  echo -e "  2. Database restore: ${YELLOW}SKIPPED${NC} (no backup file provided)"
fi
echo -e "  3. Verification"
echo -e "  4. Vercel re-deploy (automatic on git push)"
echo ""

# Safety confirmation
read -p "$(echo -e ${RED}Type 'ROLLBACK' to confirm \(any other input will abort\): ${NC})" CONFIRMATION

if [ "$CONFIRMATION" != "ROLLBACK" ]; then
  echo -e "${YELLOW}❌ Rollback aborted by user.${NC}"
  exit 0
fi

echo ""
echo -e "${CYAN}========================================${NC}"
echo -e "${YELLOW}🚀 INITIATING ROLLBACK SEQUENCE${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""

# PHASE 1: Create emergency backup of current state
echo -e "${YELLOW}[PHASE 1/4] Creating emergency backup of current state...${NC}"
EMERGENCY_BACKUP_DIR="./backups/emergency_$(date +"%Y%m%d_%H%M%S")"
mkdir -p "$EMERGENCY_BACKUP_DIR"

# Save current git state
CURRENT_COMMIT=$(git rev-parse HEAD)
echo "$CURRENT_COMMIT" > "${EMERGENCY_BACKUP_DIR}/previous_commit.txt"
git diff > "${EMERGENCY_BACKUP_DIR}/uncommitted_changes.patch" 2>/dev/null || true
git status --porcelain > "${EMERGENCY_BACKUP_DIR}/git_status.txt" 2>/dev/null || true

echo -e "${GREEN}✓ Emergency backup created: $EMERGENCY_BACKUP_DIR${NC}"
echo -e "  Previous commit: $CURRENT_COMMIT"
echo ""

# PHASE 2: Git rollback
echo -e "${YELLOW}[PHASE 2/4] Performing git rollback...${NC}"

# Stash any uncommitted changes
if [[ -n $(git status --porcelain) ]]; then
  echo -e "${YELLOW}  Stashing uncommitted changes...${NC}"
  git stash save "Rollback stash - $(date)"
fi

# Reset to target commit
echo -e "${YELLOW}  Resetting to commit: $GIT_COMMIT${NC}"
git reset --hard "$GIT_COMMIT"

# Verify
CURRENT_HEAD=$(git rev-parse HEAD)
if [ "$CURRENT_HEAD" = "$GIT_COMMIT" ]; then
  echo -e "${GREEN}✓ Git rollback successful${NC}"
else
  echo -e "${RED}✗ Git rollback failed - HEAD mismatch${NC}"
  echo -e "${YELLOW}  Attempting to restore from emergency backup...${NC}"
  git reset --hard "$CURRENT_COMMIT"
  exit 1
fi
echo ""

# PHASE 3: Database restore (if backup provided)
if [ -n "$DB_BACKUP" ]; then
  echo -e "${YELLOW}[PHASE 3/4] Restoring database...${NC}"

  if [ ! -f "$DB_BACKUP" ]; then
    echo -e "${RED}✗ Database backup file not found: $DB_BACKUP${NC}"
    echo -e "${YELLOW}  Skipping database restore${NC}"
  else
    # Run database restore script
    if [ -f "scripts/restore-database.js" ]; then
      echo -e "${YELLOW}  Running database restore...${NC}"
      node scripts/restore-database.js "$DB_BACKUP" <<< "yes"
      echo -e "${GREEN}✓ Database restore complete${NC}"
    else
      echo -e "${RED}✗ restore-database.js not found${NC}"
      echo -e "${YELLOW}  Manual database restore required${NC}"
    fi
  fi
else
  echo -e "${YELLOW}[PHASE 3/4] Database restore skipped (no backup provided)${NC}"
fi
echo ""

# PHASE 4: Verification
echo -e "${YELLOW}[PHASE 4/4] Verifying rollback...${NC}"

# Verify git state
echo -e "${YELLOW}  Checking git state...${NC}"
FINAL_COMMIT=$(git rev-parse HEAD)
if [ "$FINAL_COMMIT" = "$GIT_COMMIT" ]; then
  echo -e "    ${GREEN}✓ Git: Rolled back to $GIT_COMMIT${NC}"
else
  echo -e "    ${RED}✗ Git: Unexpected state${NC}"
fi

# Check if package.json changed (may need npm install)
if git diff --name-only "$CURRENT_COMMIT" "$GIT_COMMIT" | grep -q "package.json"; then
  echo -e "${YELLOW}  package.json changed - running npm install...${NC}"
  npm install
  echo -e "    ${GREEN}✓ Dependencies updated${NC}"
fi

# Build verification
echo -e "${YELLOW}  Verifying build...${NC}"
if npm run build > /dev/null 2>&1; then
  echo -e "    ${GREEN}✓ Build: Successful${NC}"
else
  echo -e "    ${RED}✗ Build: Failed${NC}"
  echo -e "    ${YELLOW}Review build errors before deploying${NC}"
fi

echo ""
echo -e "${CYAN}========================================${NC}"
echo -e "${GREEN}✅ ROLLBACK COMPLETE${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""
echo -e "${CYAN}📊 ROLLBACK SUMMARY:${NC}"
echo -e "  Rolled back from: ${RED}$CURRENT_COMMIT${NC}"
echo -e "  Rolled back to:   ${GREEN}$GIT_COMMIT${NC}"
echo -e "  Emergency backup: ${YELLOW}$EMERGENCY_BACKUP_DIR${NC}"
echo ""
echo -e "${YELLOW}🔄 NEXT STEPS:${NC}"
echo -e "  1. Review changes: git diff $GIT_COMMIT $CURRENT_COMMIT"
echo -e "  2. Test application locally: make dev"
echo -e "  3. Push to trigger Vercel re-deploy: git push origin main --force"
echo -e "     ${RED}⚠️  Force push required - coordinate with team${NC}"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANT:${NC}"
echo -e "  - Application is in rolled-back state"
echo -e "  - Vercel is still serving old version (until push)"
echo -e "  - Emergency backup available at: $EMERGENCY_BACKUP_DIR"
echo -e "  - Coordinate with team before force pushing"
echo ""
echo -e "${CYAN}🔙 TO UNDO THIS ROLLBACK:${NC}"
echo -e "  git reset --hard $CURRENT_COMMIT"
echo -e "  # Or use emergency backup files"
echo ""
