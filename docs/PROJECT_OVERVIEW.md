# NΞØ SMART FACTORY — Visão Geral Técnica e Estratégica

**Data:** 2026-01-24  
**Status:** Ativo  
**Categoria:** Arquitetura  
**Audiência:** Todos

---

## 🌌 A Visão
A **NΞØ SMART FACTORY** é uma infraestrutura completa de **Fábrica de Tokens e Contratos Inteligentes**. Nosso objetivo é democratizar o acesso a protocolos on-chain através de um modelo "Hacker Ethics": sem barreiras de KYC, focado em segurança por design e transparência radical.

## 🏗️ Modelo de Negócio (Estratégia)
Nesta fábrica, o deploy inicial tem **Custo Zero Upfront** (apenas o gas da rede). A sustentabilidade do ecossistema é baseada em:
1. **Taxa Base**: Cada token gerado possui uma **taxa de 5% embutida no contrato**, garantindo receita perpétua e automática para a NEØ.
2. **Upsells Premium (O Funil Smart Mint)**:
    *   **IA de Naming/Symbol**: Sugestões inteligentes para o projeto.
    *   **Custom Logo**: Geração/Design de identidade visual.
    *   **Whitepaper Editável**: Geração de documentação técnica via IA.
    *   **Marketing Boost**: Sugestão de campanhas para redes sociais.
    *   **Support Tier**: Atendimento humano direto com nossos especialistas.

## 🏗️ O que o projeto faz (Core Business)
*   **Smart Mint**: Interface de alta fidelidade para **compilação** e **deploy** de novos ativos.
*   **Persistência e Drafts**: Sistema que permite salvar rascunhos de projetos e histórico de deploys globais.
*   **Estratégia On-Chain**: Otimização de custos de gas com seletor de prioridade (Slow/Normal/Fast).

## 🏗️ Arquitetura Técnica (Multi-Módulo)

### 1. Painel Principal (Next.js) - "O Comandante"
*   **Propósito**: Interface avançada da Smart Mint.
*   **Papel**: Centro de comando para configurar lógica de contratos, estimativa de gas e execução de deploys.
*   **Tecnologias**: Next.js 14, React 18, Tailwind CSS, Persistência Local/Global.

### 2. Motor Mobile (Nuxt App) - "O Agente"
*   **Propósito**: PWA otimizado para lançamentos rápidos e dashboards de monitoramento.
*   **Papel**: Foco em **Q2** para integração em dApps e Telegram Mini Apps.
*   **Tecnologias**: Nuxt 3, Pinia, Vue 3.

### 3. Portal de Entrada (Landing Page)
*   **Propósito**: Funil de entrada e educação do usuário sobre o modelo de 5% fee.

## 🔐 Segurança e Validação

### Validação de Endereços de Wallet

Todos os endereços Ethereum passam por validação rigorosa antes do uso:

*   **`src/utils/addressValidation.js`** — Utilitários baseados em ethers.js v6:
    *   `validateAddress(address)` — Valida formato, prefixo `0x`, comprimento (42 chars) e checksum EIP-55; retorna endereço normalizado.
    *   `formatAddress(address)` — Formata endereço para exibição (`0x1234...5678`).
    *   `isSameAddress(addr1, addr2)` — Comparação case-insensitive via `getAddress()`.
    *   `formatHash(hash)` — Formata hashes de transação para exibição.
*   **`src/components/ui/AddressInput.jsx`** — Campo de endereço com validação em tempo real, ícones de feedback visual (✓/✗) e cópia para área de transferência.
*   **`src/components/WalletConnect.jsx`** — Normaliza endereços recebidos do Dynamic.xyz para o formato checksummed EIP-55 antes de repassá-los para callbacks.

## 🚀 Status e Filosofia
*   **Versão**: v0.5.6
*   **Filosofia**: Sem KYC, Código Aberto (Auditável), Validações Técnicas Pró-Usuário.

---
*Organização NEO Smart Token Factory — 2026.*
