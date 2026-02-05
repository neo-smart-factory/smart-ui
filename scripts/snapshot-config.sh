#!/bin/bash

# NΞØ SMART FACTORY - Configuration Snapshot Script
# Creates a snapshot of all critical configuration files
# Saves to: backups/config_snapshot_[timestamp].tar.gz

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}📸 NΞØ CONFIGURATION SNAPSHOT - PHASE 2${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""

# Create backups directory
BACKUP_DIR="./backups"
mkdir -p "$BACKUP_DIR"

# Generate timestamp
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
SNAPSHOT_NAME="config_snapshot_${TIMESTAMP}"
SNAPSHOT_DIR="${BACKUP_DIR}/${SNAPSHOT_NAME}"
SNAPSHOT_ARCHIVE="${BACKUP_DIR}/${SNAPSHOT_NAME}.tar.gz"

echo -e "${YELLOW}📋 Creating configuration snapshot...${NC}"
echo ""

# Create temporary snapshot directory
mkdir -p "$SNAPSHOT_DIR"

# Snapshot metadata
echo "# NΞØ SMART FACTORY - Configuration Snapshot" > "${SNAPSHOT_DIR}/SNAPSHOT_INFO.txt"
echo "Generated: $(date -u +"%Y-%m-%d %H:%M:%S UTC")" >> "${SNAPSHOT_DIR}/SNAPSHOT_INFO.txt"
echo "Git Commit: $(git rev-parse HEAD 2>/dev/null || echo 'N/A')" >> "${SNAPSHOT_DIR}/SNAPSHOT_INFO.txt"
echo "Git Branch: $(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo 'N/A')" >> "${SNAPSHOT_DIR}/SNAPSHOT_INFO.txt"
echo "Node Version: $(node --version)" >> "${SNAPSHOT_DIR}/SNAPSHOT_INFO.txt"
echo "npm Version: $(npm --version)" >> "${SNAPSHOT_DIR}/SNAPSHOT_INFO.txt"
echo "" >> "${SNAPSHOT_DIR}/SNAPSHOT_INFO.txt"

# Critical configuration files to backup
CONFIG_FILES=(
  "package.json"
  "package-lock.json"
  "vite.config.js"
  "tailwind.config.cjs"
  "postcss.config.cjs"
  "tsconfig.json"
  "eslint.config.js"
  "vercel.json"
  ".env.example"
  "Makefile"
)

echo -e "${YELLOW}📦 Snapshotting configuration files:${NC}"
for file in "${CONFIG_FILES[@]}"; do
  if [ -f "$file" ]; then
    cp "$file" "$SNAPSHOT_DIR/"
    echo -e "  ${GREEN}✓${NC} $file"
  else
    echo -e "  ${YELLOW}⊘${NC} $file (not found, skipping)"
  fi
done

# Snapshot critical directories (structure only, no node_modules)
echo ""
echo -e "${YELLOW}📂 Snapshotting directory structures:${NC}"

# API routes
if [ -d "api" ]; then
  mkdir -p "${SNAPSHOT_DIR}/api"
  cp -r api/* "${SNAPSHOT_DIR}/api/" 2>/dev/null || true
  echo -e "  ${GREEN}✓${NC} api/"
fi

# Database migrations
if [ -d "migrations" ]; then
  mkdir -p "${SNAPSHOT_DIR}/migrations"
  cp -r migrations/* "${SNAPSHOT_DIR}/migrations/" 2>/dev/null || true
  echo -e "  ${GREEN}✓${NC} migrations/"
fi

# Library files
if [ -d "lib" ]; then
  mkdir -p "${SNAPSHOT_DIR}/lib"
  cp -r lib/* "${SNAPSHOT_DIR}/lib/" 2>/dev/null || true
  echo -e "  ${GREEN}✓${NC} lib/"
fi

# Scripts (excluding this file to avoid recursion)
if [ -d "scripts" ]; then
  mkdir -p "${SNAPSHOT_DIR}/scripts"
  cp -r scripts/* "${SNAPSHOT_DIR}/scripts/" 2>/dev/null || true
  echo -e "  ${GREEN}✓${NC} scripts/"
fi

# GitHub workflows
if [ -d ".github/workflows" ]; then
  mkdir -p "${SNAPSHOT_DIR}/.github/workflows"
  cp -r .github/workflows/* "${SNAPSHOT_DIR}/.github/workflows/" 2>/dev/null || true
  echo -e "  ${GREEN}✓${NC} .github/workflows/"
fi

# Git status
echo ""
echo -e "${YELLOW}🔍 Capturing git status...${NC}"
git status --porcelain > "${SNAPSHOT_DIR}/git_status.txt" 2>/dev/null || echo "Not a git repository" > "${SNAPSHOT_DIR}/git_status.txt"
git log -1 --pretty=format:"%H%n%an%n%ae%n%ad%n%s" > "${SNAPSHOT_DIR}/git_last_commit.txt" 2>/dev/null || echo "No commits" > "${SNAPSHOT_DIR}/git_last_commit.txt"

# Vercel environment variables (placeholder - requires manual export)
echo "# Vercel Environment Variables" > "${SNAPSHOT_DIR}/vercel_env_placeholder.txt"
echo "# Export using: vercel env pull .env.snapshot" >> "${SNAPSHOT_DIR}/vercel_env_placeholder.txt"
echo "# Then copy to this snapshot directory" >> "${SNAPSHOT_DIR}/vercel_env_placeholder.txt"
echo "" >> "${SNAPSHOT_DIR}/vercel_env_placeholder.txt"
echo "⚠️  MANUAL ACTION REQUIRED:" >> "${SNAPSHOT_DIR}/vercel_env_placeholder.txt"
echo "   Run: make sync-env" >> "${SNAPSHOT_DIR}/vercel_env_placeholder.txt"
echo "   Then copy .env to this snapshot" >> "${SNAPSHOT_DIR}/vercel_env_placeholder.txt"

# Create compressed archive
echo ""
echo -e "${YELLOW}🗜️  Compressing snapshot...${NC}"
tar -czf "$SNAPSHOT_ARCHIVE" -C "$BACKUP_DIR" "$SNAPSHOT_NAME"

# Calculate size
ARCHIVE_SIZE=$(du -h "$SNAPSHOT_ARCHIVE" | cut -f1)

# Clean up temporary directory
rm -rf "$SNAPSHOT_DIR"

echo ""
echo -e "${CYAN}========================================${NC}"
echo -e "${GREEN}✅ SNAPSHOT COMPLETE${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""
echo -e "📁 Snapshot saved to:"
echo -e "   ${SNAPSHOT_ARCHIVE}"
echo ""
echo -e "📊 Snapshot statistics:"
echo -e "   Size: ${ARCHIVE_SIZE}"
echo -e "   Files: Configuration + API routes + Migrations"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANT:${NC}"
echo -e "   - Store snapshots securely and version them"
echo -e "   - Export Vercel env vars separately (make sync-env)"
echo -e "   - Test restore procedure regularly"
echo -e "   - Keep snapshots for major changes/deployments"
echo ""
echo -e "🔄 To restore from this snapshot:"
echo -e "   tar -xzf ${SNAPSHOT_ARCHIVE} -C ./backups"
echo -e "   # Then manually copy files from extracted directory"
echo ""
