"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { EASE, FOCUS_RING } from "../project-ui";
import { useKeyboardInset } from "../hooks/use-keyboard-inset";

interface CravunChatProps {
  isOpen: boolean;
  onClose: () => void;
}

type Role = "user" | "assistant";
type Message = {
  id: string;
  role: Role;
  content: string;
  time: number;
  isError?: boolean;
};

/** Availability lifecycle for the assistant panel. */
type Availability = "checking" | "available" | "unavailable";

/** Direct fallback when the assistant is temporarily offline. */
const CONTACT_EMAIL = "krenntc@gmail.com";

const GREETING =
  "Hi, I'm Cravun — Krennt's AI assistant. Ask me anything about his experience, projects, skills, or how to get in touch.";

/** Friendly, natural-language quick actions (shown before the first message). */
const SUGGESTIONS = [
  "Tell me about Krennt's experience",
  "What projects has he built?",
  "What technologies does he use?",
  "What certifications does he have?",
  "How can I reach him?",
];

let idCounter = 0;
const nextId = () => `m${idCounter++}`;

const formatTime = (t: number) =>
  new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

/* ------------------------------------------------------------------ */
/* Icons                                                               */
/* ------------------------------------------------------------------ */
function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2l1.9 5.1L19 9l-5.1 1.9L12 16l-1.9-5.1L5 9l5.1-1.9L12 2z" />
      <path d="M19 14l.9 2.4L22 17l-2.1.6L19 20l-.9-2.4L16 17l2.1-.6L19 14z" />
    </svg>
  );
}

function SendIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 12l16-8-6 16-3-6-7-2z"
        fill="currentColor"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CravunAvatar({ withStatus = false }: { withStatus?: boolean }) {
  return (
    <span className="relative inline-grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-neutral-900 text-white shadow-md shadow-black/15">
      <SparkleIcon className="h-4 w-4" />
      {withStatus && (
        <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3 items-center justify-center rounded-full border-2 border-white bg-[#28c840]" />
      )}
    </span>
  );
}

function TypingDots() {
  return (
    <span className="flex items-center gap-1 py-1" aria-label="Cravun is typing">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-neutral-400"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.15,
          }}
        />
      ))}
    </span>
  );
}

