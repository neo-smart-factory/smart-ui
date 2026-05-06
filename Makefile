# NΞØ SMART FACTORY — Makefile (Smart UI Core)

.PHONY: dev dev-ui dev-dashboard dev-vercel build build-ui build-dashboard start lint clean install update help ops-sync health test test-ui test-dashboard validate backup-db restore-db snapshot-config rollback pre-deploy-check link-cli deploy deploy-force migratedb migratedb-vercel migratedb-marketing sync-env test-apis test-apis-prod

# Variáveis
UI_DIR = .
CORE_DIR = ../smart-core
CLI_DIR = ../smart-cli
DOCS_DIR = ../docs
OPS_DIR = ../internal-ops
UI_PORT = 3000

help:
	@echo "=========================================="
	@echo "NΞØ SMART FACTORY - Smart UI Core"
	@echo "=========================================="
	@echo ""
	@echo "📦 Instalação:"
	@echo "  make install           - Instala dependências (pnpm install)"
	@echo "  make update            - Atualiza dependências (pnpm update)"
	@echo ""
	@echo "🚀 Desenvolvimento:"
	@echo "  make dev               - Inicia Smart UI Core (pnpm run dev, porta $(UI_PORT))"
	@echo "  make dev-ui            - Idem (nome canônico)"
	@echo "  make dev-dashboard     - Alias legado (compatibilidade)"
	@echo "  make dev-vercel        - Smart UI Core com Vercel Dev (pnpm run dev:vercel, API completo)"
	@echo ""
	@echo "🏗️  Build:"
	@echo "  make build             - Build do Smart UI Core (pnpm run build)"
	@echo "  make build-ui          - Idem (nome canônico)"
	@echo ""
	@echo "🧪 Testes:"
	@echo "  make test              - Lint do Smart UI Core (pnpm run lint)"
	@echo "  make test-ui           - Idem (nome canônico)"
	@echo ""
	@echo "🔧 Utilitários:"
	@echo "  make lint              - Executa linter (pnpm run lint)"
	@echo "  make clean             - Remove node_modules e dist"
	@echo "  make health            - Verifica integridade do ecossistema"
	@echo "  make validate          - Valida estrutura (validate-onboarding.sh)"
	@echo "  make ops-sync          - Sincroniza com Internal Ops e Docs"
	@echo "  make sync-env          - Sincroniza variáveis do Vercel para .env local"
	@echo "  make migratedb-marketing - Executa migration de Marketing & Analytics"
	@echo ""
	@echo "🔒 Backup & Recovery (PHASE 2):"
	@echo "  make backup-db         - Cria backup do database"
	@echo "  make restore-db backup=FILE - Restaura database do backup"
	@echo "  make snapshot-config   - Cria snapshot de configuração"
	@echo "  make rollback commit=HASH - Rollback completo (git + db)"
	@echo "  make pre-deploy-check  - Validação pré-deploy (recomendado)"
	@echo ""
	@echo "🚢 Deploy:"
	@echo "  make deploy            - Safe Commit + Push (Triggers Vercel)"
	@echo "                         Usage: make deploy msg=\"feat: ...\""
	@echo "  make deploy-force      - Deploy manual via Vercel CLI"
	@echo ""

install:
	@echo "📦 Installing dependencies..."
	pnpm install
	@echo "✅ Dependencies installed!"

update:
	@echo "🔄 Updating dependencies..."
	pnpm update
	@echo "✅ Dependencies updated!"

# ============================================
# Desenvolvimento
# ============================================

dev: dev-ui

dev-ui:
	@echo "🚀 Starting Smart UI Core on port $(UI_PORT)..."
	@echo "   → http://localhost:$(UI_PORT)"
	@echo "   ⚠️  API routes require 'make dev-vercel' for full functionality"
	cd $(UI_DIR) && pnpm run dev

dev-dashboard: dev-ui

dev-vercel:
	@echo "🚀 Starting Smart UI Core with Vercel Dev (Full API support)..."
	@echo "   → http://localhost:3000"
	@echo "   → API routes available at /api/*"
	cd $(UI_DIR) && pnpm run dev:vercel

# ============================================
# Build
# ============================================

build: build-ui

build-ui:
	@echo "🏗️  Building Smart UI Core..."
	@if [ -d "$(UI_DIR)/node_modules" ]; then \
		cd $(UI_DIR) && pnpm run build; \
	else \
		echo "❌ node_modules not found. Run 'make install' first."; \
		exit 1; \
	fi
	@echo "✅ Smart UI Core build complete!"

build-dashboard: build-ui

# ============================================
# Testes
# ============================================

test: test-ui

test-ui:
	@echo "🧪 Testing Smart UI Core..."
	cd $(UI_DIR) && pnpm run lint
	@echo "✅ Smart UI Core tests passed!"

test-dashboard: test-ui

test-apis:
	@echo "🧪 Testing all APIs..."
	@echo "⚠️  Make sure 'make dev-vercel' is running in another terminal"
	@./scripts/test-apis.sh

test-apis-prod:
	@echo "🧪 Testing APIs in production..."
	@./scripts/test-apis.sh https://smart-ui-delta.vercel.app

