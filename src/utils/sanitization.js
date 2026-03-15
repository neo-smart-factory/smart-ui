/**
 * ╔═══════════════════════════════════════════════════════════╗
 * ║  SANITIZATION UTILS - NEØ SMART FACTORY                  ║
 * ║  Security-first input handling                            ║
 * ╚═══════════════════════════════════════════════════════════╝
 */

// XSS Protection Matrix
const XSS_ENTITIES = {
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '&': '&amp;'
};

/**
 * Core sanitization - prevents XSS attacks
 * @param {string} value - Raw input
 * @returns {string} Sanitized output
 */
export const sanitizeInput = (value) => {
  if (!value) return '';

  // Remover padrões perigosos ANTES de escapar entidades HTML
  // para evitar bypass via encoding (ex: javas&amp;cript:)
  return String(value)
    .replace(/javascript\s*:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/[<>'"&]/g, (char) => XSS_ENTITIES[char] || char)
    .slice(0, 1000); // DoS protection
};

/**
 * Sanitization for storage (with trim)
 */
export const sanitizeForStorage = (value) => {
  return sanitizeInput(value).trim();
};

/**
 * Sanitize object with multiple fields
 */
export const sanitizeObject = (obj, fields) => {
  const sanitized = {};
  
  fields.forEach(field => {
    if (obj[field]) {
      sanitized[field] = field.includes('address') 
        ? obj[field].toLowerCase() 
        : sanitizeForStorage(obj[field]);
    }
  });
  
  return sanitized;
};
