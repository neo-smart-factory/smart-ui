import sql from "../lib/db.js";
import {
  searchTavily,
  extractTrends,
  identifyMarketGaps,
  generateSuggestions,
  validateTokenNameInput,
  extractTokenomics,
} from "../lib/tavily.js";
import crypto from "crypto";
import { strictRateLimiter } from "../lib/rate-limiter.js";
import { csrfProtection, addSecurityHeaders } from "../lib/csrf-protection.js";

/**
 * NΞØ Intelligence API (Consolidated with DB Cache)
 * Action-based routing to stay within Vercel limits.
 */
export default async function handler(req, res) {
  // SEGURANÇA: Headers de segurança
  addSecurityHeaders(res);

  // SEGURANÇA: CSRF protection
  const csrfResult = csrfProtection(req, res);
  if (csrfResult !== true) return;

  // SEGURANÇA: Rate limiting estrito para API de IA (mais caro)
  const rateLimitResult = strictRateLimiter(req, res);
  if (rateLimitResult !== true) return;

  const { action, lead_id, session_id } = req.query || req.body;

  // Se for GET para alchemy-pulse
  if (req.method === "GET" && (!action || action === "alchemy-pulse")) {
    return await handleAlchemyPulse(req, res);
  }

  // Apenas POST permitido para as demais ações de inteligência
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = req.body || {};
    const actionType = action || body.action;

    // Tentar resolver via Cache primeiro (se DB disponível)
    if (sql && actionType !== "alchemy-pulse") {
      const cacheResult = await getCache(actionType, body);
      if (cacheResult) {
        // Log do Cache Hit
        await logIntelligence(
          lead_id || body.lead_id,
          session_id || body.session_id,
          actionType,
          body,
          true
        );
        return res.status(200).json(cacheResult);
      }
    }

    // PERFORMANCE: Criar promise para tracking de requests em andamento
    const hash = generateHash(actionType, body);
    let requestPromise;

    if (inFlightRequests.has(hash)) {
      // Request já em andamento, aguardar resultado
      console.log("[Intelligence] Request duplicado detectado, aguardando...");
      requestPromise = inFlightRequests.get(hash);
    } else {
      // Novo request, criar promise
      requestPromise = (async () => {
        try {
          let result;
          switch (actionType) {
            case "market-research":
              result = await handleMarketResearch(req, res, true);
              break;
            case "marketing-suggestions":
              result = await handleMarketingSuggestions(req, res, true);
              break;
            case "validate-token-name":
              result = await handleValidateTokenName(req, res, true);
              break;
            case "generate-whitepaper-base":
              result = await handleGenerateWhitepaper(req, res, true);
              break;
            default:
              throw new Error("Invalid or missing action");
          }

          // Salvar no Cache e Logar (se DB disponível)
          if (sql && result && !result.fallback && !result.error) {
            await setCache(actionType, body, result);
            await logIntelligence(
              lead_id || body.lead_id,
              session_id || body.session_id,
              actionType,
              body,
              false
            );
          }

          return result;
        } finally {
          // Limpar do tracking
          inFlightRequests.delete(hash);
        }
      })();

      inFlightRequests.set(hash, requestPromise);
    }

    const result = await requestPromise;

    if (result.error) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (err) {
    // SEGURANÇA: Não expor detalhes internos em produção
    console.error("[Intelligence API] Error:", err);

    // Logging estruturado para debugging
    console.error("[Intelligence API] Stack:", err.stack);
    console.error("[Intelligence API] Action:", action);

    // Resposta genérica para o cliente
    const isDev = process.env.NODE_ENV === "development";
    return res.status(500).json({
      error: "Internal server error",
      message: isDev
        ? err.message
        : "An error occurred processing your request",
      ...(isDev && { stack: err.stack }),
    });
  }
}

// --- Handlers ---

