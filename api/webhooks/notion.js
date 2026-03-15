import crypto from 'crypto';

/**
 * NΞØ Protocol - Notion Webhook Receiver
 * Endpoint: /api/webhooks/notion
 * 
 * Recebe notificações do Notion (via Zapier, Make ou Native Webhooks)
 * para sincronização de base de dados e automação de documentos.
 */
export default async function handler(req, res) {
    // HEAD: health check usado por alguns clientes antes de POST
    if (req.method === 'HEAD') {
        return res.status(200).end();
    }

    // GET: status do endpoint
    if (req.method === 'GET') {
        return res.status(200).json({ status: 'active', message: 'NΞØ Notion Gateway is online' });
    }

    if (req.method !== 'POST') {
        res.setHeader('Allow', 'GET, HEAD, POST');
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const payload = req.body;

    // ─────────────────────────────────────────────────────────────
    // VERIFICAÇÃO INICIAL — deve acontecer ANTES de qualquer guard
    // de secret, pois o secret ainda não existe neste momento.
    //
    // Notion API 2026: envia POST com { verification_token: "secret_..." }
    // e espera a string pura de volta (não JSON).
    // ─────────────────────────────────────────────────────────────
    if (payload?.verification_token) {
        console.log('[notion webhook] Verification token recebido — respondendo ao Notion');
        return res.status(200).send(payload.verification_token);
    }

    // challenge (formato legado / Zapier / Make)
    if (payload?.challenge) {
        console.log('[notion webhook] Challenge recebido — respondendo ao Notion');
        return res.status(200).send(payload.challenge);
    }

    // ─────────────────────────────────────────────────────────────
    // Eventos reais — agora sim validamos o secret
    // ─────────────────────────────────────────────────────────────
    const NOTION_WEBHOOK_SECRET = process.env.NOTION_WEBHOOK_SECRET;
    if (!NOTION_WEBHOOK_SECRET) {
        console.error('[notion webhook] NOTION_WEBHOOK_SECRET não configurado. Abortando.');
        return res.status(500).json({ error: 'Service misconfigured' });
    }

    // Validar assinatura HMAC se o Notion a enviar
    const signature = req.headers['x-notion-signature'];
    if (signature) {
        const hmac = crypto.createHmac('sha256', NOTION_WEBHOOK_SECRET);
        const expected = hmac.update(JSON.stringify(payload)).digest('hex');
        try {
            if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
                return res.status(401).json({ error: 'Invalid signature' });
            }
        } catch {
            return res.status(401).json({ error: 'Signature validation failed' });
        }
    }

    console.log(`[notion webhook] Evento recebido: ${payload?.type || 'generic'}`);

    return res.status(200).json({
        status: 'success',
        source: 'Notion',
        received_at: new Date().toISOString()
    });
}
