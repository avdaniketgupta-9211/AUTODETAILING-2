import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { and, count, eq, gt } from "drizzle-orm";
import { business } from "@/data/business";
import { isLikelySpamLead, normalizeLead, validateLead } from "@/lib/validation";
import {
  clientIpHash,
  hashValue,
  isCrossOrigin,
  isDuplicatePayload,
  withinRateLimit,
} from "@/lib/request-guard";

export const dynamic = "force-dynamic";

const LEAD_WINDOW_MS = 10 * 60 * 1000;
const LEAD_LIMIT = 3;

type StoredLead = {
  name: string;
  phone: string;
  email: string;
  message: string;
  ipHash: string;
  source: "chat-estimate-request";
  receivedAt: string;
};

/** Optional GoHighLevel / CRM webhook. Failures are treated as a failed submission. */
async function sendToWebhook(lead: StoredLead) {
  const url = process.env.LEAD_WEBHOOK_URL;
  if (!url) return false;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (process.env.LEAD_WEBHOOK_TOKEN) headers.Authorization = `Bearer ${process.env.LEAD_WEBHOOK_TOKEN}`;
  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      message: lead.message,
      source: lead.source,
      submittedAt: lead.receivedAt,
    }),
    signal: AbortSignal.timeout(7000),
  });
  return response.ok;
}

/** Optional email notification via Resend — never blocks a stored lead. */
async function notify(lead: StoredLead) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!key || !to || !from) return;
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to,
        reply_to: lead.email || undefined,
        subject: "Website chat — estimate request",
        text: `Name: ${lead.name}\nPhone: ${lead.phone}\nEmail: ${lead.email || "-"}\n\n${lead.message}`,
      }),
      signal: AbortSignal.timeout(5000),
    });
  } catch {
    // lead is already stored — notification is best-effort
  }
}

async function store(lead: StoredLead) {
  // 1. Configured CRM / GoHighLevel webhook takes priority.
  if (process.env.LEAD_WEBHOOK_URL) {
    if (await sendToWebhook(lead)) return "webhook" as const;
    throw new Error("CRM webhook rejected the lead");
  }

  // 2. Production destination: the existing inquiries table.
  if (process.env.DATABASE_URL) {
    const [{ db }, { inquiries }] = await Promise.all([import("@/db"), import("@/db/schema")]);
    const since = new Date(Date.now() - LEAD_WINDOW_MS);
    const [{ value: recent }] = await db
      .select({ value: count() })
      .from(inquiries)
      .where(and(eq(inquiries.ipHash, lead.ipHash), gt(inquiries.createdAt, since)));
    if (recent >= LEAD_LIMIT) {
      return "rate-limited" as const;
    }
    await db.insert(inquiries).values({
      name: lead.name,
      email: lead.email || "",
      phone: lead.phone,
      vehicle: null,
      service: "Chat estimate request",
      message: lead.message,
      ipHash: lead.ipHash,
    });
    return "database" as const;
  }

  // 3. Local development only: durable file store so submissions can be QA'd
  //    without a database. Never used on Vercel (NODE_ENV === production).
  if (process.env.NODE_ENV !== "production") {
    const dir = path.join(process.cwd(), ".data");
    await mkdir(dir, { recursive: true });
    await appendFile(path.join(dir, "chat-leads.jsonl"), `${JSON.stringify(lead)}\n`, "utf8");
    return "local-dev" as const;
  }

  throw new Error("No lead destination configured");
}

export async function POST(req: Request) {
  const type = req.headers.get("content-type") ?? "";
  if (!type.includes("application/json")) {
    return Response.json({ ok: false, error: "Unsupported content type." }, { status: 415 });
  }
  if (isCrossOrigin(req)) {
    return Response.json({ ok: false, error: "Invalid origin." }, { status: 403 });
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }
  if (!raw || typeof raw !== "object") {
    return Response.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const data = normalizeLead(raw as Record<string, unknown>);
  const errors = validateLead(data);
  if (Object.keys(errors).length) {
    return Response.json({ ok: false, errors }, { status: 422 });
  }

  // Spam is dropped silently, but must never be reported as a successful lead.
  if (isLikelySpamLead(data)) {
    return Response.json({ ok: false, filtered: true });
  }

  const ipHash = clientIpHash(req);
  if (!withinRateLimit(`lead:${ipHash}`, LEAD_LIMIT, LEAD_WINDOW_MS)) {
    return Response.json(
      { ok: false, error: `Too many requests. Please call ${business.phoneDisplay}.` },
      { status: 429 },
    );
  }
  const fingerprint = hashValue(`${ipHash}:${data.name}:${data.phone}:${data.email}:${data.message}`);
  if (isDuplicatePayload(`lead-dup:${fingerprint}`)) {
    return Response.json({ ok: false, error: "This request has already been sent." }, { status: 429 });
  }

  const lead: StoredLead = {
    name: data.name,
    phone: data.phone,
    email: data.email,
    message: data.message,
    ipHash,
    source: "chat-estimate-request",
    receivedAt: new Date().toISOString(),
  };

  try {
    const destination = await store(lead);
    if (destination === "rate-limited") {
      return Response.json(
        { ok: false, error: `Too many requests. Please call ${business.phoneDisplay}.` },
        { status: 429 },
      );
    }
    await notify(lead);
    return Response.json({ ok: true, destination });
  } catch (error) {
    console.error("[chat-lead] failed to store lead", error);
    return Response.json(
      { ok: false, error: `We couldn’t send your request right now. Please call ${business.phoneDisplay}.` },
      { status: 500 },
    );
  }
}
