"use client";

/**
 * ProjectActions — closing CTA: case study / demo / source, plus a jump back
 * to the projects grid. No Contentful "more projects" list — keeps the detail
 * page lean and routes exploration through `/projects`.
 */
import { motion } from "framer-motion";
import type { Project } from "../../../backend/types";
import { usePageTransition } from "../../../frontend/page-transition/page-transition";
import {
  ArrowRightIcon,
  BookIcon,
  EASE,
  ExternalIcon,
  FOCUS_RING,
  GithubIcon,
} from "../../../frontend/project-ui";

export function ProjectActions({ project }: { project: Project }) {
  const { startTransition } = usePageTransition();

  return (
    <motion.section
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: EASE }}
      aria-labelledby="actions-heading"
      className="scroll-mt-28"
    >
      <div className="relative overflow-hidden rounded-3xl border border-neutral-200/60 bg-white/80 p-8 shadow-sm backdrop-blur-sm sm:p-12">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(108,92,231,0.08),transparent_55%)]"
        />
        <div className="relative z-10 mx-auto max-w-2xl text-center">
          <div className="mb-5 flex items-center justify-center gap-3">
            <span className="h-1 w-10 rounded-full bg-linear-to-r from-[#6c5ce7] to-[#a29bfe]" />
            <span className="text-sm font-semibold uppercase tracking-wider text-[#6c5ce7]">
              Keep exploring
            </span>
            <span className="h-1 w-10 rounded-full bg-linear-to-r from-[#a29bfe] to-[#6c5ce7]" />
          </div>
          <h2
            id="actions-heading"
            className="text-2xl font-bold tracking-tight text-neutral-800 sm:text-3xl"
          >
            Want to see more?
          </h2>
          <p className="mx-auto mt-3 max-w-xl leading-relaxed text-neutral-500">
            Head back to the projects section, or dive into the source for{" "}
            {project.title}.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-2.5 sm:flex-row sm:flex-wrap sm:gap-3">
            <motion.button
              type="button"
              onClick={() => startTransition("/projects")}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={`group inline-flex w-full touch-manipulation items-center justify-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900 px-6 py-3 text-base font-semibold text-white shadow-[0_14px_34px_-14px_rgba(15,23,42,0.55)] transition-colors hover:bg-neutral-800 sm:w-auto ${FOCUS_RING}`}
            >
              Browse projects
              <ArrowRightIcon className="h-5 w-5 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
            </motion.button>
            {project.caseStudy && (
              <motion.button
                type="button"
                onClick={() =>
                  startTransition(`/projects/${project.slug}/casestudy`)
                }
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`group inline-flex w-full touch-manipulation items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white/80 px-6 py-3 text-base font-semibold text-neutral-800 shadow-sm backdrop-blur transition-colors hover:border-[#6c5ce7]/40 hover:bg-[#6c5ce7]/5 sm:w-auto ${FOCUS_RING}`}
              >
                <BookIcon className="h-5 w-5 shrink-0" />
                Read Full Case Study
              </motion.button>
            )}
            {project.siteLink && (
              <motion.a
                href={project.siteLink}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`group inline-flex w-full touch-manipulation items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white/80 px-6 py-3 text-base font-semibold text-neutral-800 shadow-sm backdrop-blur transition-colors hover:border-[#6c5ce7]/40 hover:bg-[#6c5ce7]/5 sm:w-auto ${FOCUS_RING}`}
              >
                <ExternalIcon className="h-5 w-5 shrink-0" />
                Visit Live Demo
              </motion.a>
            )}
            {project.githubLink && (
              <motion.a
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`group inline-flex w-full touch-manipulation items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white/80 px-6 py-3 text-base font-semibold text-neutral-800 shadow-sm backdrop-blur transition-colors hover:border-[#6c5ce7]/40 hover:bg-[#6c5ce7]/5 sm:w-auto ${FOCUS_RING}`}
              >
                <GithubIcon className="h-5 w-5 shrink-0" />
                View Source Code
              </motion.a>
            )}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