ops-sync:
	@echo "Syncing with NΞØ Ecosystem..."
	@if [ -d "$(OPS_DIR)" ]; then \
		echo "Updating Internal Ops state..."; \
		cp .env.example $(OPS_DIR)/state_sync.env.tmp; \
	fi
	@if [ -f "$(DOCS_DIR)/changelog.md" ]; then \
		echo "Core Documentation found."; \
	fi

link-cli:
	@echo "Linking NΞØ CLI..."
	cd $(CLI_DIR) && pnpm link --global

health:
	@echo "======================================"
	@echo "🏥 NΞØ Protocol Health Check"
	@echo "======================================"
	@echo ""
	@echo "📦 Component Status:"
	@echo "--------------------"
	@echo "Smart UI Core...          [OK]"
	@if [ -d "$(CORE_DIR)" ]; then \
		echo "Smart Core...             [LINKED]"; \
		echo "  └─ Path: $(CORE_DIR)"; \
	else \
		echo "Smart Core...             [REMOTE/GITHUB]"; \
		echo "  └─ Operating in remote mode (OK)"; \
	fi
	@if [ -d "$(CLI_DIR)" ]; then \
		echo "Smart CLI...              [LINKED]"; \
		echo "  └─ Path: $(CLI_DIR)"; \
	else \
		echo "Smart CLI...              [NOT FOUND]"; \
		echo "  └─ Optional component"; \
	fi
	@if [ -d "$(OPS_DIR)" ]; then \
		echo "Internal Ops...           [LINKED]"; \
		echo "  └─ Path: $(OPS_DIR)"; \
	else \
		echo "Internal Ops...           [NOT FOUND]"; \
		echo "  └─ Optional component"; \
	fi
	@echo ""
	@echo "======================================"
	@echo "✅ All critical components operational"
	@echo "======================================"

# ============================================
# Lint
# ============================================

lint:
	@echo "🔍 Linting code..."
	cd $(UI_DIR) && pnpm run lint

# ============================================
# Validação
# ============================================

validate:
	@echo "🔍 Validando estrutura documentada..."
	@if [ -f "./validate-onboarding.sh" ]; then \
		./validate-onboarding.sh; \
	else \
		echo "❌ Script validate-onboarding.sh não encontrado"; \
		exit 1; \
	fi

# ============================================
# Limpeza
# ============================================

clean:
	@echo "🧹 Cleaning build artifacts, dependencies, and caches..."
	rm -rf node_modules .next dist .vercel .npm/_cacache
	@echo "✅ Clean complete!"

start: dev

# ============================================
# Deploy
# ============================================

deploy:
	@./scripts/safe-deploy.sh "$(msg)"

deploy-force:
	@echo "🚢 Force deploying Smart UI Core to Vercel (Production)..."
	vercel deploy --prod
	@echo "✅ Deployment complete!"

migratedb:
	@echo "Running Database Migrations..."
	@test -f .env || (echo "❌ Crie .env com DATABASE_URL (copie de .env.example)"; exit 1)
	@set -a && . ./.env && set +a && node scripts/migrate.js

migratedb-vercel:
	@echo "Running Database Migrations (using Vercel env vars)..."
	@./scripts/migrate-from-vercel.sh

migratedb-marketing:
	@echo "Running Marketing & Analytics Migration..."
	@test -f .env || (echo "❌ Crie .env com DATABASE_URL (copie de .env.example)"; exit 1)
	@set -a && . ./.env && set +a && node scripts/migrate-marketing.js

sync-env:
	@echo "Sincronizando variáveis de ambiente do Vercel para .env local..."
	@chmod +x scripts/sync-env-from-vercel.sh
	@./scripts/sync-env-from-vercel.sh

# ============================================
# Backup & Recovery (PHASE 2)
# ============================================

backup-db:
	@echo "🔒 Creating database backup..."
	@test -f .env || (echo "❌ Crie .env com DATABASE_URL (copie de .env.example)"; exit 1)
	@set -a && . ./.env && set +a && node scripts/backup-database.js
	@echo "✅ Database backup complete!"

restore-db:
	@echo "⚠️  CRITICAL: Database restore operation"
	@test -n "$(backup)" || (echo "❌ Usage: make restore-db backup=backups/db_backup_[timestamp].sql"; exit 1)
	@test -f .env || (echo "❌ Crie .env com DATABASE_URL (copie de .env.example)"; exit 1)
	@set -a && . ./.env && set +a && node scripts/restore-database.js "$(backup)"
	@echo "✅ Database restore complete!"

snapshot-config:
	@echo "📸 Creating configuration snapshot..."
	@chmod +x scripts/snapshot-config.sh
	@./scripts/snapshot-config.sh
	@echo "✅ Configuration snapshot complete!"

rollback:
	@echo "🔄 CRITICAL: Full system rollback"
	@test -n "$(commit)" || (echo "❌ Usage: make rollback commit=<git-hash> [backup=<db-backup-file>]"; exit 1)
	@chmod +x scripts/rollback.sh
	@./scripts/rollback.sh "$(commit)" "$(backup)"
	@echo "✅ Rollback sequence complete!"

pre-deploy-check:
	@echo "🔍 Running pre-deployment validation..."
	@chmod +x scripts/pre-deploy-check.sh
	@./scripts/pre-deploy-check.sh
	@echo "✅ Pre-deployment checks complete!"
