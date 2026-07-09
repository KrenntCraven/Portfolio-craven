"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import { EASE, FOCUS_RING } from "../project-ui";

const CravunChat = dynamic(() => import("./cravun-chat"), { ssr: false });

function ChatIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      {/* Rounded speech bubble */}
      <path
        d="M4 6.2A3.2 3.2 0 0 1 7.2 3h9.6A3.2 3.2 0 0 1 20 6.2v6.4a3.2 3.2 0 0 1-3.2 3.2H10l-3.7 3.3A1 1 0 0 1 4.6 18.4V15.6A3.2 3.2 0 0 1 4 12.6V6.2Z"
        fill="currentColor"
      />
      {/* Sparkle — mirrors the in-chat Cravun avatar for brand continuity */}
      <path
        d="M12 6l.95 2.55L15.5 9.5l-2.55.95L12 13l-.95-2.55L8.5 9.5l2.55-.95L12 6Z"
        fill="#171717"
      />
      <path
        d="M16.4 12.1l.42 1.13L18 13.7l-1.18.47-.42 1.13-.42-1.13L14.8 13.7l1.18-.47.42-1.13Z"
        fill="#525252"
      />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

export default function CravunLauncher() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const reduceMotion = useReducedMotion();

  const open = useCallback(() => {
    setHasOpened(true);
    setIsOpen(true);
  }, []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <>
      <motion.button
        type="button"
        onClick={() => (isOpen ? close() : open())}
        aria-label={isOpen ? "Close Cravun assistant" : "Open Cravun assistant"}
        aria-expanded={isOpen}
        initial={reduceMotion ? undefined : { opacity: 0, scale: 0.6 }}
        animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.8, ease: EASE }}
        whileHover={reduceMotion ? undefined : { y: -2 }}
        whileTap={reduceMotion ? undefined : { scale: 0.96 }}
        className={`group fixed bottom-6 right-6 z-100 grid h-14 w-14 place-items-center rounded-2xl bg-neutral-900 text-white shadow-[0_12px_34px_-14px_rgba(15,23,42,0.6)] transition-colors hover:bg-neutral-800 ${FOCUS_RING}`}
      >
        {/* Idle attention ring — subtle, not intrusive; hidden once opened */}
        {!isOpen && !reduceMotion && (
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-2xl border-2 border-[#6c5ce7]"
            animate={{ scale: [1, 1.32], opacity: [0.45, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          />
        )}
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isOpen ? "close" : "chat"}
            initial={reduceMotion ? undefined : { opacity: 0, rotate: -90, scale: 0.6 }}
            animate={reduceMotion ? undefined : { opacity: 1, rotate: 0, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, rotate: 90, scale: 0.6 }}
            transition={{ duration: 0.2, ease: EASE }}
            className="grid place-items-center"
          >
            {isOpen ? (
              <CloseIcon className="h-6 w-6" />
            ) : (
              <ChatIcon className="h-7 w-7" />
            )}
          </motion.span>
        </AnimatePresence>
      </motion.button>

      {hasOpened && <CravunChat isOpen={isOpen} onClose={close} />}
    </>
  );
}
