import sql from "../lib/db.js";
import { rateLimiter } from "../lib/rate-limiter.js";
import { csrfProtection, addSecurityHeaders } from "../lib/csrf-protection.js";

/**
 * NΞØ Marketing & Analytics Hub (Consolidated)
 * Action-based routing for tracking, leads, sessions and funnel analytics.
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

  if (!sql) {
    return res
      .status(503)
      .json({ error: "Database connection not authenticated" });
  }

  const action = req.query.action || req.body?.action;

  try {
    switch (action) {
      // --- LEADS ---
      case "lead-sync":
        return await handleLeadSync(req, res);

      // --- SESSIONS ---
      case "session-sync":
        return await handleSessionSync(req, res);

      // --- EVENTS ---
      case "event-record":
        return await handleEventRecord(req, res);

      // --- ANALYTICS ---
      case "analytics-fetch":
        return await handleAnalyticsFetch(req, res);

      default:
        // Fallback for backward compatibility if no action provided
        // Try to guess based on properties or return 400
        if (req.body?.event_type) return await handleEventRecord(req, res);
        if (req.body?.session_id && req.body?.step_reached)
          return await handleSessionSync(req, res);
        if (req.body?.session_id && req.body?.email)
          return await handleLeadSync(req, res);

        return res
          .status(400)
          .json({
            error: "Action parameter is required (e.g., ?action=lead-sync)",
          });
    }
  } catch (error) {
    // SEGURANÇA: Não expor detalhes internos em produção
    console.error(`[Marketing Hub] Error in ${action || "unknown"}:`, error);
    console.error("[Marketing Hub] Stack:", error.stack);

    const isDev = process.env.NODE_ENV === "development";
    return res.status(500).json({
      error: "Internal server error",
      message: isDev
        ? error.message
        : "An error occurred processing your request",
      ...(isDev && { stack: error.stack }),
    });
  }
}

// --- Handlers ---

async function handleLeadSync(req, res) {
  const { session_id, wallet_address, email } = req.query;

  if (req.method === "GET") {
    if (!session_id && !wallet_address && !email) {
      return res
        .status(400)
        .json({ error: "session_id, wallet_address, or email required" });
    }

    // SEGURANÇA: Validação de inputs antes de query
    if (
      session_id &&
      (typeof session_id !== "string" || session_id.length > 200)
    ) {
      return res.status(400).json({ error: "Invalid session_id format" });
    }
    if (
      wallet_address &&
      (typeof wallet_address !== "string" ||
        !/^0x[a-fA-F0-9]{40}$/.test(wallet_address))
    ) {
      return res.status(400).json({ error: "Invalid wallet_address format" });
    }
    if (
      email &&
      (typeof email !== "string" ||
        email.length > 255 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    ) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const leads = session_id
      ? await sql`SELECT * FROM leads WHERE session_id = ${session_id} ORDER BY created_at DESC LIMIT 1`
      : wallet_address
      ? await sql`SELECT * FROM leads WHERE wallet_address = ${wallet_address} ORDER BY created_at DESC LIMIT 1`
      : await sql`SELECT * FROM leads WHERE email = ${email} ORDER BY created_at DESC LIMIT 1`;

    if (leads.length > 0) return res.status(200).json(leads[0]);
    return res.status(404).json({ error: "Lead not found" });
  }

  if (req.method === "POST") {
    const {
      session_id,
      email,
      wallet_address,
      ip_address,
      user_agent,
      referrer,
      utm_source,
      utm_medium,
      utm_campaign,
      conversion_status,
      metadata,
    } = req.body;

    // SEGURANÇA: Validações rigorosas de inputs
    if (
      !session_id ||
      typeof session_id !== "string" ||
      session_id.length > 200
    ) {
      return res.status(400).json({ error: "Invalid or missing session_id" });
    }
    if (
      email &&
      (typeof email !== "string" ||
        email.length > 255 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    ) {
      return res.status(400).json({ error: "Invalid email format" });
    }
    if (wallet_address && !/^0x[a-fA-F0-9]{40}$/.test(wallet_address)) {
      return res.status(400).json({ error: "Invalid wallet_address format" });
    }
    if (user_agent && user_agent.length > 500) {
      return res.status(400).json({ error: "user_agent too long" });
    }
    if (
      conversion_status &&
      ![
        "visitor",
        "engaged",
        "wallet_connected",
        "draft_started",
        "token_created",
      ].includes(conversion_status)
    ) {
      return res.status(400).json({ error: "Invalid conversion_status" });
    }
    if (metadata && typeof metadata !== "object") {
      return res.status(400).json({ error: "metadata must be an object" });
    }

    const existing =
      await sql`SELECT id FROM leads WHERE session_id = ${session_id} LIMIT 1`;

    if (existing.length > 0) {
      const updated = await sql`
        UPDATE leads SET 
          email = COALESCE(${email}, email),
          wallet_address = COALESCE(${wallet_address}, wallet_address),
          ip_address = COALESCE(${ip_address}, ip_address),
          user_agent = COALESCE(${user_agent}, user_agent),
          referrer = COALESCE(${referrer}, referrer),
          utm_source = COALESCE(${utm_source}, utm_source),
          utm_medium = COALESCE(${utm_medium}, utm_medium),
          utm_campaign = COALESCE(${utm_campaign}, utm_campaign),
          conversion_status = COALESCE(${conversion_status}, conversion_status),
          metadata = COALESCE(${metadata}::jsonb, metadata),
          last_activity_at = NOW(), updated_at = NOW()
        WHERE session_id = ${session_id} RETURNING *
      `;
      return res.status(200).json(updated[0]);
    } else {
      const newLead = await sql`
        INSERT INTO leads (session_id, email, wallet_address, ip_address, user_agent, referrer, utm_source, utm_medium, utm_campaign, conversion_status, metadata)
        VALUES (${session_id}, ${email}, ${wallet_address}, ${ip_address}, ${user_agent}, ${referrer}, ${utm_source}, ${utm_medium}, ${utm_campaign}, ${
        conversion_status || "visitor"
      }, ${metadata ? JSON.stringify(metadata) : null}::jsonb)
        RETURNING *
      `;
      return res.status(201).json(newLead[0]);
    }
  }
}

async function handleSessionSync(req, res) {
  const { session_id } = req.query || req.body;

  if (req.method === "GET") {
    if (!session_id)
      return res.status(400).json({ error: "session_id is required" });
    const sessions =
      await sql`SELECT * FROM user_sessions WHERE session_id = ${session_id} ORDER BY created_at DESC LIMIT 1`;
    if (sessions.length > 0) return res.status(200).json(sessions[0]);
    return res.status(404).json({ error: "Session not found" });
  }

  if (req.method === "POST") {
    const {
      lead_id,
      session_id,
      step_reached,
      form_data_snapshot,
      time_on_page,
      abandoned_at,
      completed_at,
      conversion_funnel,
    } = req.body;
    if (!session_id)
      return res.status(400).json({ error: "session_id is required" });

    const existing =
      await sql`SELECT id FROM user_sessions WHERE session_id = ${session_id} LIMIT 1`;

    if (existing.length > 0) {
      const updated = await sql`
        UPDATE user_sessions SET 
          lead_id = COALESCE(${lead_id ? parseInt(lead_id) : null}, lead_id),
          step_reached = COALESCE(${
            step_reached ? parseInt(step_reached) : null
          }, step_reached),
          form_data_snapshot = COALESCE(${
            form_data_snapshot ? JSON.stringify(form_data_snapshot) : null
          }::jsonb, form_data_snapshot),
          time_on_page = COALESCE(${
            time_on_page ? parseInt(time_on_page) : null
          }, time_on_page),
          abandoned_at = COALESCE(${
            abandoned_at ? new Date(abandoned_at) : null
          }, abandoned_at),
          completed_at = COALESCE(${
            completed_at ? new Date(completed_at) : null
          }, completed_at),
          conversion_funnel = COALESCE(${
            conversion_funnel ? JSON.stringify(conversion_funnel) : null
          }::jsonb, conversion_funnel)
        WHERE session_id = ${session_id} RETURNING *
      `;
      return res.status(200).json(updated[0]);
    } else {
      const newSession = await sql`
        INSERT INTO user_sessions (lead_id, session_id, step_reached, form_data_snapshot, time_on_page, abandoned_at, completed_at, conversion_funnel)
        VALUES (${lead_id ? parseInt(lead_id) : null}, ${session_id}, ${
        step_reached ? parseInt(step_reached) : 1
      }, ${
        form_data_snapshot ? JSON.stringify(form_data_snapshot) : null
      }::jsonb, ${time_on_page ? parseInt(time_on_page) : null}, ${
        abandoned_at ? new Date(abandoned_at) : null
      }, ${completed_at ? new Date(completed_at) : null}, ${
        conversion_funnel ? JSON.stringify(conversion_funnel) : null
      }::jsonb)
        RETURNING *
      `;
      return res.status(201).json(newSession[0]);
    }
  }
}

async function handleEventRecord(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Only POST allowed for events" });
  const { lead_id, session_id, event_type, event_data } = req.body;

  if (!event_type || (!session_id && !lead_id)) {
    return res
      .status(400)
      .json({ error: "event_type and (session_id or lead_id) required" });
  }

  const newEvent = await sql`
    INSERT INTO conversion_events (lead_id, session_id, event_type, event_data)
    VALUES (${
      lead_id ? parseInt(lead_id) : null
    }, ${session_id}, ${event_type}, ${
    event_data ? JSON.stringify(event_data) : null
  }::jsonb)
    RETURNING *
  `;

  // Update lead status if applicable
  if (lead_id && event_type) {
    let newStatus = null;
    if (event_type === "wallet_connect") newStatus = "wallet_connected";
    else if (event_type === "form_start") newStatus = "engaged";
    else if (["form_step_1", "form_step_2"].includes(event_type))
      newStatus = "draft_started";
    else if (event_type === "token_created") newStatus = "token_created";

    if (newStatus) {
      await sql`UPDATE leads SET conversion_status = ${newStatus}, last_activity_at = NOW() WHERE id = ${parseInt(
        lead_id
      )}`;
    }
  }

  return res.status(201).json(newEvent[0]);
}

async function handleAnalyticsFetch(req, res) {
  const { type } = req.query;

  switch (type) {
    case "funnel": {
      const funnel = await sql`SELECT * FROM conversion_funnel`;
      return res.status(200).json(funnel[0] || {});
    }
    case "abandoned": {
      const { limit = 50, hours = 24 } = req.query;
      const abandoned =
        await sql`SELECT * FROM abandoned_leads WHERE hours_since_activity >= ${parseFloat(
          hours
        )} ORDER BY last_activity_at DESC LIMIT ${parseInt(limit)}`;
      return res.status(200).json(abandoned);
    }
    case "summary": {
      const summary = await sql`
        SELECT 
          (SELECT COUNT(*) FROM leads) as total_leads,
          (SELECT COUNT(*) FROM leads WHERE email IS NOT NULL) as leads_with_email,
          (SELECT COUNT(*) FROM leads WHERE conversion_status = 'token_created') as converted,
          (SELECT COUNT(*) FROM user_sessions WHERE abandoned_at IS NOT NULL) as abandoned_sessions,
          (SELECT COUNT(*) FROM email_subscriptions WHERE status = 'active') as active_subscriptions
      `;
      return res.status(200).json(summary[0] || {});
    }
    default:
      return res.status(200).json({ status: "Marketing Hub Online" });
  }
}
