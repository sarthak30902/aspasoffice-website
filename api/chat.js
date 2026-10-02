const ALLOWED_ORIGINS = new Set([
  "https://www.aspasoffice.com",
  "https://aspasoffice.com",
  "http://localhost:8002",
  "http://127.0.0.1:8002",
]);

const recentRequests = new Map();
const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT = 8;

function jsonError(res, status, message) {
  return res.status(status).json({ error: message });
}

function allowRequest(key) {
  const now = Date.now();
  const recent = (recentRequests.get(key) || []).filter((time) => now - time < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) {
    recentRequests.set(key, recent);
    return false;
  }
  recent.push(now);
  recentRequests.set(key, recent);
  if (recentRequests.size > 2_000) {
    for (const [ip, times] of recentRequests) {
      if (!times.length || now - times[times.length - 1] >= RATE_WINDOW_MS) recentRequests.delete(ip);
    }
  }
  return true;
}

function readOutputText(response) {
  const texts = [];
  for (const item of response.output || []) {
    if (item.type !== "message") continue;
    for (const content of item.content || []) {
      if (content.type === "output_text" && typeof content.text === "string") texts.push(content.text);
    }
  }
  return texts.join("\n").trim();
}

module.exports = async function handler(req, res) {
  const origin = req.headers.origin;
  if (!origin || !ALLOWED_ORIGINS.has(origin)) return jsonError(res, 403, "This chat is not available from this website.");

  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return jsonError(res, 405, "Use POST to send a chat message.");
  if (!process.env.OPENAI_API_KEY) return jsonError(res, 503, "The chat service is not configured yet.");

  const forwardedFor = req.headers["x-forwarded-for"];
  const ip = typeof forwardedFor === "string" ? forwardedFor.split(",")[0].trim() : "unknown";
  if (!allowRequest(ip)) return jsonError(res, 429, "Please wait a moment before sending another message.");

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { return jsonError(res, 400, "The message could not be read."); }
  }
  if (!body || typeof body !== "object") return jsonError(res, 400, "Send a chat message to continue.");

  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!message || message.length > 1_000) return jsonError(res, 400, "Please enter a message under 1,000 characters.");

  const rawHistory = Array.isArray(body.history) ? body.history.slice(-8) : [];
  const input = rawHistory
    .filter((item) => item && ["user", "assistant"].includes(item.role) && typeof item.content === "string")
    .map((item) => ({ role: item.role, content: item.content.slice(0, 1_000) }));
  const last = input[input.length - 1];
  if (!last || last.role !== "user" || last.content !== message) input.push({ role: "user", content: message });
  if (input.reduce((sum, item) => sum + item.content.length, 0) > 5_000) {
    return jsonError(res, 400, "That conversation is too long. Please start a new chat.");
  }

  try {
    const upstream = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-5.4-mini",
        instructions: "You are the ASPAS Office website assistant. Answer clearly and briefly about virtual office and business-address options. Known locations on this page are Delhi (Green Park), Gurgaon (Sector 38), and Noida. Do not invent prices, availability, document lists, legal or tax advice, or claim an address is eligible for GST or company registration. Explain that services and documents depend on the address and plan, and tell the visitor to confirm before filing. If details are not provided, say so and offer the ASPAS team: WhatsApp +91 96251 20128 or connect@aspasoffice.com.",
        input,
        max_output_tokens: 300,
      }),
    });

    if (!upstream.ok) return jsonError(res, 502, "The assistant could not reply right now. Please contact our team on WhatsApp.");
    const result = await upstream.json();
    const reply = readOutputText(result);
    if (!reply) return jsonError(res, 502, "The assistant returned an empty reply. Please contact our team on WhatsApp.");
    return res.status(200).json({ reply });
  } catch {
    return jsonError(res, 502, "The chat service is temporarily unavailable. Please contact our team on WhatsApp.");
  }
};

