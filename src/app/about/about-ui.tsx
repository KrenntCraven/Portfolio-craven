"use client";

import { motion } from "framer-motion";
import { forwardRef } from "react";
import {
  Eyebrow,
  fadeUpItem,
  inViewProps,
  sectionReveal,
} from "../frontend/project-ui";

/** Subtle developer grid — matches the landing page hero texture */
export function AboutGridOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-1"
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(108,92,231,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(108,92,231,0.05) 1px, transparent 1px)",
        backgroundSize: "46px 46px",
        maskImage:
          "radial-gradient(ellipse 70% 55% at 50% 32%, #000 30%, transparent 76%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 70% 55% at 50% 32%, #000 30%, transparent 76%)",
      }}
    />
  );
}

/** Section background tint + hairline divider (featured-projects pattern) */
export function SectionBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-b from-neutral-50/60 via-white/0 to-neutral-50/50" />
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-neutral-200 to-transparent" />
      <div className="absolute -top-8 left-1/2 h-56 w-176 max-w-[90vw] -translate-x-1/2 rounded-full bg-[#6c5ce7]/5 blur-3xl" />
    </div>
  );
}

export const SectionShell = forwardRef<
  HTMLElement,
  { id: string; children: React.ReactNode; className?: string }
>(function SectionShell({ id, children, className = "" }, ref) {
  return (
    <section
      ref={ref}
      id={id}
      className={`relative z-10 mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24 ${className}`}
    >
      {children}
    </section>
  );
});

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: React.ReactNode;
}) {
  return (
    <motion.header
      {...inViewProps}
      variants={sectionReveal}
      className="mb-10 text-center lg:mb-14"
    >
      <motion.div variants={fadeUpItem}>
        <Eyebrow className="justify-center">{eyebrow}</Eyebrow>
      </motion.div>
      <motion.h2
        variants={fadeUpItem}
        className="mt-4 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          variants={fadeUpItem}
          className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-neutral-600 sm:text-lg"
        >
          {subtitle}
        </motion.p>
      )}
    </motion.header>
  );
}

/** Shared card surface — aligned with featured project cards */
export const ABOUT_CARD =
  "rounded-2xl border border-neutral-200/80 bg-white shadow-[0_10px_40px_-24px_rgba(15,23,42,0.35)] transition-all duration-300";
