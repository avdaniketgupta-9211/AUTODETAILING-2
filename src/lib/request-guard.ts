import { createHash } from "node:crypto";

/** Salted, one-way client identifier used for rate limiting — never stored raw. */
export function clientIpHash(req: Request) {
  const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwarded || req.headers.get("x-real-ip") || "unknown";
  const salt = process.env.INQUIRY_SALT ?? "rollings-inquiry";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

/** Reject cross-origin JSON posts (same protection as the contact API). */
export function isCrossOrigin(req: Request) {
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host !== host;
  } catch {
    return true;
  }
}

/** Small in-memory sliding-window limiter. Serverless instances are isolated. */
const windows = new Map<string, number[]>();

export function withinRateLimit(key: string, limit: number, windowMs: number, now = Date.now()) {
  const recent = (windows.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    windows.set(key, recent);
    return false;
  }
  recent.push(now);
  windows.set(key, recent);
  return true;
}

/** Identical payloads from the same client within a minute are duplicates. */
const recentPayloads = new Map<string, number>();

export function isDuplicatePayload(key: string, now = Date.now()) {
  const last = recentPayloads.get(key);
  if (last && now - last < 60_000) return true;
  recentPayloads.set(key, now);
  return false;
}

export function hashValue(value: string) {
  return createHash("sha256").update(value).digest("hex");
}