/** A single shimmering placeholder bar used by the loading skeleton. */
function Shimmer({
  className,
  reduceMotion,
}: {
  className?: string;
  reduceMotion: boolean | null;
}) {
  return (
    <span
      className={`relative block overflow-hidden rounded-md bg-neutral-200/80 ${
        reduceMotion ? "animate-pulse" : ""
      } ${className ?? ""}`}
    >
      {!reduceMotion && (
        <motion.span
          aria-hidden
          className="absolute inset-0 bg-linear-to-r from-transparent via-white/70 to-transparent"
          animate={{ x: ["-120%", "120%"] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </span>
  );
}

/** Loading state — a chat-shaped skeleton shown while availability resolves. */
function LoadingState({ reduceMotion }: { reduceMotion: boolean | null }) {
  return (
    <div
      className="flex min-h-[220px] flex-1 flex-col gap-4 px-4 py-4"
      aria-busy="true"
      aria-label="Cravun is getting ready"
    >
      <div className="flex items-end gap-2.5">
        <CravunAvatar />
        <div className="flex flex-col gap-2">
          <Shimmer reduceMotion={reduceMotion} className="h-3 w-44" />
          <Shimmer reduceMotion={reduceMotion} className="h-3 w-28" />
        </div>
      </div>
      <div className="flex justify-end">
        <Shimmer reduceMotion={reduceMotion} className="h-8 w-40 rounded-2xl" />
      </div>
      <div className="flex items-end gap-2.5">
        <CravunAvatar />
        <Shimmer reduceMotion={reduceMotion} className="h-12 w-56 rounded-2xl" />
      </div>
      <div className="mt-auto flex items-center justify-center gap-2 pt-2 text-xs font-medium text-neutral-400">
        <TypingDots />
        <span>Cravun is getting ready…</span>
      </div>
    </div>
  );
}

/** Graceful fallback shown when the assistant can't be reached right now. */
function UnavailableState({
  onRetry,
  reduceMotion,
}: {
  onRetry: () => void;
  reduceMotion: boolean | null;
}) {
  return (
    <div className="flex min-h-[220px] flex-1 flex-col items-center justify-center gap-4 px-6 py-8 text-center">
      <motion.span
        className="grid h-16 w-16 place-items-center rounded-2xl bg-linear-to-br from-neutral-100 to-neutral-200 text-neutral-400 shadow-inner"
        animate={reduceMotion ? undefined : { y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <SparkleIcon className="h-7 w-7" />
      </motion.span>
      <div className="space-y-1.5">
        <p className="text-sm font-bold tracking-tight text-neutral-900">
          Assistant temporarily unavailable
        </p>
        <p className="mx-auto max-w-68 text-sm leading-relaxed text-neutral-500">
          Cravun is taking a short break. Please check back in a little while — or
          reach Krennt directly.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
        <button
          type="button"
          onClick={onRetry}
          className={`inline-flex items-center gap-1.5 rounded-full bg-neutral-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-neutral-800 ${FOCUS_RING}`}
        >
          <svg
            className="h-3.5 w-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 4v6h6M20 20v-6h-6M20 9a8 8 0 0 0-14.9-2M4 15a8 8 0 0 0 14.9 2"
            />
          </svg>
          Try again
        </button>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className={`inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-semibold text-neutral-600 transition-colors hover:border-[#6c5ce7]/40 hover:text-[#6c5ce7] ${FOCUS_RING}`}
        >
          Email Krennt
        </a>
      </div>
    </div>
  );
}

export default function CravunChat({ isOpen, onClose }: CravunChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [atBottom, setAtBottom] = useState(true);
  const [availability, setAvailability] = useState<Availability>("checking");

  const panelRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesRef = useRef<Message[]>([]);
  const atBottomRef = useRef(true);
  const reduceMotion = useReducedMotion();
  const keyboardInset = useKeyboardInset(isOpen);

  messagesRef.current = messages;

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior });
  }, []);

  // Probe availability so the panel can show a graceful "getting ready" or
  // "temporarily unavailable" state instead of a raw error. A short minimum
  // dwell keeps the skeleton from flashing on fast connections.
  const checkAvailability = useCallback(async () => {
    setAvailability("checking");
    try {
      const [res] = await Promise.all([
        fetch("/api/chat", { method: "GET", cache: "no-store" }),
        new Promise((r) => setTimeout(r, reduceMotion ? 0 : 650)),
      ]);
      const data = await res.json().catch(() => null);
      setAvailability(data?.available ? "available" : "unavailable");
    } catch {
      setAvailability("unavailable");
    }
  }, [reduceMotion]);

  // Track whether the user is pinned to the bottom so streaming/new replies
  // only auto-scroll when they haven't scrolled up to read older messages.
  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
    const near = distance < 96;
    atBottomRef.current = near;
    setAtBottom(near);
  }, []);

  // Auto-scroll on new content only when already at the bottom, or when the
  // latest message is the visitor's own (so sending always jumps to it).
  useEffect(() => {
    const last = messages[messages.length - 1];
    const fromUser = last?.role === "user";
    if (atBottomRef.current || fromUser) {
      scrollToBottom(reduceMotion ? "auto" : "smooth");
    }
  }, [messages, minimized, reduceMotion, scrollToBottom]);

  useEffect(() => {
    if (!isOpen) return;
    setMinimized(false);
    void checkAvailability();
  }, [isOpen, checkAvailability]);

  // Focus the input only once the assistant is actually ready to talk.
  useEffect(() => {
    if (!isOpen || availability !== "available") return;
    const id = window.setTimeout(() => inputRef.current?.focus(), 120);
    return () => window.clearTimeout(id);
  }, [isOpen, availability]);

  // Lock body scroll only while the mobile sheet is open.
  useEffect(() => {
    if (!isOpen) return;
    const mq = window.matchMedia("(max-width: 639px)");
    if (mq.matches) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  // Contain wheel scrolling to the panel: the page behind must not scroll while
  // the pointer is over the assistant. `overscroll-contain` alone only helps at
  // the transcript's edges (and only when it overflows), so we intercept the
  // wheel and let it through only when the transcript can move that direction.
  useEffect(() => {
    if (!isOpen) return;
    const panel = panelRef.current;
    if (!panel) return;

    const onWheel = (e: WheelEvent) => {
      const scroller = scrollRef.current;
      const overScroller = !!scroller && scroller.contains(e.target as Node);

      if (scroller && overScroller) {
        const { scrollTop, scrollHeight, clientHeight } = scroller;
        const canScroll = scrollHeight > clientHeight;
        const atTop = scrollTop <= 0;
        const atBottom = scrollTop + clientHeight >= scrollHeight - 1;
        const goingUp = e.deltaY < 0;
        const goingDown = e.deltaY > 0;
        // Allow the transcript's own scroll unless it's pinned at an edge.
        if (canScroll && !((atTop && goingUp) || (atBottom && goingDown))) {
          return;
        }
      }
      // Otherwise (over header/input, or transcript at its edge / not scrollable)
      // swallow the wheel so it never reaches the page.
      e.preventDefault();
    };

    panel.addEventListener("wheel", onWheel, { passive: false });
    return () => panel.removeEventListener("wheel", onWheel);
  }, [isOpen]);

  const send = useCallback(
    async (raw: string) => {
      const text = raw.trim();
      if (!text || isStreaming) return;

      const history = messagesRef.current
        .filter((m) => !m.isError && m.content.trim())
        .map((m) => ({ role: m.role, content: m.content }));

      const userMsg: Message = {
        id: nextId(),
        role: "user",
        content: text,
        time: Date.now(),
      };
      const assistantMsg: Message = {
        id: nextId(),
        role: "assistant",
        content: "",
        time: Date.now(),
      };
      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setInput("");
      setIsStreaming(true);

      const updateAssistant = (content: string, isError = false) =>
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsg.id ? { ...m, content, isError } : m,
          ),
        );

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...history, { role: "user", content: text }],
          }),
        });

        if (!res.ok || !res.body) {
          // Backend went offline mid-session — fall back to the graceful
          // unavailable screen rather than a technical error bubble.
          if (res.status === 503) {
            setMessages((prev) => prev.filter((m) => m.id !== assistantMsg.id));
            setAvailability("unavailable");
            return;
          }
          const data = await res.json().catch(() => null);
          updateAssistant(
            data?.error ?? "Cravun couldn't respond. Please try again.",
            true,
          );
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let acc = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          acc += decoder.decode(value, { stream: true });
          updateAssistant(acc);
        }
        if (!acc.trim()) {
          updateAssistant("Cravun didn't have a response for that.", true);
        }
      } catch {
        updateAssistant("Connection lost. Please try again.", true);
      } finally {
        setIsStreaming(false);
        inputRef.current?.focus();
      }
    },
    [isStreaming],
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    void send(input);
  };

  const panelMotion = reduceMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.15 },
      }
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 12 },
        transition: { duration: 0.28, ease: EASE },
      };

  const msgEntrance = reduceMotion
    ? {}
    : { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 } };

  const lastId = messages[messages.length - 1]?.id;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Mobile backdrop */}
          <motion.div
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 z-100 bg-black/40 backdrop-blur-sm sm:hidden"
          />

          <motion.div
            ref={panelRef}
            {...panelMotion}
            role="dialog"
            aria-modal="true"
            aria-label="Cravun — Krennt's AI assistant"
            style={
              keyboardInset > 0
                ? {
                    bottom: keyboardInset,
                    maxHeight: `calc(100dvh - ${keyboardInset}px - 0.5rem)`,
                  }
                : undefined
            }
            className="fixed inset-x-0 bottom-0 z-101 flex max-h-[85dvh] flex-col overflow-hidden rounded-t-2xl border border-black/10 bg-white shadow-2xl shadow-black/20 origin-bottom pb-[env(safe-area-inset-bottom,0px)] sm:inset-x-auto sm:bottom-24 sm:right-6 sm:max-h-[min(600px,calc(100dvh-8rem))] sm:w-[400px] sm:max-w-[calc(100vw-3rem)] sm:rounded-2xl sm:origin-bottom-right sm:pb-0"
          >
            {/* Accent line */}
            <span
              aria-hidden
              className="absolute inset-x-0 top-0 z-10 h-0.5 bg-linear-to-r from-[#6c5ce7] to-[#a29bfe]"
            />

            {/* Grab handle — mobile bottom-sheet affordance */}
            <span
              aria-hidden
              className="mx-auto mt-2 h-1 w-9 shrink-0 rounded-full bg-neutral-300 sm:hidden"
            />

            {/* Header — fixed */}
            <div className="flex shrink-0 items-center gap-3 border-b border-neutral-100 px-4 py-3">
              <CravunAvatar withStatus />
              <div className="min-w-0 leading-tight">
                <p className="text-sm font-bold tracking-tight text-neutral-900">
                  Cravun
                </p>
                <p className="flex items-center gap-1.5 text-xs text-neutral-500">
                  <span className="relative flex h-1.5 w-1.5" aria-hidden>
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#28c840]/70" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#28c840]" />
                  </span>
                  Krennt&apos;s AI assistant
                </p>
              </div>
              <div className="ml-auto flex items-center gap-0.5">
                <button
                  type="button"
                  onClick={() => setMinimized((m) => !m)}
                  aria-label={minimized ? "Expand Cravun" : "Minimize Cravun"}
                  className={`rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 ${FOCUS_RING}`}
                >
                  <motion.svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden
                    animate={{ rotate: minimized ? 180 : 0 }}
                    transition={{ duration: 0.25, ease: EASE }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </motion.svg>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close Cravun"
                  className={`rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 ${FOCUS_RING}`}
                >
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <AnimatePresence initial={false}>
              {!minimized && (
                <motion.div
                  key="body"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="flex min-h-0 flex-1 flex-col overflow-hidden"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {availability === "checking" ? (
                      <motion.div
                        key="checking"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2, ease: EASE }}
                        className="flex min-h-0 flex-1 flex-col"
                      >
                        <LoadingState reduceMotion={reduceMotion} />
                      </motion.div>
                    ) : availability === "unavailable" ? (
                      <motion.div
                        key="unavailable"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25, ease: EASE }}
                        className="flex min-h-0 flex-1 flex-col"
                      >
                        <UnavailableState
                          onRetry={() => void checkAvailability()}
                          reduceMotion={reduceMotion}
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="available"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25, ease: EASE }}
                        className="flex min-h-0 flex-1 flex-col"
                      >
                  {/* Transcript — the only scrollable region */}
                  <div className="relative flex min-h-0 flex-1 flex-col">
                    <div
                      ref={scrollRef}
                      onScroll={handleScroll}
                      className="flex min-h-[220px] flex-1 flex-col overflow-y-auto overscroll-contain px-4 py-4 [scrollbar-gutter:stable]"
                    >
                      {/* Greeting */}
                      <div className="flex gap-2.5">
                        <CravunAvatar />
                        <div className="max-w-[82%] rounded-2xl rounded-tl-sm bg-neutral-100 px-3.5 py-2.5 text-sm leading-relaxed text-neutral-700 wrap-anywhere">
                          {GREETING}
                        </div>
                      </div>

                      {messages.map((m, i) => {
                        const isUser = m.role === "user";
                        const prevRole =
                          i > 0 ? messages[i - 1].role : "assistant";
                        const nextRole =
                          i < messages.length - 1
                            ? messages[i + 1].role
                            : null;
                        const startsGroup = m.role !== prevRole;
                        const endsGroup = m.role !== nextRole;
                        const streamingThis =
                          isStreaming && m.id === lastId && !m.content;
                        return (
                          <motion.div
                            key={m.id}
                            {...msgEntrance}
                            transition={{ duration: 0.25, ease: EASE }}
                            className={`flex gap-2.5 ${
                              startsGroup ? "mt-3" : "mt-1"
                            } ${isUser ? "justify-end" : ""}`}
                          >
                            {!isUser &&
                              (endsGroup ? (
                                <CravunAvatar />
                              ) : (
                                <span className="w-9 shrink-0" aria-hidden />
                              ))}
                            <div
                              className={`flex max-w-[82%] flex-col ${
                                isUser ? "items-end" : "items-start"
                              }`}
                            >
                              <div
                                className={`px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap wrap-anywhere ${
                                  isUser
                                    ? `rounded-2xl bg-linear-to-br from-[#6c5ce7] to-[#a29bfe] text-white ${
                                        endsGroup ? "rounded-br-sm" : ""
                                      }`
                                    : m.isError
                                      ? "rounded-2xl rounded-tl-sm border border-red-200 bg-red-50 text-red-600"
                                      : `rounded-2xl bg-neutral-100 text-neutral-800 ${
                                          startsGroup ? "rounded-tl-sm" : ""
                                        }`
                                }`}
                              >
                                {streamingThis ? <TypingDots /> : m.content}
                              </div>
                              {!streamingThis && endsGroup && (
                                <span className="mt-1 px-1 text-[10px] text-neutral-400">
                                  {formatTime(m.time)}
                                </span>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Jump to latest — appears when scrolled up */}
                    <AnimatePresence>
                      {!atBottom && (
                        <motion.button
                          type="button"
                          onClick={() => scrollToBottom()}
                          initial={{ opacity: 0, y: 6, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.9 }}
                          transition={{ duration: 0.2, ease: EASE }}
                          aria-label="Scroll to latest message"
                          className={`absolute bottom-3 left-1/2 grid h-9 w-9 -translate-x-1/2 place-items-center rounded-full border border-black/10 bg-white text-neutral-600 shadow-lg shadow-black/10 transition-colors hover:text-[#6c5ce7] ${FOCUS_RING}`}
                        >
                          <svg
                            className="h-4 w-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            aria-hidden
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 12l-7 7-7-7M12 5v14"
                            />
                          </svg>
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Suggested questions (before first message) */}
                  {messages.length === 0 && (
                    <div className="flex shrink-0 flex-wrap gap-2 px-4 pb-3">
                      {SUGGESTIONS.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => void send(s)}
                          className={`rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-medium text-neutral-600 transition-colors hover:border-[#6c5ce7]/40 hover:bg-[#6c5ce7]/5 hover:text-[#6c5ce7] ${FOCUS_RING}`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Input — fixed */}
                  <form
                    onSubmit={handleSubmit}
                    className="flex shrink-0 items-center gap-2 border-t border-neutral-100 p-3"
                  >
                    <input
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      disabled={isStreaming}
                      maxLength={1500}
                      placeholder="Ask Cravun anything…"
                      aria-label="Ask Cravun a question"
                      className="min-w-0 flex-1 rounded-full border border-black/10 bg-neutral-50 px-4 py-2.5 text-base text-neutral-900 transition-all placeholder:text-neutral-400 focus:border-[#6c5ce7] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6c5ce7]/20 disabled:opacity-60 sm:text-sm"
                    />
                    <motion.button
                      type="submit"
                      disabled={isStreaming || !input.trim()}
                      whileHover={
                        reduceMotion || isStreaming ? undefined : { scale: 1.05 }
                      }
                      whileTap={reduceMotion ? undefined : { scale: 0.92 }}
                      aria-label="Send message"
                      className={`grid h-10 w-10 shrink-0 place-items-center rounded-full bg-neutral-900 text-white shadow-lg shadow-black/20 transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40 ${FOCUS_RING}`}
                    >
                      <SendIcon className="h-4 w-4 -translate-x-px" />
                    </motion.button>
                  </form>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
