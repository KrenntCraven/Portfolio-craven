"use client";

/**
 * Reveal — a tiny client boundary that animates its (server-rendered) children
 * into view on scroll. Keeping this isolated lets the section content itself
 * stay a Server Component while still getting the site's subtle motion.
 */
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { EASE } from "../../../frontend/project-ui";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Delay in seconds before the reveal begins. */
  delay?: number;
  /** Vertical travel distance in px (defaults to 24). */
  y?: number;
};

export function Reveal({ children, className, delay = 0, y = 24 }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: EASE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
