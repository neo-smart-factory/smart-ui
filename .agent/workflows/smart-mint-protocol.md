---
description: NΞØ Smart Mint - Sincronização e Operações Multi-Repo
---

# NΞØ Smart Mint Protocol

Este workflow garante que as alterações no `smart-ui` estejam alinhadas com o `smart-core`, registradas no `docs` e reportadas no `internal-ops`.

## 🔄 Fluxo de Trabalho Padrão

### 1. Verificação de Alinhamento (Core)

Sempre que alterar uma interação com contrato:

-Verifique a última versão do contrato em `${CORE_CONTRACTS_PATH:-../neo-smart-factory/smart-core/contracts/}`
-Garanta que a ABI no frontend (`smart-ui`) corresponde ao deploy atual.
-**Nota:** Use variável de ambiente `CORE_CONTRACTS_PATH` ou caminho relativo padrão

### 2. Registro em Documentação (Docs)

Após concluir uma tarefa significativa:

-Leia `${DOCS_DIR:-../neo-smart-factory/docs}/changelog.md`
-Adicione a nova alteração seguindo o padrão de nomenclatura NΞØ.
-Se for uma mudança de versão, atualize o patch correspondente em `${DOCS_DIR:-../neo-smart-factory/docs}/patch-v*.md`.

### 3. Reporte de Operações (Internal Ops)

-Atualize o estado em `${INTERNAL_OPS_PATH:-../neo-smart-factory/internal-ops/state.json}` (se existir).
-Opcionalmente, gere um snippet de marketing em `${INTERNAL_OPS_PATH:-../neo-smart-factory/internal-ops}/marketing/` descrevendo o update.
-**Nota:** Configure `INTERNAL_OPS_PATH` no `.env` para seu ambiente

### 4. Sincronização de Build (CLI)

- Verifique se a CLI precisa de atualização em `${CLI_DIR:-../neo-smart-factory/smart-cli/}`.
- Teste se `neo-smart-factory status` reflete as mudanças.
- **Nota:** Use variável de ambiente ou caminho relativo conforme sua estrutura local

## 🛠 Comandos de Atalho (Para o Agente)

-`NEO::doc <mensagem>` -> Adicionar ao changelog.
-`NEO::sync` -> Verificar integridade entre UI e Core.
-`NEO::ops <status>` -> Atualizar status no Internal Ops.

// turbo-all

## 🚀 Execução Sugerida

1.Ler arquivos de configuração global no repositório `neo-smart-factory`.
2. Identificar discrepâncias de versão.
3. Consolidar documentação.
