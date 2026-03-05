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

    const NEXUS_SECRETS = [
        process.env.NEXUS_SECRET_NEW,
        process.env.NEXUS_SECRET_OLD,
        process.env.NEXUS_SECRET,
    ]
        .map((value) => (value || "").trim())
        .filter(Boolean);
    const signature = req.headers['x-nexus-signature'];
    const payload = req.body;

    if (!signature) {
        return res.status(401).json({ error: 'Missing Authentication Header' });
    }

    if (NEXUS_SECRETS.length === 0) {
        return res.status(503).json({ error: 'Nexus secret not configured' });
    }

    // Validar HMAC com rotação (NEW/OLD/legacy)
    const provided = Buffer.from(signature);
    let isValid = false;

    for (const secret of NEXUS_SECRETS) {
        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(JSON.stringify(payload))
            .digest('hex');
        const expected = Buffer.from(expectedSignature);
        if (provided.length !== expected.length) {
            continue;
        }
        try {
            if (crypto.timingSafeEqual(provided, expected)) {
                isValid = true;
                break;
            }
        } catch {
            return res.status(401).json({ error: 'Security Handshake Failed' });
        }
    }

    if (!isValid) {
        return res.status(401).json({ error: 'Unauthorized: Ghost Protocol' });
    }

    console.log(`📥 Nexus Order Received: ${payload.event} at Dashboard UI`);

    // Aqui a UI poderia emitir um evento para o frontend via Pusher ou Ably (futuro)
    return res.status(202).json({
        status: 'accepted',
        message: 'Order synchronized with NΞØ Dashboard',
        event_id: payload.id
    });
}
