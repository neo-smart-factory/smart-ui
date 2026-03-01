/**
 * NΞØ Smart Factory — Types & Interfaces para comunicação com CLI
 *
 * Este arquivo define as interfaces de comunicação entre o Smart UI e o Smart CLI.
 *
 * @see docs/adr/0001-smart-ui-backend-boundary.md para limites arquiteturais
 */

/**
 * Tipos de rede suportadas
 */
export const SUPPORTED_NETWORKS = {
  BASE: "base",
  POLYGON: "polygon",
  ETHEREUM: "ethereum",
};

/**
 * Status de uma transação
 */
export const TRANSACTION_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  FAILED: "failed",
  REJECTED: "rejected",
};

/**
 * Configuração de token para deploy
 */
export class TokenConfig {
  /**
   * @param {string} tokenName - Nome do token
   * @param {string} tokenSymbol - Símbolo do token (ex: USDT)
   * @param {string} tokenSupply - Supply inicial (string para precisão)
   * @param {string} network - Rede blockchain (base, polygon, ethereum)
   * @param {string} [description] - Descrição opcional do token
   * @param {string} [missionNarrative] - Narrativa da missão do token
   */
  constructor({
    tokenName,
    tokenSymbol,
    tokenSupply,
    network,
    description = "",
    missionNarrative = "",
  }) {
    this.tokenName = tokenName;
    this.tokenSymbol = tokenSymbol;
    this.tokenSupply = tokenSupply;
    this.network = network;
    this.description = description;
    this.missionNarrative = missionNarrative;
  }

  /**
   * Valida a configuração do token
   * @returns {string|null} Erro de validação ou null se válido
   */
  validate() {
    if (!this.tokenName || this.tokenName.length < 2) {
      return "Token name must be at least 2 characters";
    }
    if (!this.tokenSymbol || this.tokenSymbol.length < 2) {
      return "Token symbol must be at least 2 characters";
    }
    if (!this.tokenSupply || Number(this.tokenSupply) <= 0) {
      return "Token supply must be positive";
    }
    if (!Object.values(SUPPORTED_NETWORKS).includes(this.network)) {
      return "Unsupported network";
    }
    return null;
  }

  /**
   * Converte para objeto JSON para envio ao CLI
   * @returns {Object}
   */
  toJSON() {
    return {
      tokenName: this.tokenName,
      tokenSymbol: this.tokenSymbol,
      tokenSupply: this.tokenSupply,
      network: this.network,
      description: this.description,
      missionNarrative: this.missionNarrative,
    };
  }
}

/**
 * Resultado de uma transação blockchain
 */
export class TransactionResult {
  /**
   * @param {string} txHash - Hash da transação
   * @param {string} contractAddress - Endereço do contrato deployado
   * @param {string} network - Rede onde foi deployado
   * @param {string} status - Status da transação (pending, confirmed, failed)
   * @param {number} [blockNumber] - Número do bloco (quando confirmado)
   * @param {string} [error] - Mensagem de erro (se falhou)
   */
  constructor({
    txHash,
    contractAddress,
    network,
    status,
    blockNumber = null,
    error = null,
  }) {
    this.txHash = txHash;
    this.contractAddress = contractAddress;
    this.network = network;
    this.status = status;
    this.blockNumber = blockNumber;
    this.error = error;
  }

  /**
   * Verifica se a transação foi confirmada
   * @returns {boolean}
   */
  isConfirmed() {
    return this.status === TRANSACTION_STATUS.CONFIRMED;
  }

  /**
   * Verifica se a transação falhou
   * @returns {boolean}
   */
  isFailed() {
    return this.status === TRANSACTION_STATUS.FAILED;
  }
}

/**
 * Request para o CLI executar deploy
 */
export class DeployRequest {
  /**
   * @param {TokenConfig} tokenConfig - Configuração do token
   * @param {string} userAddress - Endereço da wallet do usuário
   * @param {string} [sessionId] - ID da sessão (para tracking)
   */
  constructor({ tokenConfig, userAddress, sessionId = null }) {
    this.tokenConfig = tokenConfig;
    this.userAddress = userAddress;
    this.sessionId = sessionId;
  }

  /**
   * Converte para payload JSON para envio ao CLI
   * @returns {Object}
   */
  toJSON() {
    return {
      tokenConfig: this.tokenConfig.toJSON(),
      userAddress: this.userAddress,
      sessionId: this.sessionId,
    };
  }
}

/**
 * Response do CLI após processar deploy
 */
export class DeployResponse {
  /**
   * @param {boolean} success - Se o deploy foi iniciado com sucesso
   * @param {TransactionResult} [transaction] - Resultado da transação
   * @param {string} [error] - Mensagem de erro (se falhou)
   * @param {string} [requestId] - ID da requisição (para tracking)
   */
  constructor({ success, transaction = null, error = null, requestId = null }) {
    this.success = success;
    this.transaction = transaction;
    this.error = error;
    this.requestId = requestId;
  }

  /**
   * Cria uma resposta de sucesso
   * @param {TransactionResult} transaction
   * @param {string} [requestId]
   * @returns {DeployResponse}
   */
  static success(transaction, requestId = null) {
    return new DeployResponse({
      success: true,
      transaction,
      requestId,
    });
  }

  /**
   * Cria uma resposta de erro
   * @param {string} error
   * @param {string} [requestId]
   * @returns {DeployResponse}
   */
  static error(error, requestId = null) {
    return new DeployResponse({
      success: false,
      error,
      requestId,
    });
  }
}

/**
 * Interface para comunicação com Smart CLI
 *
 * Esta interface será implementada quando o CLI estiver pronto.
 * Por enquanto, é apenas uma definição de contrato.
 */
export class CLIClient {
  /**
   * @param {string} cliEndpoint - URL base do CLI (ex: /api/cli)
   */
  constructor(cliEndpoint = "/api/cli") {
    this.endpoint = cliEndpoint;
  }

  /**
   * Executa deploy de token via CLI
   * @param {DeployRequest} request
   * @returns {Promise<DeployResponse>}
   */
  async deployToken(request) {
    // TODO: Implementar quando CLI estiver pronto
    // Por enquanto, retorna erro indicando que não está implementado
    console.log("Deploy request:", request); // Log for debugging
    return DeployResponse.error("CLI integration not yet implemented");
  }

  /**
   * Verifica status de uma transação
   * @param {string} txHash
   * @param {string} network
   * @returns {Promise<TransactionResult>}
   */
  async getTransactionStatus(txHash, network) {
    // TODO: Implementar quando CLI estiver pronto
    console.log("Transaction status check:", txHash, network); // Log for debugging
    throw new Error("CLI integration not yet implemented");
  }
}

/**
 * Export default
 */
export default {
  SUPPORTED_NETWORKS,
  TRANSACTION_STATUS,
  TokenConfig,
  TransactionResult,
  DeployRequest,
  DeployResponse,
  CLIClient,
};
