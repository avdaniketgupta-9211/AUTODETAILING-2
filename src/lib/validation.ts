export const SERVICE_OPTIONS = [
  "General repair & maintenance",
  "Classic car restoration consultation",
  "Fleet maintenance",
  "Brakes",
  "Engine",
  "Smog check",
  "Other",
] as const;

export type ContactInput = {
  name: string;
  email: string;
  phone: string;
  vehicle: string;
  service: string;
  message: string;
  /** honeypot — must stay empty */
  company: string;
  /** ms timestamp when the form was rendered */
  startedAt: number;
};

export type ContactErrors = Partial<Record<keyof ContactInput | "form", string>>;

export const MIN_FILL_MS = 2500;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+()\-.\s\d]{7,20}$/;

const str = (v: unknown, max: number) =>
  (typeof v === "string" ? v : "").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim().slice(0, max);

/** Normalises untrusted input into a well-typed object. */
export function normalizeContact(raw: Record<string, unknown>): ContactInput {
  const started = Number(raw.startedAt);
  return {
    name: str(raw.name, 120),
    email: str(raw.email, 200).toLowerCase(),
    phone: str(raw.phone, 30),
    vehicle: str(raw.vehicle, 120),
    service: str(raw.service, 80),
    message: str(raw.message, 3000),
    company: str(raw.company, 200),
    startedAt: Number.isFinite(started) ? started : 0,
  };
}

/** Field validation shared by the browser and the API route. */
export function validateContact(input: ContactInput): ContactErrors {
  const errors: ContactErrors = {};
  if (input.name.length < 2) errors.name = "Please enter your name.";
  if (!EMAIL_RE.test(input.email)) errors.email = "Please enter a valid email address.";
  if (input.phone && !PHONE_RE.test(input.phone)) errors.phone = "Please enter a valid phone number.";
  if (!(SERVICE_OPTIONS as readonly string[]).includes(input.service)) errors.service = "Please choose a topic.";
  if (input.message.length < 10) errors.message = "Please tell us a little more (at least 10 characters).";
  return errors;
}

/** Bot heuristics — returns true when the submission looks automated. */
export function isLikelySpam(input: ContactInput, now = Date.now()): boolean {
  if (input.company) return true;
  if (!input.startedAt || now - input.startedAt < MIN_FILL_MS) return true;
  const links = (input.message.match(/https?:\/\//gi) ?? []).length;
  return links > 2;
}

/* ─────────────────── Chat estimate-request lead (4 fields) ─────────────────── */

export type ChatLeadInput = {
  name: string;
  phone: string;
  email: string;
  message: string;
  /** honeypot — must stay empty */
  company: string;
  /** ms timestamp when the form was rendered */
  startedAt: number;
};

export type ChatLeadErrors = Partial<Record<keyof ChatLeadInput, string>>;

/** Normalises the chat lead form. Email is optional; phone is required. */
export function normalizeLead(raw: Record<string, unknown>): ChatLeadInput {
  const started = Number(raw.startedAt);
  return {
    name: str(raw.name, 120),
    phone: str(raw.phone, 30),
    email: str(raw.email, 200).toLowerCase(),
    message: str(raw.message, 3000),
    company: str(raw.company, 200),
    startedAt: Number.isFinite(started) ? started : 0,
  };
}

export function validateLead(input: ChatLeadInput): ChatLeadErrors {
  const errors: ChatLeadErrors = {};
  if (input.name.length < 2) errors.name = "Please enter your name.";
  if (!PHONE_RE.test(input.phone)) errors.phone = "Please enter a valid phone number.";
  if (input.email && !EMAIL_RE.test(input.email)) errors.email = "Please enter a valid email address.";
  if (input.message.length < 10) errors.message = "Please tell us a little more (at least 10 characters).";
  return errors;
}

export function isLikelySpamLead(input: ChatLeadInput, now = Date.now()): boolean {
  if (input.company) return true;
  if (!input.startedAt || now - input.startedAt < MIN_FILL_MS) return true;
  if (now - input.startedAt > 60 * 60 * 1000) return true;
  return (input.message.match(/https?:\/\//gi) ?? []).length > 2;
}