async function handleAlchemyPulse(req, res) {
  try {
    const ALCHEMY_ID = process.env.VITE_ALCHEMY_ID;
    if (!ALCHEMY_ID) {
      return res
        .status(200)
        .json({
          gasPriceGwei: "0.01",
          blockNumber: "41343573",
          status: "simulated",
        });
    }

    const response = await fetch(
      `https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_ID}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "eth_gasPrice",
          params: [],
        }),
      }
    );

    const data = await response.json();
    const gasPriceGwei = (parseInt(data.result, 16) / 1e9).toFixed(4);

    const blockResponse = await fetch(
      `https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_ID}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 2,
          method: "eth_blockNumber",
          params: [],
        }),
      }
    );

    const blockData = await blockResponse.json();
    const blockNumber = parseInt(blockData.result, 16);

    return res.status(200).json({ gasPriceGwei, blockNumber, status: "live" });
  } catch {
    return res
      .status(200)
      .json({
        gasPriceGwei: "0.01",
        blockNumber: "41343573",
        status: "fallback",
      });
  }
}

async function handleMarketResearch(req, res, returnRaw = false) {
  const { category, keywords } = req.body;

  // SEGURANÇA: Validação de inputs
  if (category && (typeof category !== "string" || category.length > 100)) {
    return returnRaw
      ? { error: "Invalid category" }
      : res.status(400).json({ error: "Invalid category" });
  }
  if (keywords && (typeof keywords !== "string" || keywords.length > 200)) {
    return returnRaw
      ? { error: "Invalid keywords" }
      : res.status(400).json({ error: "Invalid keywords" });
  }

  const query = `${category || ""} ${
    keywords || ""
  } token launch trends 2026 cryptocurrency`.trim();

  if (query.length < 5) {
    return returnRaw
      ? { error: "Query too short" }
      : res.status(400).json({ error: "Query too short" });
  }

  const data = await searchTavily(query, {
    search_depth: "advanced",
    include_answer: true,
    max_results: 15,
  });

  const result = {
    trends: extractTrends(data.answer || ""),
    competitors: (data.results || []).slice(0, 5).map((result) => ({
      name: result.title,
      url: result.url,
      relevance: result.score || 0,
      snippet: result.content?.substring(0, 150) || "",
    })),
    marketGaps: identifyMarketGaps(data.answer || ""),
    summary: data.answer || "",
    totalResults: data.results?.length || 0,
  };
  return returnRaw ? result : res.status(200).json(result);
}

async function handleMarketingSuggestions(req, res, returnRaw = false) {
  const { tokenName, category } = req.body;

  // SEGURANÇA: Validação de inputs
  if (
    !tokenName ||
    typeof tokenName !== "string" ||
    tokenName.length < 2 ||
    tokenName.length > 100
  ) {
    return returnRaw
      ? { error: "Invalid tokenName" }
      : res.status(400).json({ error: "Invalid tokenName" });
  }
  if (category && (typeof category !== "string" || category.length > 100)) {
    return returnRaw
      ? { error: "Invalid category" }
      : res.status(400).json({ error: "Invalid category" });
  }

  const query = `${
    category || ""
  } token launch marketing strategy social media campaigns 2026 ${tokenName}`.trim();
  const data = await searchTavily(query, {
    search_depth: "advanced",
    include_answer: true,
    max_results: 20,
    include_domains: [
      "twitter.com",
      "reddit.com",
      "medium.com",
      "coindesk.com",
      "cointelegraph.com",
    ],
  });

  const result = {
    summary: data.answer?.substring(0, 500) || "",
    totalResults: data.results?.length || 0,
    message: "Data processed from Tavily",
    rawAnswer: data.answer,
  };
  return returnRaw ? result : res.status(200).json(result);
}

