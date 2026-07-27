"use client";

import { MotionConfig, motion } from "framer-motion";
import Link from "next/link";
import { BannerBackground } from "../frontend/banner-background";
import ProjectCard from "../frontend/project-card";
import {
  Eyebrow,
  FOCUS_RING,
  fadeUpItem,
  heroStagger,
} from "../frontend/project-ui";
import type { ProjectSummary } from "./projects-catalog";

// Stagger container for the card grid — children (ProjectCard) inherit the
// enter animation via their own `variants`, keeping motion consistent with the
// rest of the site while entering only once, on scroll into view.
const gridStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

export default function ProjectsPageClient({
  projects,
}: {
  projects: ProjectSummary[];
}) {
  const hasProjects = projects.length > 0;

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen overflow-visible bg-white pb-24 text-neutral-900">
        <BannerBackground />

        {/* Section background treatment — matches the home Spotlight surface */}
        <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute inset-0 bg-linear-to-b from-neutral-50/80 via-white/0 to-neutral-50/60" />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(108,92,231,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(108,92,231,0.05) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
              maskImage:
                "radial-gradient(ellipse 80% 55% at 50% 18%, #000 30%, transparent 80%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 80% 55% at 50% 18%, #000 30%, transparent 80%)",
            }}
          />
          <div className="absolute -top-8 left-1/2 h-72 w-176 max-w-[90vw] -translate-x-1/2 rounded-full bg-[#6c5ce7]/6 blur-3xl" />
        </div>

        <section className="relative z-10 mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 sm:pb-24 sm:pt-32 lg:px-8 lg:pb-28 lg:pt-36">
          <motion.div
            variants={heroStagger}
            initial="hidden"
            animate="show"
            className="mx-auto max-w-3xl text-center"
          >
            <motion.div variants={fadeUpItem}>
              <Eyebrow className="justify-center">Projects</Eyebrow>
            </motion.div>

            <motion.h1
              variants={fadeUpItem}
              className="mt-6 text-4xl font-semibold tracking-tight text-neutral-800 sm:text-5xl"
            >
              Things I&apos;ve been building
            </motion.h1>

            <motion.p
              variants={fadeUpItem}
              className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-neutral-600 sm:text-lg"
            >
              A growing collection of projects — from production systems to
              experiments — focused on real-world problems and scalable
              solutions.
            </motion.p>
          </motion.div>

          {hasProjects ? (
            <motion.ul
              variants={gridStagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.15 }}
              className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-10"
            >
              {/* `ProjectSummary` is shaped for this card, so it maps straight
                  through — the catalog decides content and order, not the view. */}
              {projects.map(({ slug, ...card }, index) => (
                <li key={slug} className="flex">
                  <ProjectCard
                    {...card}
                    className="w-full"
                    priority={index === 0}
                  />
                </li>
              ))}
            </motion.ul>
          ) : (
            <div className="mt-16 text-center">
              <p className="text-base text-neutral-600">
                New projects are on the way. In the meantime, explore the
                spotlight work on the home page.
              </p>
              <Link
                href="/#spotlight"
                className={`mt-6 inline-flex items-center justify-center rounded-xl bg-neutral-900 px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_40px_-16px_rgba(0,0,0,0.55)] transition-colors hover:bg-neutral-800 ${FOCUS_RING}`}
              >
                View spotlight work
              </Link>
            </div>
          )}
        </section>
      </div>
    </MotionConfig>
  );
}
