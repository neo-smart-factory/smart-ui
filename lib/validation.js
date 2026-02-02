/**
 * Validações robustas para prevenir ataques e garantir integridade de dados
 */

/**
 * Valida número inteiro com limites seguros
 * @param {any} value 
 * @param {Object} options 
 * @returns {Object} { valid: boolean, error: string|null, value: number|null }
 */
export function validateInteger(value, options = {}) {
  const { min = 0, max = Number.MAX_SAFE_INTEGER, allowNull = false } = options;

  if (value === null || value === undefined) {
    return allowNull 
      ? { valid: true, error: null, value: null }
      : { valid: false, error: 'Value is required', value: null };
  }

  const num = Number(value);

  if (isNaN(num)) {
    return { valid: false, error: 'Value must be a valid number', value: null };
  }

  if (!Number.isInteger(num)) {
    return { valid: false, error: 'Value must be an integer', value: null };
  }

  // SEGURANÇA: Prevenir integer overflow
  if (num < Number.MIN_SAFE_INTEGER || num > Number.MAX_SAFE_INTEGER) {
    return { valid: false, error: 'Value exceeds safe integer range', value: null };
  }

  if (num < min || num > max) {
    return { valid: false, error: `Value must be between ${min} and ${max}`, value: null };
  }

  return { valid: true, error: null, value: num };
}

/**
 * Valida string com limites e sanitização
 * @param {any} value 
 * @param {Object} options 
 * @returns {Object}
 */
export function validateString(value, options = {}) {
  const { 
    minLength = 0, 
    maxLength = 1000, 
    allowEmpty = false,
    pattern = null,
    trim = true
  } = options;

  if (value === null || value === undefined) {
    return allowEmpty 
      ? { valid: true, error: null, value: '' }
      : { valid: false, error: 'Value is required', value: null };
  }

  if (typeof value !== 'string') {
    return { valid: false, error: 'Value must be a string', value: null };
  }

  let processedValue = trim ? value.trim() : value;

  if (!allowEmpty && processedValue.length === 0) {
    return { valid: false, error: 'Value cannot be empty', value: null };
  }

  if (processedValue.length < minLength) {
    return { valid: false, error: `Value must be at least ${minLength} characters`, value: null };
  }

  if (processedValue.length > maxLength) {
    return { valid: false, error: `Value must not exceed ${maxLength} characters`, value: null };
  }

  if (pattern && !pattern.test(processedValue)) {
    return { valid: false, error: 'Value does not match required pattern', value: null };
  }

  return { valid: true, error: null, value: processedValue };
}

/**
 * Valida email
 * @param {string} email 
 * @returns {Object}
 */
export function validateEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  const stringValidation = validateString(email, {
    minLength: 5,
    maxLength: 255,
    pattern: emailPattern
  });

  if (!stringValidation.valid) {
    return { ...stringValidation, error: 'Invalid email format' };
  }

  return stringValidation;
}

/**
 * Valida Ethereum address
 * @param {string} address 
 * @returns {Object}
 */
export function validateEthereumAddress(address) {
  const addressPattern = /^0x[a-fA-F0-9]{40}$/;
  
  const stringValidation = validateString(address, {
    minLength: 42,
    maxLength: 42,
    pattern: addressPattern,
    trim: true
  });

  if (!stringValidation.valid) {
    return { ...stringValidation, error: 'Invalid Ethereum address format' };
  }

  return stringValidation;
}

/**
 * Valida transaction hash
 * @param {string} txHash 
 * @returns {Object}
 */
export function validateTxHash(txHash) {
  const txHashPattern = /^0x[a-fA-F0-9]{64}$/;
  
  const stringValidation = validateString(txHash, {
    minLength: 66,
    maxLength: 66,
    pattern: txHashPattern,
    trim: true
  });

  if (!stringValidation.valid) {
    return { ...stringValidation, error: 'Invalid transaction hash format' };
  }

  return stringValidation;
}

/**
 * Valida objeto JSON
 * @param {any} value 
 * @param {Object} options 
 * @returns {Object}
 */
export function validateJSON(value, options = {}) {
  const { maxSize = 10000, allowNull = false } = options;

  if (value === null || value === undefined) {
    return allowNull
      ? { valid: true, error: null, value: null }
      : { valid: false, error: 'Value is required', value: null };
  }

  if (typeof value !== 'object') {
    return { valid: false, error: 'Value must be an object', value: null };
  }

  try {
    const jsonString = JSON.stringify(value);
    
    // SEGURANÇA: Prevenir payloads gigantes
    if (jsonString.length > maxSize) {
      return { valid: false, error: `JSON payload exceeds maximum size of ${maxSize} bytes`, value: null };
    }

    return { valid: true, error: null, value };
  } catch {
    return { valid: false, error: 'Invalid JSON object', value: null };
  }
}

/**
 * Valida enum (conjunto de valores permitidos)
 * @param {any} value 
 * @param {Array} allowedValues 
 * @returns {Object}
 */
export function validateEnum(value, allowedValues) {
  if (value === null || value === undefined) {
    return { valid: false, error: 'Value is required', value: null };
  }

  if (!allowedValues.includes(value)) {
    return { 
      valid: false, 
      error: `Value must be one of: ${allowedValues.join(', ')}`, 
      value: null 
    };
  }

  return { valid: true, error: null, value };
}

export default {
  validateInteger,
  validateString,
  validateEmail,
  validateEthereumAddress,
  validateTxHash,
  validateJSON,
  validateEnum
};
