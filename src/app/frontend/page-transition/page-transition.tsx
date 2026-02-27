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
  disableOnPaths = [],
}: {
  children: React.ReactNode;
  disableOnPaths?: string[];
}) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("idle");
  const nextHrefRef = useRef<string | null>(null);

  const startTransition = useCallback(
    (href: string) => {
      if (phase !== "idle") return;
      const shouldDisable = disableOnPaths.includes(href);
      if (shouldDisable) {
        router.push(href);
        return;
      }
      nextHrefRef.current = href;
      setPhase("cover");
    },
    [disableOnPaths, phase, router],
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
        {/* Animated Background */}
        <div className="absolute inset-0 bg-white overflow-hidden">
          {/* Purple animated orbs */}
          <motion.div
            className="absolute -top-20 -left-20 w-96 h-96 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(108, 92, 231, 0.4) 0%, rgba(108, 92, 231, 0.2) 40%, transparent 70%)",
            }}
            animate={{
              x: phase !== "idle" ? [0, 100, 50, 150] : 0,
              y: phase !== "idle" ? [0, 80, 150, 100] : 0,
              scale: phase !== "idle" ? [1, 1.2, 0.9, 1.1] : 1,
            }}
            transition={{
              duration: phase === "cover" ? 0.55 : 0.35,
              ease: "easeInOut",
            }}
          />

          <motion.div
            className="absolute top-1/4 right-0 w-80 h-80 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(108, 92, 231, 0.35) 0%, rgba(108, 92, 231, 0.15) 50%, transparent 75%)",
            }}
            animate={{
              x: phase !== "idle" ? [0, -120, -80, -100] : 0,
              y: phase !== "idle" ? [0, 100, 50, 80] : 0,
              scale: phase !== "idle" ? [1, 0.9, 1.1, 1] : 1,
            }}
            transition={{
              duration: phase === "cover" ? 0.55 : 0.35,
              ease: "easeInOut",
              delay: 0.05,
            }}
          />

          <motion.div
            className="absolute bottom-0 left-1/3 w-72 h-72 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(108, 92, 231, 0.3) 0%, rgba(108, 92, 231, 0.1) 50%, transparent 70%)",
            }}
            animate={{
              x: phase !== "idle" ? [0, -50, 100, 0] : 0,
              y: phase !== "idle" ? [0, -100, -150, -120] : 0,
              scale: phase !== "idle" ? [1, 1.1, 0.95, 1.05] : 1,
            }}
            transition={{
              duration: phase === "cover" ? 0.55 : 0.35,
              ease: "easeInOut",
              delay: 0.1,
            }}
          />

          <motion.div
            className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(108, 92, 231, 0.25) 0%, rgba(108, 92, 231, 0.08) 50%, transparent 70%)",
            }}
            animate={{
              x: phase !== "idle" ? [-120, 50, -80, 0] : -120,
              y: phase !== "idle" ? [-120, 80, -50, 30] : -120,
              scale: phase !== "idle" ? [1, 1.15, 0.85, 1] : 1,
            }}
            transition={{
              duration: phase === "cover" ? 0.55 : 0.35,
              ease: "easeInOut",
              delay: 0.08,
            }}
          />

          {/* Subtle white overlay for depth */}
          <motion.div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 0%, rgba(255, 255, 255, 0.3) 100%)",
            }}
            animate={{
              opacity: phase !== "idle" ? [0, 0.5, 0.8, 1] : 0,
            }}
            transition={{
              duration: phase === "cover" ? 0.55 : 0.35,
              ease: "easeInOut",
            }}
          />
        </div>

        <svg
          className="h-full w-full relative z-10"
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
