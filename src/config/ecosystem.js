/**
 * NΞØ Smart Factory — Ecosystem Configuration
 * 
 * Este utilitário fornece acesso centralizado à configuração do ecossistema,
 * permitindo resolver URLs e informações de outros projetos.
 */

import ecosystemData from '@neo-protocol/ecosystem.json';

// Mapeamento de IDs para fácil acesso
export const PROJECT_IDS = {
  SMART_FACTORY: 'smart-factory',
  SMART_CORE: 'smart-core',
  SMART_UI: 'smart-ui',
  SMART_UI_LANDING: 'smart-ui-landing',
  SMART_FACTORY_DOCS: 'smart-factory-docs',
  NEOBOT: 'neobot-architect',
  NEO_AGENT_FULL: 'neo-agent-full',
  NEO_NEXUS: 'neo-nexus',
  MIO_SYSTEM: 'mio-system',
  FLOWPAY: 'flowpay',
  FLOWOFF_AGENCY: 'neo-flowoff-landing',
  WOD_PRO_APP: 'wod-x-pro',
  FLUXX_DAO: 'fluxx-dao',
};

/**
 * Obtém a configuração completa de um projeto pelo ID
 * 
 * @param {string} projectId - ID do projeto (use PROJECT_IDS)
 * @returns {Object|null} - Objeto de configuração ou null se não encontrado
 */
export function getProject(projectId) {
  return ecosystemData.find(project => project.id === projectId) || null;
}

/**
 * Obtém a URL de produção de um projeto
 * 
 * @param {string} projectId - ID do projeto
 * @returns {string|null} - URL de produção ou null se não definida
 */
export function getProjectUrl(projectId) {
  const project = getProject(projectId);
  return project?.hosting?.productionUrl || null;
}

/**
 * Obtém o domínio customizado de um projeto
 * 
 * @param {string} projectId - ID do projeto
 * @returns {string|null} - Domínio customizado ou null se não definido
 */
export function getCustomDomain(projectId) {
  const project = getProject(projectId);
  return project?.hosting?.targetCustomDomain || null;
}

/**
 * Obtém a política de resiliência de um projeto
 * @param {string} projectId 
 * @returns {Object|null} { failurePolicy, healthCheckUrl, fallbackStrategy }
 */
export function getResilienceConfig(projectId) {
  const project = getProject(projectId);
  return project?.resilience || null;
}

/**
 * Obtém o endereço de contrato para um projeto
 * @param {string} projectId 
 * @param {string} type 'mainnet' | 'testnet'
 * @param {string} contractName 
 */
export function getContractAddress(projectId, type = 'mainnet', contractName) {
  const project = getProject(projectId);
  return project?.contracts?.[type]?.[contractName] || null;
}

/**
 * Constantes de URL Prontas para Uso
 */
export const ECOSYSTEM_URLS = {
  FACTORY: getProjectUrl(PROJECT_IDS.SMART_FACTORY),
  DOCS: getProjectUrl(PROJECT_IDS.SMART_FACTORY_DOCS),
  LANDING: getProjectUrl(PROJECT_IDS.SMART_UI_LANDING),
  FLOWPAY: getProjectUrl(PROJECT_IDS.FLOWPAY),
  FLOWOFF: getProjectUrl(PROJECT_IDS.FLOWOFF_AGENCY),
  WOD: getProjectUrl(PROJECT_IDS.WOD_PRO_APP),
  FLUXX: getProjectUrl(PROJECT_IDS.FLUXX_DAO),
};

export default {
  getProject,
  getProjectUrl,
  getCustomDomain,
  PROJECT_IDS,
  ECOSYSTEM_URLS,
};
