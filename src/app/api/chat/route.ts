import { answerFromKnowledge, chatSystemPrompt } from "@/lib/chat-knowledge";
import { clientIpHash, isCrossOrigin, withinRateLimit } from "@/lib/request-guard";

export const dynamic = "force-dynamic";

const CHAT_WINDOW_MS = 10 * 60 * 1000;
const CHAT_LIMIT = 25;
const MAX_QUESTION_LENGTH = 500;
const MAX_HISTORY = 8;

type HistoryMessage = { role: "user" | "assistant"; content: string };

function clean(value: unknown, max: number) {
  return (typeof value === "string" ? value : "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim()
    .slice(0, max);
}

/** Server-side AI call. The key never leaves the server; browser only talks to this route. */
async function askProvider(question: string, history: HistoryMessage[]) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature: 0,
      max_tokens: 220,
      messages: [
        { role: "system", content: chatSystemPrompt },
        ...history.map((m) => ({ role: m.role, content: m.content })),
        { role: "user", content: question },
      ],
    }),
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error(`AI provider returned ${response.status}`);
  const json = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
  const text = json.choices?.[0]?.message?.content?.trim();
  return text || null;
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

  const body = raw as Record<string, unknown>;
  const question = clean(body.message, MAX_QUESTION_LENGTH);
  if (!question) {
    return Response.json({ ok: false, error: "Please enter a message." }, { status: 422 });
  }

  const history: HistoryMessage[] = Array.isArray(body.history)
    ? body.history.slice(-MAX_HISTORY).flatMap((item): HistoryMessage[] => {
        if (!item || typeof item !== "object") return [];
        const m = item as Record<string, unknown>;
        const content = clean(m.content, MAX_QUESTION_LENGTH);
        if (!content) return [];
        return m.role === "user" || m.role === "assistant" ? [{ role: m.role, content }] : [];
      })
    : [];

  const ip = clientIpHash(req);
  if (!withinRateLimit(`chat:${ip}`, CHAT_LIMIT, CHAT_WINDOW_MS)) {
    return Response.json(
      { ok: false, error: "Too many messages right now. Please call (714) 870-6900." },
      { status: 429 },
    );
  }

  const verified = answerFromKnowledge(question);
  let reply = verified.text;
  let source: "ai" | "knowledge-base" = "knowledge-base";
  let degraded = false;

  if (process.env.OPENAI_API_KEY) {
    try {
      const aiReply = await askProvider(question, history);
      if (aiReply) {
        reply = aiReply;
        source = "ai";
      } else {
        degraded = true;
      }
    } catch (error) {
      console.error("[chat] AI provider unavailable, using verified knowledge base", error);
      degraded = true;
    }
  }

  return Response.json({ ok: true, reply, links: verified.links ?? [], source, degraded });
}
