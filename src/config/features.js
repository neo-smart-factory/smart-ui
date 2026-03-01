/**
 * NΞØ Smart Factory — Feature Flags Configuration
 *
 * Este arquivo controla quais features estão disponíveis em cada fase de produção.
 *
 * Estratégia de Lançamento por Fases:
 * - Phase 1: Foundation Layer (PRODUCTION) - Status: LIVE
 * - Phase 2: Web3 Integration (IN DEVELOPMENT) - Previsão: Q1 2026
 * - Phase 3: AI & Automation (PLANNED) - Previsão: Q2 2026
 *
 * @see docs/NEXT_STEPS.md para roadmap completo
 */

/**
 * Feature Flags por Fase
 *
 * Cada fase define quais features estão:
 * - true: Disponível e ativo em produção
 * - false: Bloqueado, será liberado em fase futura
 */
export const FEATURES = {
  phase1: {
    // Foundation Layer - Features básicas em produção
    dashboard: true,
    analytics: true,
    auth: true,
    marketing: true,
    sessionTracking: true,
    deployHistory: true,
    simulationMode: false, // Modo simulação para demonstração
  },
  phase2: {
    // Web3 Integration - LIVE/BETA
    web3: true,
    realTransactions: true,
    walletConnection: true,
    onChainEvents: true,
    contractDeployment: true,
  },
  phase3: {
    // AI & Automation - Planejado
    aiDoctor: false,
    narrativeGenerator: false,
    predictiveAnalytics: false,
    automatedValidation: false,
  },
};

/**
 * Informações sobre cada fase (para UI/Comunicação)
 */
export const PHASE_INFO = {
  phase1: {
    name: "Foundation Layer",
    status: "LIVE",
    description: "Features básicas disponíveis para uso real",
    availableFeatures: [
      "Dashboard e visualização de métricas",
      "Sistema de autenticação e sessões",
      "Analytics e tracking de marketing",
      "API routes para persistência de dados",
      "Database Neon configurado e operacional",
    ],
    lockedFeatures: [
      "Transações blockchain reais (Phase 2)",
      "AI Integration (Phase 3)",
    ],
  },
  phase2: {
    name: "Web3 Integration",
    status: "LIVE",
    description: "Integração com blockchain e transações reais",
    estimatedRelease: "Disponível Agora",
    lockedFeatures: [
      "Transações blockchain reais (Phase 2)",
      "AI Integration (Phase 3)",
    ],
    plannedFeatures: [
      "Wallet connection (Dynamic.xyz)",
      "Transações blockchain reais",
      "On-chain event listening",
      "Deploy de contratos via UI",
    ],
  },
  phase3: {
    name: "AI & Automation",
    status: "PLANNED",
    description: "Inteligência artificial e automações",
    estimatedRelease: "Q2 2026",
    plannedFeatures: [
      "Doctor AI via Modal.com",
      "Narrative generator automático",
      "Predictive analytics",
      "Automated contract validation",
    ],
  },
};

/**
 * Helper: Verifica se uma feature está disponível
 *
 * @param {string} phase - Fase da feature ('phase1', 'phase2', 'phase3')
 * @param {string} feature - Nome da feature
 * @returns {boolean} - true se a feature está disponível
 *
 * @example
 * isFeatureEnabled('phase1', 'dashboard') // true
 * isFeatureEnabled('phase2', 'web3') // false
 */
export function isFeatureEnabled(phase, feature) {
  if (!FEATURES[phase]) {
    console.warn(`[FEATURES] Phase "${phase}" não existe`);
    return false;
  }

  if (!(feature in FEATURES[phase])) {
    console.warn(
      `[FEATURES] Feature "${feature}" não existe na phase "${phase}"`
    );
    return false;
  }

  return FEATURES[phase][feature] === true;
}

/**
 * Helper: Obtém todas as features de uma fase
 *
 * @param {string} phase - Fase ('phase1', 'phase2', 'phase3')
 * @returns {Object} - Objeto com todas as features da fase
 */
export function getPhaseFeatures(phase) {
  return FEATURES[phase] || {};
}

/**
 * Helper: Obtém informações de uma fase
 *
 * @param {string} phase - Fase ('phase1', 'phase2', 'phase3')
 * @returns {Object} - Informações da fase
 */
export function getPhaseInfo(phase) {
  return PHASE_INFO[phase] || null;
}

/**
 * Helper: Obtém a fase atual (baseado em features ativas)
 *
 * @returns {string} - Fase atual ('phase1', 'phase2', 'phase3')
 */
export function getCurrentPhase() {
  // Se Phase 2 tem alguma feature ativa, estamos na Phase 2
  if (Object.values(FEATURES.phase2).some((v) => v === true)) {
    return "phase2";
  }

  // Se Phase 3 tem alguma feature ativa, estamos na Phase 3
  if (Object.values(FEATURES.phase3).some((v) => v === true)) {
    return "phase3";
  }

  // Padrão: Phase 1
  return "phase1";
}

/**
 * Helper: Verifica se estamos em modo de desenvolvimento/teste
 * Permite sobrescrever features via variáveis de ambiente
 *
 * @param {string} phase - Fase da feature
 * @param {string} feature - Nome da feature
 * @returns {boolean} - true se a feature está disponível (considerando overrides)
 */
export function isFeatureEnabledWithOverride(phase, feature) {
  // Verificar override via variável de ambiente (apenas em dev)
  const envKey = `VITE_FEATURE_${phase.toUpperCase()}_${feature.toUpperCase()}`;
  const envOverride = import.meta.env[envKey];

  if (envOverride !== undefined) {
    return envOverride === "true" || envOverride === true;
  }

  // Retornar valor padrão
  return isFeatureEnabled(phase, feature);
}

/**
 * Export default para compatibilidade
 */
export default {
  FEATURES,
  PHASE_INFO,
  isFeatureEnabled,
  getPhaseFeatures,
  getPhaseInfo,
  getCurrentPhase,
  isFeatureEnabledWithOverride,
};
