/**
 * CSRF Protection Middleware
 * Protege contra Cross-Site Request Forgery usando SameSite cookies e origin validation
 */

/**
 * Valida a origem do request para prevenir CSRF
 * @param {Request} req
 * @returns {boolean}
 */
export function validateOrigin(req) {
  // Em desenvolvimento, permitir todos
  if (process.env.NODE_ENV === "development") {
    return true;
  }

  const origin = req.headers["origin"] || req.headers["referer"];

  if (!origin) {
    // Se não há origin/referer, é suspeito
    console.warn("[CSRF] Request sem origin/referer");
    return false;
  }

  // Lista de origens permitidas
  const allowedOrigins = [
    "https://smart-ui-delta.vercel.app",
    "https://smart-ui-dashboard.vercel.app",
    "https://nsfactory.xyz",
    "https://www.nsfactory.xyz/",
    "https://smart-ui.vercel.app",
    "https://neosmart.factory",
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
  ].filter(Boolean);

  const requestOrigin = new URL(origin).origin;

  if (!allowedOrigins.some((allowed) => requestOrigin === allowed)) {
    console.warn(`[CSRF] Origin não permitida: ${requestOrigin}`);
    return false;
  }

  return true;
}

/**
 * Middleware CSRF para rotas POST/PUT/DELETE
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
export function csrfProtection(req, res, next) {
  // Aplicar apenas para métodos que modificam dados
  if (["POST", "PUT", "DELETE", "PATCH"].includes(req.method)) {
    if (!validateOrigin(req)) {
      return res.status(403).json({
        error: "Forbidden",
        message: "CSRF validation failed",
      });
    }
  }

  return next ? next() : true;
}

/**
 * Adiciona headers de segurança
 * @param {Response} res
 */
export function addSecurityHeaders(res) {
  // Prevenir clickjacking
  res.setHeader("X-Frame-Options", "DENY");

  // Prevenir MIME type sniffing
  res.setHeader("X-Content-Type-Options", "nosniff");

  // XSS Protection (ainda útil em browsers antigos)
  res.setHeader("X-XSS-Protection", "1; mode=block");

  // Referrer Policy
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

  // Content Security Policy (básico)
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://*.alchemy.com https://*.tavily.com https://*.neon.tech;"
  );

  // Permissions Policy
  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  return res;
}

export default csrfProtection;
