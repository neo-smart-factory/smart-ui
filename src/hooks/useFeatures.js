/**
 * NΞØ Smart Factory — React Hook para Feature Flags
 *
 * Hook customizado para facilitar o uso de feature flags nos componentes React.
 *
 * @example
 * ```jsx
 * import useFeatures from './hooks/useFeatures';
 *
 * function MyComponent() {
 *   const { isEnabled, currentPhase, phaseInfo } = useFeatures();
 *
 *   if (isEnabled('phase2', 'web3')) {
 *     return <WalletConnect />;
 *   }
 *
 *   return <Badge>Disponível em Phase 2 - Q1 2026</Badge>;
 * }
 * ```
 */

import { useMemo } from "react";
import {
  FEATURES,
  PHASE_INFO,
  getPhaseFeatures,
  getPhaseInfo,
  getCurrentPhase,
  isFeatureEnabledWithOverride,
} from "../config/features";

/**
 * Hook para usar feature flags em componentes React
 *
 * @returns {Object} - Objeto com helpers e informações de features
 */
export default function useFeatures() {
  const currentPhase = useMemo(() => getCurrentPhase(), []);
  const phaseInfo = useMemo(() => getPhaseInfo(currentPhase), [currentPhase]);

  /**
   * Verifica se uma feature está habilitada
   *
   * @param {string} phase - Fase da feature
   * @param {string} feature - Nome da feature
   * @returns {boolean}
   */
  const isEnabled = (phase, feature) => {
    return isFeatureEnabledWithOverride(phase, feature);
  };

  /**
   * Obtém todas as features de uma fase
   *
   * @param {string} phase - Fase
   * @returns {Object}
   */
  const getFeatures = (phase) => {
    return getPhaseFeatures(phase);
  };

  /**
   * Obtém informações de uma fase
   *
   * @param {string} phase - Fase
   * @returns {Object}
   */
  const getInfo = (phase) => {
    return getPhaseInfo(phase);
  };

  /**
   * Verifica se estamos na fase especificada ou superior
   *
   * @param {string} phase - Fase a verificar
   * @returns {boolean}
   */
  const isPhaseActive = (phase) => {
    const phaseOrder = { phase1: 1, phase2: 2, phase3: 3 };
    const current = phaseOrder[currentPhase] || 0;
    const target = phaseOrder[phase] || 0;
    return current >= target;
  };

  return {
    // Helpers principais
    isEnabled,
    getFeatures,
    getInfo,
    isPhaseActive,

    // Informações da fase atual
    currentPhase,
    phaseInfo,

    // Acesso direto aos objetos (se necessário)
    FEATURES,
    PHASE_INFO,
  };
}
