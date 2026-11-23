"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { ArrowUpRight, Loader2, MessageCircle, Send, X } from "lucide-react";
import { business } from "@/data/business";
import type { ChatLink } from "@/lib/chat-knowledge";
import type { ChatLeadErrors } from "@/lib/validation";
import { normalizeLead, validateLead } from "@/lib/validation";
import { cn } from "@/lib/utils";

type Message = { id: number; role: "assistant" | "user"; text: string; links?: ChatLink[] };
type LeadStatus = "idle" | "sending" | "sent" | "error";

const WELCOME = "Hi! 👋 Welcome! How can we help you today?";

/** Kept outside the component so render stays pure. */
const nowMs = () => Date.now();

const QUICK_OPTIONS = [
  { label: "Explore Our Services", action: "services" },
  { label: "Get a Free Estimate", action: "estimate" },
  { label: "Contact Our Team", action: "contact" },
  { label: "Ask a Question", action: "question" },
] as const;

const fieldCls =
  "w-full border-0 border-b border-line bg-transparent px-0 py-2.5 text-sm text-bone placeholder:text-mute/60 transition-colors focus:border-bone focus:outline-none focus:ring-0";

export function Chatbot() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ id: 0, role: "assistant", text: WELCOME }]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [aiUnavailable, setAiUnavailable] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadStatus, setLeadStatus] = useState<LeadStatus>("idle");
  const [leadErrors, setLeadErrors] = useState<ChatLeadErrors>({});
  const [serverMessage, setServerMessage] = useState("");
  const [startedAt, setStartedAt] = useState(0);

  const launcherRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(1);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        launcherRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ block: "end" });
  }, [messages, open, showLeadForm]);

  function toggle() {
    if (open) {
      setOpen(false);
      launcherRef.current?.focus();
    } else {
      setStartedAt(nowMs());
      setOpen(true);
    }
  }

  function openLeadForm() {
    setStartedAt(nowMs());
    setLeadStatus("idle");
    setLeadErrors({});
    setServerMessage("");
    setShowLeadForm(true);
  }

  function runQuickAction(action: (typeof QUICK_OPTIONS)[number]["action"]) {
    if (action === "services") {
      setOpen(false);
      router.push("/services");
    } else if (action === "estimate") {
      openLeadForm();
    } else if (action === "contact") {
      setOpen(false);
      router.push("/contact");
    } else {
      inputRef.current?.focus();
      setInput("");
    }
  }

  async function sendMessage(e?: FormEvent) {
    e?.preventDefault();
    const question = input.trim();
    if (!question || sending) return;

    const userMessage: Message = { id: nextId.current++, role: "user", text: question };
    const history = messages
      .filter((m) => m.id !== 0)
      .map((m) => ({ role: m.role, content: m.text }));
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question, history }),
      });
      const json = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        reply?: string;
        links?: ChatLink[];
        error?: string;
      };
      if (!res.ok || !json.ok || !json.reply) throw new Error(json.error || "Chat unavailable");
      setMessages((prev) => [
        ...prev,
        { id: nextId.current++, role: "assistant", text: json.reply!, links: json.links ?? [] },
      ]);
      setAiUnavailable(false);
    } catch {
      setAiUnavailable(true);
      setMessages((prev) => [
        ...prev,
        {
          id: nextId.current++,
          role: "assistant",
          text: "Our chat service is temporarily unavailable. You can still send us a message below, or call us directly.",
          links: [{ label: business.phoneDisplay, href: business.phoneHref }],
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  async function submitLead(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (leadStatus === "sending") return;
    const form = e.currentTarget;
    const raw = Object.fromEntries(new FormData(form).entries()) as Record<string, unknown>;
    const data = normalizeLead({ ...raw, startedAt });
    const errors = validateLead(data);
    setLeadErrors(errors);
    if (Object.keys(errors).length) {
      form.querySelector<HTMLElement>(`[name="${Object.keys(errors)[0]}"]`)?.focus();
      return;
    }

    setLeadStatus("sending");
    setServerMessage("");
    try {
      const res = await fetch("/api/chat/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        filtered?: boolean;
        errors?: ChatLeadErrors;
        error?: string;
      };
      if (res.ok && json.ok) {
        setLeadStatus("sent");
        form.reset();
        return;
      }
      if (json.errors) setLeadErrors(json.errors);
      setServerMessage(json.error || "We couldn’t send that right now. Please call us instead.");
      setLeadStatus("error");
    } catch {
      setServerMessage(`We couldn’t send that right now. Please call ${business.phoneDisplay}.`);
      setLeadStatus("error");
    }
  }

  function onInputKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowUp" && input.trim() && messages.length > 1) {
      const lastUser = [...messages].reverse().find((m) => m.role === "user");
      if (lastUser) setInput(lastUser.text);
    }
  }

  return (
    <div className="pointer-events-none fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-[55] flex flex-col items-end gap-3 sm:right-6">
      {open && (
        <section
          id="site-chat"
          data-chat-panel
          role="dialog"
          aria-label={`Chat with ${business.name}`}
          className="pointer-events-auto flex max-h-[min(70svh,38rem)] w-[min(23rem,calc(100vw-2rem))] flex-col border border-line bg-ink-2/95 shadow-[0_28px_80px_rgba(0,0,0,0.55)] backdrop-blur-md"
        >
          <header className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
            <div>
              <p className="eyebrow text-bone/70">{business.shortName} · Est. {business.founded}</p>
              <h2 className="mt-1 text-sm font-medium uppercase tracking-[0.16em] text-bone">How can we help?</h2>
            </div>
            <button
              type="button"
              onClick={toggle}
              aria-label="Close chat"
              className="grid size-9 shrink-0 place-items-center border border-line text-bone transition-colors duration-200 hover:border-bone hover:bg-bone hover:text-ink"
            >
              <X className="size-4" strokeWidth={1.5} aria-hidden />
            </button>
          </header>

          <div role="log" aria-live="polite" aria-label="Conversation" className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
            {messages.map((m) => (
              <div key={m.id} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[88%] border px-4 py-3 text-[0.82rem] leading-relaxed",
                    m.role === "user"
                      ? "border-bone/30 bg-bone text-ink"
                      : "border-line bg-ink/60 text-bone/90",
                  )}
                >
                  <p>{m.text}</p>
                  {m.links && m.links.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 border-t border-line pt-3">
                      {m.links.map((link) =>
                        link.href.startsWith("/") ? (
                          <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="u-link pb-0.5 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-bone">
                            {link.label}
                          </Link>
                        ) : (
                          <a key={link.href} href={link.href} className="u-link pb-0.5 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-bone">
                            {link.label}
                          </a>
                        ),
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {sending && (
              <p className="eyebrow flex items-center gap-2" role="status">
                <Loader2 className="size-3 animate-spin" aria-hidden /> Thinking…
              </p>
            )}
            <div ref={endRef} />
          </div>

          {showLeadForm ? (
            <div className="border-t border-line px-5 py-5">
              {leadStatus === "sent" ? (
                <div role="status" className="space-y-3">
                  <p className="text-sm text-bone">Thanks — your request has been sent. We’ll be in touch.</p>
                  <button type="button" onClick={openLeadForm} className="eyebrow u-link pb-0.5 text-bone">
                    Send another request
                  </button>
                </div>
              ) : (
                <>
                  <p className="eyebrow mb-3">Request a free estimate</p>
                  <form onSubmit={submitLead} noValidate className="grid gap-1">
                    <label className="sr-only" htmlFor="chat-lead-name">Name</label>
                    <input id="chat-lead-name" name="name" className={fieldCls} placeholder="Name" autoComplete="name" aria-invalid={!!leadErrors.name} />
                    {leadErrors.name && <p className="pb-1 text-xs text-[#e3a49a]">{leadErrors.name}</p>}

                    <label className="sr-only" htmlFor="chat-lead-phone">Phone Number</label>
                    <input id="chat-lead-phone" name="phone" type="tel" className={fieldCls} placeholder="Phone Number" autoComplete="tel" aria-invalid={!!leadErrors.phone} />
                    {leadErrors.phone && <p className="pb-1 text-xs text-[#e3a49a]">{leadErrors.phone}</p>}

                    <label className="sr-only" htmlFor="chat-lead-email">Email (Optional)</label>
                    <input id="chat-lead-email" name="email" type="email" className={fieldCls} placeholder="Email (Optional)" autoComplete="email" aria-invalid={!!leadErrors.email} />
                    {leadErrors.email && <p className="pb-1 text-xs text-[#e3a49a]">{leadErrors.email}</p>}

                    <label className="sr-only" htmlFor="chat-lead-message">How can we help you?</label>
                    <textarea id="chat-lead-message" name="message" rows={2} className={cn(fieldCls, "resize-none")} placeholder="How can we help you?" aria-invalid={!!leadErrors.message} />
                    {leadErrors.message && <p className="pb-1 text-xs text-[#e3a49a]">{leadErrors.message}</p>}

                    <div hidden aria-hidden>
                      <label htmlFor="chat-lead-company">Company</label>
                      <input id="chat-lead-company" name="company" tabIndex={-1} autoComplete="off" />
                    </div>

                    {serverMessage && <p role="alert" className="pb-1 text-xs text-[#e3a49a]">{serverMessage}</p>}
                    <div className="mt-3 flex items-center gap-3">
                      <button
                        type="submit"
                        disabled={leadStatus === "sending"}
                        className="group inline-flex min-h-11 items-center gap-2 bg-bone px-5 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-ink transition-colors duration-200 hover:bg-ink-2 hover:text-bone disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {leadStatus === "sending" ? "Sending…" : "Send request"}
                        {leadStatus !== "sending" && <ArrowUpRight className="size-3.5" strokeWidth={1.5} aria-hidden />}
                      </button>
                      <a href={business.phoneHref} className="u-link pb-0.5 text-xs text-bone/80">{business.phoneDisplay}</a>
                    </div>
                  </form>
                </>
              )}
            </div>
          ) : (
            <>
              <div className="border-t border-line px-5 py-4">
                {aiUnavailable && (
                  <p className="mb-3 text-xs leading-relaxed text-mute">
                    Chat is unavailable right now. Use the form below or{" "}
                    <Link href="/contact" onClick={() => setOpen(false)} className="u-link pb-0.5 text-bone">contact us directly</Link>.
                  </p>
                )}
                <div className="flex flex-wrap gap-2">
                  {QUICK_OPTIONS.map((option) => (
                    <button
                      key={option.action}
                      type="button"
                      onClick={() => runQuickAction(option.action)}
                      className="border border-line px-3 py-2 text-[0.68rem] font-medium uppercase tracking-[0.12em] text-bone/85 transition-colors duration-200 hover:border-bone hover:bg-bone hover:text-ink"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              <form onSubmit={sendMessage} className="flex items-center gap-2 border-t border-line px-4 py-3">
                <label className="sr-only" htmlFor="chat-input">Ask a question</label>
                <input
                  ref={inputRef}
                  id="chat-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onInputKeyDown}
                  placeholder="Ask a question…"
                  maxLength={500}
                  className="min-w-0 flex-1 bg-transparent py-2 text-sm text-bone placeholder:text-mute/60 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || sending}
                  aria-label="Send message"
                  className="grid size-10 shrink-0 place-items-center border border-line text-bone transition-colors duration-200 hover:border-bone hover:bg-bone hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Send className="size-4" strokeWidth={1.5} aria-hidden />
                </button>
              </form>
            </>
          )}

          {aiUnavailable && !showLeadForm && (
            <button type="button" onClick={openLeadForm} className="eyebrow u-link pb-0.5 border-t border-line px-5 py-3 text-left text-bone">
              Open fallback contact form
            </button>
          )}
        </section>
      )}

      <button
        ref={launcherRef}
        type="button"
        data-chat-launcher
        onClick={toggle}
        aria-label={open ? "Close chat" : "Open chat"}
        aria-expanded={open}
        aria-controls="site-chat"
        className="pointer-events-auto grid size-12 place-items-center bg-bone text-ink shadow-[0_12px_36px_rgba(0,0,0,0.45)] transition-[transform,background-color,color] duration-[280ms] ease-[var(--ease-out-soft)] hover:scale-105 hover:bg-ink-2 hover:text-bone focus-visible:scale-105 sm:size-14"
      >
        {open ? <X className="size-5" strokeWidth={1.5} aria-hidden /> : <MessageCircle className="size-5" strokeWidth={1.5} aria-hidden />}
      </button>
    </div>
  );
}