async function handleValidateTokenName(req, res, returnRaw = false) {
  const { tokenName, symbol } = req.body;
  validateTokenNameInput(tokenName, symbol);
  const query = `token ${tokenName} ${symbol} cryptocurrency blockchain coin`;
  const data = await searchTavily(query, {
    search_depth: "basic",
    include_answer: true,
    max_results: 10,
  });

  const conflicts = (data.results || [])
    .filter((result) => {
      const titleLower = (result.title || "").toLowerCase();
      return (
        titleLower.includes(tokenName.toLowerCase()) ||
        titleLower.includes(symbol.toLowerCase())
      );
    })
    .map((c) => ({ title: c.title, url: c.url, score: c.score }));

  const result = {
    valid: conflicts.length === 0,
    conflicts,
    suggestions:
      conflicts.length > 0 ? generateSuggestions(tokenName, symbol) : [],
    totalResults: data.results?.length || 0,
  };
  return returnRaw ? result : res.status(200).json(result);
}

async function handleGenerateWhitepaper(req, res, returnRaw = false) {
  const { tokenName, category } = req.body;

  // SEGURANÇA: Validação de inputs
  if (
    !tokenName ||
    typeof tokenName !== "string" ||
    tokenName.length < 2 ||
    tokenName.length > 100
  ) {
    return returnRaw
      ? { error: "Invalid tokenName" }
      : res.status(400).json({ error: "Invalid tokenName" });
  }
  if (category && (typeof category !== "string" || category.length > 100)) {
    return returnRaw
      ? { error: "Invalid category" }
      : res.status(400).json({ error: "Invalid category" });
  }

  const query = `${tokenName} ${
    category || ""
  } tokenomics useCase targetAudience`.trim();
  const data = await searchTavily(query, {
    search_depth: "advanced",
    include_answer: true,
    max_results: 10,
  });

  const result = {
    introduction: data.answer || "",
    tokenomics: extractTokenomics(data.answer || ""),
    generatedAt: new Date().toISOString(),
  };
  return returnRaw ? result : res.status(200).json(result);
}

// --- Cache & Log Helpers ---

// PERFORMANCE: Cache em memória para prevenir race conditions
const inFlightRequests = new Map();

async function getCache(action, params) {
  try {
    const hash = generateHash(action, params);

    // SEGURANÇA: Verificar se já existe request em andamento (prevenir race condition)
    if (inFlightRequests.has(hash)) {
      console.log("[Cache] Request já em andamento, aguardando...");
      return await inFlightRequests.get(hash);
    }

    const cached = await sql`
            SELECT response_data FROM intelligence_cache 
            WHERE query_hash = ${hash} 
            AND (expires_at IS NULL OR expires_at > NOW())
            LIMIT 1
        `;
    return cached.length > 0 ? cached[0].response_data : null;
  } catch (err) {
    console.error("Cache Read Error:", err);
    return null;
  }
}

async function setCache(action, params, data) {
  try {
    const hash = generateHash(action, params);
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24h cache

    await sql`
            INSERT INTO intelligence_cache (query_hash, action_type, raw_query, response_data, expires_at)
            VALUES (${hash}, ${action}, ${JSON.stringify(
      params
    )}, ${JSON.stringify(data)}, ${expiresAt})
            ON CONFLICT (query_hash) DO UPDATE 
            SET response_data = EXCLUDED.response_data, expires_at = EXCLUDED.expires_at
        `;
  } catch (err) {
    console.error("Cache Write Error:", err);
  }
}

async function logIntelligence(leadId, sessionId, action, params, cacheHit) {
  try {
    await sql`
            INSERT INTO intelligence_logs (lead_id, session_id, action_type, query_params, cache_hit)
            VALUES (${leadId ? parseInt(leadId) : null}, ${
      sessionId || null
    }, ${action}, ${JSON.stringify(params)}, ${cacheHit})
        `;
  } catch (err) {
    console.error("Log Write Error:", err);
  }
}

function generateHash(action, params) {
  const str = `${action}:${JSON.stringify(params)}`;
  return crypto.createHash("sha256").update(str).digest("hex");
}
