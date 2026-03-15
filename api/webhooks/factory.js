import crypto from 'crypto';

/**
 * NΞØ Protocol - Nexus Webhook Receiver (Dashboard UI Layer)
 * Endpoint: /api/webhooks/factory
 * 
 * Recebe e autentica ordens de mint vindas do Nexus para atualização
 * do estado da interface e monitoramento em tempo real.
 */
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const NEXUS_SECRET = process.env.NEXUS_SECRET;
    if (!NEXUS_SECRET) {
        console.error('[factory webhook] NEXUS_SECRET não configurado. Abortando.');
        return res.status(500).json({ error: 'Service misconfigured' });
    }
    const signature = req.headers['x-nexus-signature'];
    const payload = req.body;

    if (!signature) {
        return res.status(401).json({ error: 'Missing Authentication Header' });
    }

    // Validar HMAC
    const hmac = crypto.createHmac('sha256', NEXUS_SECRET);
    const expectedSignature = hmac.update(JSON.stringify(payload)).digest('hex');

    try {
        if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
            return res.status(401).json({ error: 'Unauthorized: Ghost Protocol' });
        }
    } catch {
        return res.status(401).json({ error: 'Security Handshake Failed' });
    }

    console.log(`📥 Nexus Order Received: ${payload.event} at Dashboard UI`);

    // Aqui a UI poderia emitir um evento para o frontend via Pusher ou Ably (futuro)
    return res.status(202).json({
        status: 'accepted',
        message: 'Order synchronized with NΞØ Dashboard',
        event_id: payload.id
    });
}
