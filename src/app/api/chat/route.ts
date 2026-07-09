import { groq } from "@ai-sdk/groq";
import { streamText } from "ai";
import { NextResponse } from "next/server";
import { CRAVUN_DECLINE, isPromptInjection } from "@/app/frontend/chatbot/cravun-guard";
import { buildCravunSystemPrompt } from "@/app/frontend/chatbot/cravun-knowledge";
import { isInScope } from "@/app/frontend/chatbot/cravun-relevance";

function decline() {
  return new Response(CRAVUN_DECLINE, {
    status: 200,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

// Lightweight availability probe. The client calls this when the panel opens so
// it can show a graceful "getting ready / temporarily unavailable" state
// instead of surfacing a raw error mid-conversation. Intentionally leaks no
// technical detail — just a boolean.
export function GET() {
  return NextResponse.json(
    { available: Boolean(process.env.GROQ_API_KEY) },
    { headers: { "Cache-Control": "no-store" } },
  );
}

// Ordered fallback chain. Each Groq model has its OWN daily token bucket (TPD),
// so when the primary is exhausted (429) we transparently rotate to the next.
// Override/extend via GROQ_MODELS="model-a,model-b,..." without a code change.
const MODELS = (process.env.GROQ_MODELS?.split(",")
  .map((m) => m.trim())
  .filter(Boolean) ?? []) as string[];
const DEFAULT_MODELS = [
  "llama-3.3-70b-versatile",
  "meta-llama/llama-4-maverick-17b-128e-instruct",
  "openai/gpt-oss-120b",
  "llama-3.1-8b-instant",
  "gemma2-9b-it",
];
const MODEL_CHAIN = MODELS.length ? MODELS : DEFAULT_MODELS;

const MAX_MESSAGES = 20;
const MAX_CHARS_PER_MESSAGE = 1500;

const encoder = new TextEncoder();

function errorInfo(err: unknown): { status?: number; message: string } {
  const e = err as {
    statusCode?: number;
    message?: string;
    responseBody?: string;
    lastError?: { statusCode?: number; message?: string };
    cause?: { statusCode?: number };
  };
  const status = e?.statusCode ?? e?.lastError?.statusCode ?? e?.cause?.statusCode;
  const message = [e?.message, e?.lastError?.message, e?.responseBody]
    .filter(Boolean)
    .join(" ");
  return { status, message: String(message) };
}

/** Daily/rate quota exhausted — worth rotating to the next model. */
function isRateLimit(err: unknown): boolean {
  const { status, message } = errorInfo(err);
  return status === 429 || /rate.?limit|quota|tokens per day|\bTPD\b/i.test(message);
}

/** Model retired/renamed/unavailable — skip it and try the next. */
function isModelUnavailable(err: unknown): boolean {
  const { status, message } = errorInfo(err);
  return (
    status === 404 ||
    /decommission|does not exist|not found|invalid.*model|model_/i.test(message)
  );
}

type FullStreamPart = { type: string; text?: string; error?: unknown };

function deltaText(part: FullStreamPart): string {
  if (part.type !== "text-delta") return "";
  return part.text ?? "";
}

/**
 * Stream a completion, rotating through MODEL_CHAIN on rate-limit / model
 * errors. In AI SDK v7 errors don't reject the read — they arrive as `error`
 * parts on `fullStream`. So we peek the stream until the FIRST text arrives
 * (success → keep this model) or an error part shows up (rotate to the next).
 * This means an exhausted daily quota is handled before any bytes reach the
 * client.
 */
async function streamWithFallback(
  system: string,
  messages: IncomingMessage[],
): Promise<ReadableStream<Uint8Array>> {
  let lastError: unknown;

  for (const model of MODEL_CHAIN) {
    let reader:
      | ReadableStreamDefaultReader<FullStreamPart>
      | undefined;
    try {
      const result = streamText({
        model: groq(model),
        system,
        messages,
        temperature: 0.3,
        maxOutputTokens: 600,
      });

      reader = result.fullStream.getReader() as ReadableStreamDefaultReader<FullStreamPart>;

      // Peek until first text (success) or an error part (rotate).
      const buffered: string[] = [];
      let started = false;
      while (!started) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value.type === "error") throw value.error;
        const t = deltaText(value);
        if (t) {
          buffered.push(t);
          started = true;
        }
      }

      if (!started) {
        lastError = lastError ?? new Error(`Empty response from "${model}".`);
        await reader.cancel().catch(() => {});
        continue;
      }

      const r = reader;
      return new ReadableStream<Uint8Array>({
        async start(controller) {
          try {
            for (const t of buffered) controller.enqueue(encoder.encode(t));
            while (true) {
              const { done, value } = await r.read();
              if (done) break;
              if (value.type === "error") throw value.error;
              const t = deltaText(value);
              if (t) controller.enqueue(encoder.encode(t));
            }
            controller.close();
          } catch (streamErr) {
            controller.error(streamErr);
          }
        },
        cancel() {
          void r.cancel();
        },
      });
    } catch (err) {
      lastError = err;
      try {
        await reader?.cancel();
      } catch {
        /* noop */
      }
      if (isRateLimit(err) || isModelUnavailable(err)) {
        console.warn(
          `Cravun: model "${model}" unavailable (${
            isRateLimit(err) ? "rate limit" : "model error"
          }); rotating to next.`,
        );
        continue;
      }
      throw err;
    }
  }

  throw lastError;
}

// Best-effort in-memory rate limit. Note: resets per serverless instance, so
// this is a soft guard against casual abuse rather than a hard quota.
const RATE_LIMIT = 20; // requests
const RATE_WINDOW_MS = 60_000; // per minute
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > RATE_LIMIT;
}

