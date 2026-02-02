/**
 * Rate Limiter Middleware para proteção contra abuse
 * Implementa rate limiting baseado em IP e sliding window
 */

const requestCounts = new Map();
const WINDOW_MS = 60 * 1000; // 1 minuto
const MAX_REQUESTS = 100; // 100 requests por minuto por IP

/**
 * Limpa registros antigos periodicamente
 */
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of requestCounts.entries()) {
    if (now - data.windowStart > WINDOW_MS * 2) {
      requestCounts.delete(key);
    }
  }
}, WINDOW_MS);

/**
 * Middleware de rate limiting
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 * @returns {Response|void}
 */
export function rateLimiter(req, res, next) {
  // Obter IP do cliente (considera proxies e headers comuns)
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
             req.headers['x-real-ip'] ||
             req.socket?.remoteAddress ||
             'unknown';

  const now = Date.now();
  const key = `${ip}:${req.url}`;

  if (!requestCounts.has(key)) {
    requestCounts.set(key, {
      count: 1,
      windowStart: now,
    });
    return next ? next() : true;
  }

  const data = requestCounts.get(key);
  const timePassed = now - data.windowStart;

  if (timePassed > WINDOW_MS) {
    // Nova janela
    data.count = 1;
    data.windowStart = now;
    return next ? next() : true;
  }

  if (data.count >= MAX_REQUESTS) {
    // Rate limit excedido
    const retryAfter = Math.ceil((WINDOW_MS - timePassed) / 1000);
    console.warn(`[RATE_LIMIT] IP ${ip} excedeu limite na rota ${req.url}`);
    
    return res.status(429).json({
      error: 'Too many requests',
      retryAfter,
      message: `Rate limit exceeded. Try again in ${retryAfter} seconds.`
    });
  }

  data.count++;
  return next ? next() : true;
}

/**
 * Rate limiter específico para APIs sensíveis (mais restritivo)
 */
export function strictRateLimiter(req, res, next) {
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
             req.headers['x-real-ip'] ||
             req.socket?.remoteAddress ||
             'unknown';

  const now = Date.now();
  const key = `strict:${ip}:${req.url}`;
  const STRICT_WINDOW_MS = 60 * 1000; // 1 minuto
  const STRICT_MAX_REQUESTS = 20; // Apenas 20 requests/minuto

  if (!requestCounts.has(key)) {
    requestCounts.set(key, {
      count: 1,
      windowStart: now,
    });
    return next ? next() : true;
  }

  const data = requestCounts.get(key);
  const timePassed = now - data.windowStart;

  if (timePassed > STRICT_WINDOW_MS) {
    data.count = 1;
    data.windowStart = now;
    return next ? next() : true;
  }

  if (data.count >= STRICT_MAX_REQUESTS) {
    const retryAfter = Math.ceil((STRICT_WINDOW_MS - timePassed) / 1000);
    console.warn(`[RATE_LIMIT] IP ${ip} excedeu limite STRICT na rota ${req.url}`);
    
    return res.status(429).json({
      error: 'Too many requests',
      retryAfter,
      message: `Rate limit exceeded. Try again in ${retryAfter} seconds.`
    });
  }

  data.count++;
  return next ? next() : true;
}

export default rateLimiter;
