"use client";

import { MotionConfig, motion } from "framer-motion";
import Link from "next/link";
import {
  Eyebrow,
  FOCUS_RING,
  fadeUpItem,
  heroStagger,
} from "../frontend/project-ui";

export default function ProjectsPageClient() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-[70vh] bg-white pt-24 pb-20 text-neutral-900 sm:pt-28">
        <motion.div
          variants={heroStagger}
          initial="hidden"
          animate="show"
          className="mx-auto max-w-2xl px-4 text-center sm:px-6"
        >
          <motion.div variants={fadeUpItem}>
            <Eyebrow className="justify-center">Projects</Eyebrow>
          </motion.div>

          <motion.h1
            variants={fadeUpItem}
            className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl"
          >
            Coming soon
          </motion.h1>

          <motion.p
            variants={fadeUpItem}
            className="mt-4 text-base leading-relaxed text-neutral-600"
          >
            This page is being built. For now, explore featured work on the home
            page.
          </motion.p>

          <motion.div variants={fadeUpItem} className="mt-8">
            <Link
              href="/#projects"
              className={`inline-flex items-center justify-center rounded-xl bg-neutral-900 px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_40px_-16px_rgba(0,0,0,0.55)] transition-colors hover:bg-neutral-800 ${FOCUS_RING}`}
            >
              View featured work
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </MotionConfig>
  );
}