type IncomingMessage = { role: "user" | "assistant"; content: string };

function sanitize(messages: unknown): IncomingMessage[] | null {
  if (!Array.isArray(messages) || messages.length === 0) return null;

  const trimmed = messages.slice(-MAX_MESSAGES);
  const clean: IncomingMessage[] = [];

  for (const m of trimmed) {
    if (!m || typeof m !== "object") return null;
    const role = (m as { role?: unknown }).role;
    const content = (m as { content?: unknown }).content;
    if (role !== "user" && role !== "assistant") return null;
    if (typeof content !== "string") return null;
    const text = content.trim();
    if (!text) continue;
    clean.push({ role, content: text.slice(0, MAX_CHARS_PER_MESSAGE) });
  }

  return clean.length ? clean : null;
}

export async function POST(req: Request) {
  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json(
      { error: "Cravun is offline right now (missing configuration)." },
      { status: 503 },
    );
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many messages — give Cravun a moment and try again." },
      { status: 429 },
    );
  }

  let messages: IncomingMessage[] | null;
  try {
    const body = await req.json();
    messages = sanitize(body?.messages);
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!messages) {
    return NextResponse.json(
      { error: "A message is required." },
      { status: 400 },
    );
  }

  const lastUser = [...messages].reverse().find((m) => m.role === "user");

  // Layer 1 — deterministic guardrail: short-circuit prompt-injection /
  // instruction-override attempts with a canned decline (no model call).
  if (lastUser && isPromptInjection(lastUser.content)) {
    return decline();
  }

  // Layer 2 — intent/relevance gate: a fast classifier decides whether the
  // question is answerable from the portfolio BEFORE the main model runs, so
  // out-of-scope questions (definitions, tutorials, general knowledge) are
  // declined immediately and never get a general-knowledge answer.
  if (lastUser && !(await isInScope(lastUser.content))) {
    return decline();
  }

  try {
    const system = await buildCravunSystemPrompt();
    const stream = await streamWithFallback(system, messages);

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Cravun chat error:", error);
    // Whole fallback chain exhausted (or unavailable) → 503 so the client shows
    // the graceful "temporarily unavailable" state instead of a hard error.
    if (isRateLimit(error) || isModelUnavailable(error)) {
      return NextResponse.json(
        { error: "Cravun is taking a short break. Please try again soon." },
        { status: 503 },
      );
    }
    return NextResponse.json(
      { error: "Cravun hit a snag. Please try again." },
      { status: 500 },
    );
  }
}
