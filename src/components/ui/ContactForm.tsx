"use client";

import { useEffect, useState, type FormEvent } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import {
  SERVICE_OPTIONS,
  normalizeContact,
  validateContact,
  type ContactErrors,
} from "@/lib/validation";
import { cn } from "@/lib/utils";

const TOPIC_MAP: Record<string, (typeof SERVICE_OPTIONS)[number]> = {
  classic: "Classic car restoration consultation",
  fleet: "Fleet maintenance",
};

type Status = "idle" | "sending" | "sent" | "error";

const fieldCls =
  "w-full border-0 border-b border-line bg-transparent px-0 py-3 text-[1rem] text-bone placeholder:text-mute/60 transition-colors focus:border-bone focus:outline-none focus:ring-0";

export function ContactForm() {
  const [startedAt, setStartedAt] = useState(0);
  const [service, setService] = useState<string>(SERVICE_OPTIONS[0]);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverMsg, setServerMsg] = useState("");

  useEffect(() => {
    const id = setTimeout(() => {
      setStartedAt(Date.now());
      const topic = new URLSearchParams(window.location.search).get("topic");
      if (topic && TOPIC_MAP[topic]) setService(TOPIC_MAP[topic]);
    }, 0);
    return () => clearTimeout(id);
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const raw = Object.fromEntries(new FormData(form).entries()) as Record<string, unknown>;
    const data = normalizeContact({ ...raw, startedAt });
    const errs = validateContact(data);
    setErrors(errs);
    if (Object.keys(errs).length) {
      const first = Object.keys(errs)[0];
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    setStatus("sending");
    setServerMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; errors?: ContactErrors };
      if (res.ok && json.ok) {
        setStatus("sent");
        form.reset();
        return;
      }
      if (json.errors) setErrors(json.errors);
      setServerMsg(json.error ?? "Something went wrong. Please call us at (714) 870-6900.");
      setStatus("error");
    } catch {
      setServerMsg("Network error. Please check your connection or call (714) 870-6900.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div role="status" className="border border-line p-8 md:p-12">
        <p className="eyebrow">Message received</p>
        <p className="mt-4 font-serif text-3xl italic leading-tight text-bone md:text-4xl">Thank you — we’ll be in touch.</p>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-mute">
          Your message is with our team. During business hours, the fastest way to reach us is still the phone: (714) 870-6900.
        </p>
        <button type="button" onClick={() => { setStatus("idle"); setStartedAt(Date.now()); }} className="u-link mt-8 pb-1 text-xs font-semibold uppercase tracking-[0.22em]">
          Send another message
        </button>
      </div>
    );
  }

  const err = (k: keyof ContactErrors) =>
    errors[k] ? (
      <p id={`${k}-error`} className="mt-2 text-xs text-[#e3a49a]">
        {errors[k]}
      </p>
    ) : null;
  const aria = (k: keyof ContactErrors) => ({
    "aria-invalid": Boolean(errors[k]) || undefined,
    "aria-describedby": errors[k] ? `${k}-error` : undefined,
  });

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-8" aria-label="Contact Rollings Automotive">
      <div className="grid gap-8 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className="eyebrow">Name *</label>
          <input id="cf-name" name="name" autoComplete="name" required maxLength={120} className={fieldCls} {...aria("name")} />
          {err("name")}
        </div>
        <div>
          <label htmlFor="cf-email" className="eyebrow">Email *</label>
          <input id="cf-email" name="email" type="email" autoComplete="email" required maxLength={200} className={fieldCls} {...aria("email")} />
          {err("email")}
        </div>
        <div>
          <label htmlFor="cf-phone" className="eyebrow">Phone</label>
          <input id="cf-phone" name="phone" type="tel" autoComplete="tel" maxLength={30} className={fieldCls} {...aria("phone")} />
          {err("phone")}
        </div>
        <div>
          <label htmlFor="cf-vehicle" className="eyebrow">Vehicle (year, make, model)</label>
          <input id="cf-vehicle" name="vehicle" maxLength={120} className={fieldCls} placeholder="e.g. 1965 Chevrolet El Camino" />
        </div>
      </div>

      <div>
        <label htmlFor="cf-service" className="eyebrow">Topic *</label>
        <select
          id="cf-service"
          name="service"
          value={service}
          onChange={(e) => setService(e.target.value)}
          className={cn(fieldCls, "cursor-pointer appearance-none bg-ink-2")}
          {...aria("service")}
        >
          {SERVICE_OPTIONS.map((o) => (
            <option key={o} value={o} className="bg-ink-2">
              {o}
            </option>
          ))}
        </select>
        {err("service")}
      </div>

      <div>
        <label htmlFor="cf-message" className="eyebrow">How can we help? *</label>
        <textarea id="cf-message" name="message" rows={4} required maxLength={3000} className={cn(fieldCls, "resize-y")} {...aria("message")} />
        {err("message")}
      </div>

      {/* Honeypot — hidden from people and assistive tech */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="cf-company">Company</label>
        <input id="cf-company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      {serverMsg && (
        <p role="alert" className="border-l border-[#e3a49a] pl-4 text-sm text-[#e3a49a]">
          {serverMsg}
        </p>
      )}

      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={status === "sending"}
          className="group relative inline-flex min-h-12 items-center gap-3 overflow-hidden bg-bone px-8 py-4 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-ink transition-colors duration-500 hover:text-bone disabled:opacity-60"
        >
          <span aria-hidden className="absolute inset-0 origin-bottom scale-y-0 bg-ink-2 transition-transform duration-500 ease-[var(--ease-cine)] group-hover:scale-y-100" />
          <span className="relative">{status === "sending" ? "Sending…" : "Send message"}</span>
          {status === "sending" ? (
            <Loader2 className="relative size-4 animate-spin" aria-hidden />
          ) : (
            <ArrowRight className="relative size-4 transition-transform duration-500 group-hover:translate-x-1" strokeWidth={1.5} aria-hidden />
          )}
        </button>
        <p className="text-xs text-mute">We reply by email or phone. We never share your details.</p>
      </div>
    </form>
  );
}
