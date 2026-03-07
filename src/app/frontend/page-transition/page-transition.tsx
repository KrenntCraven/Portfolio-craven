"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
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
  // Guard ref: prevents both the animation callback and the deadline timeout from
  // advancing the phase simultaneously (whichever fires first "wins").
  const phaseAdvancedRef = useRef(false);

  const skipHeavyAnimation = useRef(
    typeof window !== "undefined" &&
      (window.matchMedia("(pointer: coarse)").matches ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        navigator.maxTouchPoints > 0),
  ).current;

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

  // Deadline safety-net: if the animation callback never fires (can happen in
  // production with framer-motion WAAPI path animations), force-advance the phase
  // so the dark overlay never stays on screen permanently.
  useEffect(() => {
    phaseAdvancedRef.current = false; // reset guard whenever phase changes
    if (phase === "idle") return;

    const deadline = phase === "cover" ? 900 : 700;
    const timer = setTimeout(() => {
      if (phaseAdvancedRef.current) return;
      phaseAdvancedRef.current = true;
      if (phase === "cover") {
        const nextHref = nextHrefRef.current;
        if (nextHref) router.push(nextHref);
        setPhase("reveal");
      } else if (phase === "reveal") {
        nextHrefRef.current = null;
        setPhase("idle");
      }
    }, deadline);
    return () => clearTimeout(timer);
  }, [phase, router]);

  const handleAnimationComplete = useCallback(() => {
    if (phaseAdvancedRef.current) return; // deadline already fired
    phaseAdvancedRef.current = true;

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
      {phase !== "idle" &&
        (skipHeavyAnimation ? (
          /* Simple fade for mobile / reduced-motion */
          <motion.div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-[60] bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === "cover" ? 1 : 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            onAnimationComplete={handleAnimationComplete}
          />
        ) : (
          /* Full orb + SVG animation for desktop */
          <motion.div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-[60]"
            animate={{ y: phase === "reveal" ? "-100%" : "0%" }}
            transition={
              phase === "reveal"
                ? { duration: 0.45, ease: [0.76, 0, 0.24, 1] }
                : { duration: 0 }
            }
            onAnimationComplete={
              phase === "reveal" ? handleAnimationComplete : undefined
            }
          >
            <div
              className="absolute inset-0 bg-white overflow-hidden"
              style={{ visibility: phase === "reveal" ? "hidden" : "visible" }}
            >
              <motion.div
                className="absolute -top-20 -left-20 w-96 h-96 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(108, 92, 231, 0.4) 0%, rgba(108, 92, 231, 0.2) 40%, transparent 70%)",
                }}
                animate={
                  phase === "cover"
                    ? {
                        x: [0, 100, 50, 150],
                        y: [0, 80, 150, 100],
                        scale: [1, 1.2, 0.9, 1.1],
                      }
                    : { x: 150, y: 100, scale: 1.1 }
                }
                transition={
                  phase === "cover"
                    ? { duration: 0.55, ease: "easeInOut" }
                    : { duration: 0 }
                }
              />
              <motion.div
                className="absolute top-1/4 right-0 w-80 h-80 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(108, 92, 231, 0.35) 0%, rgba(108, 92, 231, 0.15) 50%, transparent 75%)",
                }}
                animate={
                  phase === "cover"
                    ? {
                        x: [0, -120, -80, -100],
                        y: [0, 100, 50, 80],
                        scale: [1, 0.9, 1.1, 1],
                      }
                    : { x: -100, y: 80, scale: 1 }
                }
                transition={
                  phase === "cover"
                    ? { duration: 0.55, ease: "easeInOut", delay: 0.05 }
                    : { duration: 0 }
                }
              />
              <motion.div
                className="absolute bottom-0 left-1/3 w-72 h-72 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(108, 92, 231, 0.3) 0%, rgba(108, 92, 231, 0.1) 50%, transparent 70%)",
                }}
                animate={
                  phase === "cover"
                    ? {
                        x: [0, -50, 100, 0],
                        y: [0, -100, -150, -120],
                        scale: [1, 1.1, 0.95, 1.05],
                      }
                    : { x: 0, y: -120, scale: 1.05 }
                }
                transition={
                  phase === "cover"
                    ? { duration: 0.55, ease: "easeInOut", delay: 0.1 }
                    : { duration: 0 }
                }
              />
              <motion.div
                className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(108, 92, 231, 0.25) 0%, rgba(108, 92, 231, 0.08) 50%, transparent 70%)",
                }}
                animate={
                  phase === "cover"
                    ? {
                        x: [-120, 50, -80, 0],
                        y: [-120, 80, -50, 30],
                        scale: [1, 1.15, 0.85, 1],
                      }
                    : { x: 0, y: 30, scale: 1 }
                }
                transition={
                  phase === "cover"
                    ? { duration: 0.55, ease: "easeInOut", delay: 0.08 }
                    : { duration: 0 }
                }
              />
              <motion.div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse at center, transparent 0%, rgba(255, 255, 255, 0.3) 100%)",
                }}
                animate={
                  phase === "cover"
                    ? { opacity: [0, 0.5, 0.8, 1] }
                    : { opacity: 1 }
                }
                transition={
                  phase === "cover"
                    ? { duration: 0.55, ease: "easeInOut" }
                    : { duration: 0 }
                }
              />
            </div>
            <svg
              className="h-full w-full relative z-10"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              style={{ visibility: phase === "reveal" ? "hidden" : "visible" }}
            >
              <defs>
                {/* Hard-coded hex instead of CSS var() — paint-server attributes
                    don't reliably resolve CSS variables in all browsers. */}
                <linearGradient
                  id="page-transition-gradient"
                  x1="0"
                  y1="0"
                  x2="99"
                  y2="99"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0" stopColor="#171717" />
                  <stop offset="1" stopColor="#262626" />
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
                      : PATHS.end,
                }}
                transition={
                  phase === "cover"
                    ? { duration: 0.55, times: [0, 0.5, 1], ease: "easeInOut" }
                    : { duration: 0 }
                }
                onAnimationComplete={
                  phase === "cover" ? handleAnimationComplete : undefined
                }
              />
            </svg>
          </motion.div>
        ))}
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
