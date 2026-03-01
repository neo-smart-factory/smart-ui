# 🚀 Plano de Migração: Phase 2 — Web3 Integration

**Status:** Draft / Planejamento  
**Versão:** 1.0  
**Data:** 26 de Janeiro de 2026  
**Responsável:** NΞØ Node Architecture Team

Este plano detalha os passos necessários para ativar a **Phase 2 (Web3 Integration)** no ecossistema NΞØ Smart Factory, permitindo transações reais na blockchain e abandonando o modo de simulação.

---

## 1. Pré-Requisitos Críticos

Antes de alterar os feature flags, os seguintes itens devem estar concluídos no repo `smart-core`:

- [ ] **Contratos Deployados:** Factory e Token base deployados nas redes (Base e Polygon).
- [ ] **ABIs Disponíveis:** Arquivos JSON dos ABIs exportados e acessíveis via `/packages/shared` ou copiados para `src/config/abis/`.
- [ ] **Endereços Oficiais:** Endereços dos contratos Factory configurados no `.env`.
- [ ] **Liquidez Inicial:** Tesouro NΞØ configurado para receber os 5% (500 bps) de taxa.

---

## 2. Roadmap de Implementação Técnica

### Passo 2.1: Configuração de Ambiente (Vercel & Local)

Configurar as variáveis reais que hoje estão como placeholder.

```env
VITE_ENABLE_WEB3=true
VITE_CHAIN_ID=8453 # Base Mainnet
VITE_FACTORY_ADDRESS=0x...
```

### Passo 2.2: Atualização de Feature Flags

Arquivo: `src/config/features.js`

- Mudar `phase2.realTransactions` de `false` para `true`.
- Garantir que `phase1.simulationMode` seja forçado para `false` quando em produção.

### Passo 2.3: Integração do Provider Ethers.js

No arquivo `src/App.jsx`, substituir a lógica de simulação em `handleDeploy` pelo envio real da transação:

1. Instanciar o contrato usando `dynamicWallet.signer`.
2. Chamar a função `deployToken` (ou equivalente) no contrato Factory.
3. Monitorar o recibo da transação e o evento de criação do token.

### Passo 2.4: Gerenciamento de Rede (Switching)

Implementar lógica no `WalletConnect.jsx` para forçar o usuário a mudar para a rede correta (ex: Base) se ele estiver em uma rede não suportada antes de permitir o deploy.

---

## 3. Checklist de Validação (QA)

- [ ] **Conexão:** Wallet conecta via Dynamic e recupera saldo real.
- [ ] **Estimativa de Gás:** O App avisa se o usuário não tem ETH suficiente na Base.
- [ ] **Assinatura:** O modal da wallet (MetaMask/Coinbase) abre corretamente para assinar o deploy.
- [ ] **Confirmação:** O componente `TransactionStatus` exibe o link do explorer real (Basescan).
- [ ] **Persistência:** O endereço do novo contrato é salvo corretamente no banco de dados Neon após a confirmação on-chain.

---

## 4. Estratégia de Rollout

1. **Beta Interno:** Ativar Phase 2 via override de ambiente (`VITE_FEATURE_PHASE2_REALTRANSACTIONS=true`) apenas no deploy de _staging_.
2. **Audit Final:** Testar deploy em Base Sepolia (Testnet).
3. **Mainnet Launch:** Atualizar `src/config/features.js` no branch `main` e fazer o deploy final.

---

## 5. Próximos Passos (Immediate TODOs)

1. [ ] Criar pasta `src/config/abis/` e importar os ABIs do `smart-core`.
2. [ ] Refatorar o hook `useTransactionStatus` para suportar `wait()` de transações do Ethers v6.
3. [ ] Atualizar o `ADMIN_MANAGEMENT_GUIDE.md` com instruções sobre como lidar com falhas de transação on-chain.

---

**Assinado:** NΞØ Node
