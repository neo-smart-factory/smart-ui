import sql from '../lib/db.js';
import { rateLimiter } from '../lib/rate-limiter.js';
import { csrfProtection, addSecurityHeaders } from '../lib/csrf-protection.js';

/**
 * NΞØ Protocol Ops Hub (Consolidated)
 * Action-based routing for deploys, drafts, and system status.
 */
export default async function handler(req, res) {
    // SEGURANÇA: Headers de segurança
    addSecurityHeaders(res);

    // SEGURANÇA: CSRF protection
    const csrfResult = csrfProtection(req, res);
    if (csrfResult !== true) return;

    // SEGURANÇA: Rate limiting para prevenir abuse
    const rateLimitResult = rateLimiter(req, res);
    if (rateLimitResult !== true) return;

    const action = req.query.action || req.body?.action;

    try {
        switch (action) {
            // --- SYSTEM STATUS ---
            case 'status':
                return await handleStatus(req, res);

            // --- DEPLOYS ---
            case 'deploys':
                return await handleDeploys(req, res);

            // --- DRAFTS ---
            case 'drafts':
                return await handleDrafts(req, res);

            default:
                // Backward compatibility fallback
                if (req.method === 'GET' && req.url.includes('ops-status')) return await handleStatus(req, res);

                return res.status(400).json({ error: "Action parameter is required (e.g., ?action=status)" });
        }
    } catch (error) {
        // SEGURANÇA: Não expor detalhes internos em produção
        console.error(`[Ops Hub] Error in ${action || 'unknown'}:`, error);
        console.error('[Ops Hub] Stack:', error.stack);
        
        const isDev = process.env.NODE_ENV === 'development';
        return res.status(500).json({ 
            error: "Internal server error",
            message: isDev ? error.message : 'An error occurred processing your request',
            ...(isDev && { stack: error.stack })
        });
    }
}

// --- Handlers ---

async function handleStatus(req, res) {
    const opsState = {
        version: process.env.VITE_APP_VERSION || "0.5.5",
        codename: process.env.VITE_APP_CODENAME || "MULTICHAIN FOUNDATION",
        status: "operational",
        components: {
            "Core Engine": { status: "completed", notes: "Core deployed and verified." },
            "Web3 Integration": { status: "completed", notes: "Dynamic v4 modular SDK live." },
            "AI Intelligence": { status: "completed", notes: "Tavily & Modal.com active." },
            "Database Sync": { status: "completed", notes: "Neon Postgres operational." }
        }
    };
    return res.status(200).json(opsState);
}

async function handleDeploys(req, res) {
    if (!sql) return res.status(503).json({ error: "DB not available" });

    if (req.method === 'GET') {
        const deploys = await sql`SELECT * FROM deploys ORDER BY created_at DESC LIMIT 50`;
        return res.status(200).json(deploys);
    }

    if (req.method === 'POST') {
        const { contract_address, owner_address, network, tx_hash, token_name, token_symbol, lead_id, session_id } = req.body;
        
        // SEGURANÇA: Validações rigorosas
        if (!contract_address || !/^0x[a-fA-F0-9]{40}$/.test(contract_address)) {
            return res.status(400).json({ error: "Invalid contract_address" });
        }
        if (!owner_address || !/^0x[a-fA-F0-9]{40}$/.test(owner_address)) {
            return res.status(400).json({ error: "Invalid owner_address" });
        }
        if (network && !['base', 'polygon', 'ethereum', 'arbitrum', 'optimism'].includes(network)) {
            return res.status(400).json({ error: "Invalid network" });
        }
        if (tx_hash && !/^0x[a-fA-F0-9]{64}$/.test(tx_hash)) {
            return res.status(400).json({ error: "Invalid tx_hash" });
        }
        if (token_name && (typeof token_name !== 'string' || token_name.length > 100)) {
            return res.status(400).json({ error: "Invalid token_name" });
        }
        if (token_symbol && (typeof token_symbol !== 'string' || token_symbol.length > 10)) {
            return res.status(400).json({ error: "Invalid token_symbol" });
        }
        if (lead_id && (isNaN(parseInt(lead_id)) || parseInt(lead_id) < 0)) {
            return res.status(400).json({ error: "Invalid lead_id" });
        }

        await sql`
      INSERT INTO deploys (contract_address, owner_address, network, tx_hash, token_name, token_symbol, lead_id, session_id)
      VALUES (${contract_address}, ${owner_address}, ${network}, ${tx_hash}, ${token_name}, ${token_symbol}, ${lead_id ? parseInt(lead_id) : null}, ${session_id || null})
    `;
        return res.status(201).json({ success: true });
    }
}

async function handleDrafts(req, res) {
    if (!sql) return res.status(503).json({ error: "DB not available" });

    if (req.method === 'GET') {
        const { address } = req.query;
        // SEGURANÇA: Validar formato de endereço
        if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
            return res.status(400).json({ error: "Invalid address format" });
        }
        const drafts = await sql`SELECT token_config FROM drafts WHERE user_address = ${address} LIMIT 1`;
        return drafts.length > 0 ? res.status(200).json(drafts[0].token_config) : res.status(404).json({ error: "No draft" });
    }

    if (req.method === 'POST') {
        const { user_address, token_config, lead_id, session_id } = req.body;
        
        // SEGURANÇA: Validações rigorosas
        if (!user_address || !/^0x[a-fA-F0-9]{40}$/.test(user_address)) {
            return res.status(400).json({ error: "Invalid user_address" });
        }
        if (token_config && typeof token_config !== 'object') {
            return res.status(400).json({ error: "token_config must be an object" });
        }
        if (lead_id && (isNaN(parseInt(lead_id)) || parseInt(lead_id) < 0)) {
            return res.status(400).json({ error: "Invalid lead_id" });
        }
        if (session_id && (typeof session_id !== 'string' || session_id.length > 200)) {
            return res.status(400).json({ error: "Invalid session_id" });
        }

        await sql`
      INSERT INTO drafts (user_address, token_config, lead_id, session_id, updated_at)
      VALUES (${user_address}, ${token_config ? JSON.stringify(token_config) : null}::jsonb, ${lead_id ? parseInt(lead_id) : null}, ${session_id || null}, NOW())
      ON CONFLICT (user_address) DO UPDATE SET 
        token_config = EXCLUDED.token_config, 
        lead_id = COALESCE(EXCLUDED.lead_id, drafts.lead_id),
        session_id = COALESCE(EXCLUDED.session_id, drafts.session_id),
        updated_at = NOW()
    `;
        return res.status(200).json({ success: true });
    }
}
