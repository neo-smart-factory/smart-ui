#!/bin/bash

# NΞØ SMART FACTORY — Safe Deploy & Commit Strategy
# Smart UI Core (smart-ui) — Single Repository

set -e # Exit immediately if a command exits with a non-zero status.

MSG="$1"

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 NΞØ DEPLOY SEQUENCE INITIATED...${NC}"

# 1. SECURITY CHECK (Audit & Lint)
echo -e "${YELLOW}🔒 [1/4] Checking Security & Code Quality...${NC}"
# Only warn on audit to prevent blocking critical workflow, but show it.
npm audit --audit-level=critical || echo -e "${RED}⚠️  Critical vulnerabilities found! Check output above.${NC}"
# Linting
echo "Running Linter..."
npm run lint -- --no-error-on-unmatched-pattern || echo -e "${YELLOW}⚠️  Lint warnings detected.${NC}"

# 2. BUILD CHECK
echo -e "${YELLOW}🏗️  [2/4] Verifying Build...${NC}"

CHANGED_FILES=$(git diff --name-only HEAD)

# Check Smart UI Core (Root)
if echo "$CHANGED_FILES" | grep -qE "^src/|^public/|^api/|vite.config|package.json|postcss.config|tailwind.config"; then
    echo -e "${GREEN}Detected changes in Smart UI Core. Building...${NC}"
    npm run build
fi

echo -e "${GREEN}✅ Build verification passed.${NC}"

# 3. COMMIT PREPARATION
echo -e "${YELLOW}📝 [3/4] Committing Changes...${NC}"

if [ -z "$MSG" ]; then
    echo -e "${RED}Error: Commit message required.${NC}"
    echo "Usage: make deploy msg=\"feat: description\""
    exit 1
fi

git add .
git commit -m "$MSG" || echo "Nothing to commit or already committed."

# 4. PUSH & DEPLOY TRIGGER
echo -e "${YELLOW}🚀 [4/4] Pushing to Vercel (via Git)...${NC}"

git push origin main

echo -e "${GREEN}✅ DEPLOY SEQUENCE COMPLETE!${NC}"
echo -e "Vercel will now auto-deploy Smart UI Core:"
echo -e "  - Smart UI Core: https://smart-ui-delta.vercel.app"
echo -e ""
echo -e "📦 Related repositories:"
echo -e "  - Landing: https://github.com/neo-smart-factory/smart-ui-landing"
echo -e "  - Mobile:  https://github.com/neo-smart-factory/smart-ui-mobile"
