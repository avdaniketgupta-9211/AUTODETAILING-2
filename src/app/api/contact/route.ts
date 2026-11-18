import { createHash } from "node:crypto";
import { and, count, eq, gt } from "drizzle-orm";
import { db } from "@/db";
import { inquiries } from "@/db/schema";
import { isLikelySpam, normalizeContact, validateContact } from "@/lib/validation";

export const dynamic = "force-dynamic";

const RATE_LIMIT = 3;
const RATE_WINDOW_MS = 10 * 60 * 1000;

function clientIpHash(req: Request) {
  const fwd = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = fwd || req.headers.get("x-real-ip") || "unknown";
  const salt = process.env.INQUIRY_SALT ?? "rollings-inquiry";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

/** Optional email notification via Resend if configured. Failures never block persistence. */
async function notify(data: ReturnType<typeof normalizeContact>) {
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
        reply_to: data.email,
        subject: `Website inquiry — ${data.service}`,
        text: `Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone || "-"}\nVehicle: ${data.vehicle || "-"}\nTopic: ${data.service}\n\n${data.message}`,
      }),
      signal: AbortSignal.timeout(5000),
    });
  } catch {
    // swallow — inquiry is already stored
  }
}

export async function POST(req: Request) {
  const type = req.headers.get("content-type") ?? "";
  if (!type.includes("application/json")) {
    return Response.json({ ok: false, error: "Unsupported content type." }, { status: 415 });
  }

  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (origin && host && new URL(origin).host !== host) {
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

  const data = normalizeContact(raw as Record<string, unknown>);
  const errors = validateContact(data);
  if (Object.keys(errors).length) {
    return Response.json({ ok: false, errors }, { status: 422 });
  }

  // Silently accept-and-drop obvious bots so they get no signal to adapt.
  if (isLikelySpam(data)) {
    return Response.json({ ok: true, filtered: true });
  }

  const ipHash = clientIpHash(req);
  try {
    const since = new Date(Date.now() - RATE_WINDOW_MS);
    const [{ value: recent }] = await db
      .select({ value: count() })
      .from(inquiries)
      .where(and(eq(inquiries.ipHash, ipHash), gt(inquiries.createdAt, since)));
    if (recent >= RATE_LIMIT) {
      return Response.json(
        { ok: false, error: "Too many messages in a short time. Please call us at (714) 870-6900." },
        { status: 429 },
      );
    }

    await db.insert(inquiries).values({
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      vehicle: data.vehicle || null,
      service: data.service,
      message: data.message,
      ipHash,
    });
  } catch (err) {
    console.error("[contact] failed to store inquiry", err);
    return Response.json(
      { ok: false, error: "We couldn’t send your message right now. Please call (714) 870-6900." },
      { status: 500 },
    );
  }

  await notify(data);
  return Response.json({ ok: true });
}
