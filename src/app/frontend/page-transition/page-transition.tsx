"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";

const TransitionContext = createContext<{
  startTransition: (href: string) => void;
} | null>(null);

const PATHS = {
  closed: "M 0 100 V 100 Q 50 100 100 100 V 100 z",
  start: "M 0 100 V 50 Q 50 0 100 50 V 100 z",
  end: "M 0 100 V 0 Q 50 0 100 0 V 100 z",
};

type Phase = "idle" | "cover" | "reveal";

export function PageTransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("idle");
  const nextHrefRef = useRef<string | null>(null);

  const startTransition = useCallback(
    (href: string) => {
      if (phase !== "idle") return;
      nextHrefRef.current = href;
      setPhase("cover");
    },
    [phase],
  );

  const handleAnimationComplete = useCallback(() => {
    if (phase === "cover") {
      const nextHref = nextHrefRef.current;
      if (nextHref) {
        router.push(nextHref);
      }
      setPhase("reveal");
      return;
    }

    if (phase === "reveal") {
      nextHrefRef.current = null;
      setPhase("idle");
    }
  }, [phase, router]);

  return (
    <TransitionContext.Provider value={{ startTransition }}>
      {children}
      <div
        aria-hidden="true"
        className={`pointer-events-none fixed inset-0 z-[60] transition-opacity duration-200 ${
          phase === "idle" ? "opacity-0" : "opacity-100"
        }`}
      >
        <svg
          className="h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient
              id="page-transition-gradient"
              x1="0"
              y1="0"
              x2="99"
              y2="99"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0.2" stopColor="var(--color-neutral-900)" />
            </linearGradient>
          </defs>
          <motion.path
            className="origin-center"
            fill="url(#page-transition-gradient)"
            stroke="url(#page-transition-gradient)"
            strokeWidth={2}
            vectorEffect="non-scaling-stroke"
            d={PATHS.closed}
            initial={false}
            animate={{
              d:
                phase === "cover"
                  ? [PATHS.closed, PATHS.start, PATHS.end]
                  : phase === "reveal"
                    ? [PATHS.end, PATHS.start, PATHS.closed]
                    : PATHS.closed,
            }}
            transition={{
              duration: phase === "cover" ? 0.55 : 0.35,
              times: [0, 0.5, 1],
              ease: "easeInOut",
            }}
            onAnimationComplete={handleAnimationComplete}
          />
        </svg>
      </div>
    </TransitionContext.Provider>
  );
}

export function usePageTransition() {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error(
      "usePageTransition must be used within PageTransitionProvider",
    );
  }
  return context;
}
