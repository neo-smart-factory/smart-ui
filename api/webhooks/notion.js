import crypto from "crypto";

/**
 * NΞØ Protocol - Notion Webhook Receiver
 * Endpoint: /api/webhooks/notion
 *
 * Recebe notificações do Notion (via Zapier, Make ou Native Webhooks)
 * para sincronização de base de dados e automação de documentos.
 */
export default async function handler(req, res) {
  if (req.method === "GET") {
    return res
      .status(200)
      .json({ status: "active", message: "NΞØ Notion Gateway is online" });
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // O NOTION_WEBHOOK_SECRET deve ser configurado no .env da aplicação
  const NOTION_WEBHOOK_SECRET =
    process.env.NOTION_WEBHOOK_SECRET || "neo_notion_vault_secret_2026";
  const signature = req.headers["x-notion-signature"];
  const payload = req.body;

  // 🔍 Step 1: Notion URL Verification Challenge
  // Quando você cadastra o webhook, o Notion envia um 'challenge' ou 'verification_token'
  // para garantir que o endpoint é seu e está ativo.
  if (payload && payload.challenge) {
    console.log(
      `🛡️ Notion URL Verification Challenge received for neoprotocol.space`
    );
    return res.status(200).send(payload.challenge);
  }

  if (payload && payload.verification_token) {
    console.log(`🛡️ Notion Verification Token received for neoprotocol.space`);
    return res.status(200).json({ challenge: payload.verification_token });
  }

  // Nota: Notion nativo ainda não envia Assinatura HMAC de forma padrão em todos os planos,
  // mas se estivermos usando via Middleman (Zapier/Make), podemos validar.

  console.log(
    `📥 Notion Update Received: ${
      payload.type || "Generic Event"
    } at neoprotocol.space`
  );

  // Processamento do payload...
  // Exemplo: payload.action, payload.data, etc.

  return res.status(200).json({
    status: "success",
    source: "Notion",
    received_at: new Date().toISOString(),
  });
}
