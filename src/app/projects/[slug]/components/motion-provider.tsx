"use client";

/**
 * MotionProvider — applies `reducedMotion="user"` to the whole detail page so
 * every animation (including server-rendered sections wrapped in Reveal)
 * respects the visitor's prefers-reduced-motion setting. Thin client boundary.
 */
import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
