"use client";

/**
 * ProjectHero — the large, editorial article header: back link, category
 * eyebrow, title, lead, meta row (status / timeline / role), primary actions,
 * a quick tech glance, and an impactful cover image. Client Component (entrance
 * animation + page-transition navigation + scroll reset).
 */
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect } from "react";
import type { Project } from "../../../backend/types";
import { usePageTransition } from "../../../frontend/page-transition/page-transition";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BookIcon,
  ClockIcon,
  EASE,
  Eyebrow,
  ExternalIcon,
  FOCUS_RING,
  GithubIcon,
  fadeUpItem,
  heroStagger,
} from "../../../frontend/project-ui";
import { StatusBadge } from "./status-badge";

const HERO_TECH_LIMIT = 6;

export function ProjectHero({ project }: { project: Project }) {
  const { startTransition } = usePageTransition();
  const slug = project.slug;
  const category = project.projectType?.[0];
  // Prefer the authentic hero screenshot; the composed cover (coverPageUrl) is
  // reserved for the card/OG identity and is only a fallback here.
  const cover = project.imageUrl || project.coverPageUrl;
  const banner = project.bannerImage;
  const technologies = (project.technologies ?? []).slice(0, HERO_TECH_LIMIT);

  // Reset scroll when navigating between project pages.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  return (
    <header className="relative z-10">
      <nav
        aria-label="Breadcrumb"
        className="mx-auto max-w-3xl px-4 pt-24 sm:px-6 sm:pt-28 lg:pt-32"
      >
        <motion.button
          type="button"
          onClick={() => startTransition("/projects")}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          whileTap={{ scale: 0.97 }}
          className={`group inline-flex items-center gap-2 rounded-lg text-sm font-semibold text-neutral-500 transition-colors hover:text-[#6c5ce7] ${FOCUS_RING}`}
        >
          <ArrowLeftIcon className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
          Back to projects
        </motion.button>
      </nav>

      <motion.div
        variants={heroStagger}
        initial="hidden"
        animate="show"
        className="mx-auto max-w-3xl px-4 pt-8 sm:px-6 sm:pt-10"
      >
        {category && (
          <motion.div variants={fadeUpItem}>
            <Eyebrow>{category}</Eyebrow>
          </motion.div>
        )}

        <motion.h1
          variants={fadeUpItem}
          className="mt-5 text-4xl font-bold tracking-tight text-neutral-800 sm:text-5xl lg:text-6xl lg:leading-[1.05]"
        >
          {project.title}
        </motion.h1>

        {project.headline && (
          <motion.p
            variants={fadeUpItem}
            className="mt-5 text-lg leading-relaxed text-neutral-600 sm:text-xl sm:leading-relaxed"
          >
            {project.headline}
          </motion.p>
        )}

        {(project.status || project.timeline || project.role) && (
          <motion.div
            variants={fadeUpItem}
            className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-neutral-500"
          >
            {project.status && <StatusBadge status={project.status} />}
            {project.timeline && (
              <span className="inline-flex items-center gap-1.5">
                <ClockIcon className="h-4 w-4 text-[#6c5ce7]" />
                {project.timeline}
              </span>
            )}
            {project.role && (
              <>
                {(project.status || project.timeline) && (
                  <span aria-hidden className="text-neutral-300">
                    •
                  </span>
                )}
                <span>{project.role}</span>
              </>
            )}
          </motion.div>
        )}

        <motion.div
          variants={fadeUpItem}
          className="mt-8 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:gap-3"
        >
          {project.caseStudy && (
            <motion.button
              type="button"
              onClick={() => startTransition(`/projects/${slug}/casestudy`)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={`group inline-flex touch-manipulation items-center justify-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_-12px_rgba(15,23,42,0.5)] transition-colors hover:bg-neutral-800 sm:text-base ${FOCUS_RING}`}
            >
              <BookIcon className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
              Read Case Study
              <ArrowRightIcon className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
            </motion.button>
          )}
          {project.siteLink && (
            <motion.a
              href={project.siteLink}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={`group inline-flex touch-manipulation items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white/80 px-5 py-2.5 text-sm font-semibold text-neutral-800 shadow-sm backdrop-blur transition-colors hover:border-[#6c5ce7]/40 hover:bg-[#6c5ce7]/5 sm:text-base ${FOCUS_RING}`}
            >
              <ExternalIcon className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
              Live Demo
            </motion.a>
          )}
          {project.githubLink && (
            <motion.a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={`group inline-flex touch-manipulation items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white/80 px-5 py-2.5 text-sm font-semibold text-neutral-800 shadow-sm backdrop-blur transition-colors hover:border-[#6c5ce7]/40 hover:bg-[#6c5ce7]/5 sm:text-base ${FOCUS_RING}`}
            >
              <GithubIcon className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
              View Source
            </motion.a>
          )}
        </motion.div>

        {technologies.length > 0 && (
          <motion.ul
            variants={fadeUpItem}
            aria-label="Technologies"
            className="mt-8 flex flex-wrap gap-2"
          >
            {technologies.map((tech) => (
              <li
                key={tech}
                className="rounded-full border border-neutral-200/70 bg-neutral-50 px-3 py-1 text-xs font-medium text-neutral-600"
              >
                {tech}
              </li>
            ))}
          </motion.ul>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.7, ease: EASE }}
        className={`mx-auto mt-12 px-4 sm:mt-16 sm:px-6 ${
          banner ? "max-w-4xl" : "max-w-5xl"
        }`}
      >
        {banner ? (
          <div className="relative aspect-4/3 w-full overflow-hidden rounded-3xl bg-white shadow-[0_30px_80px_-40px_rgba(15,23,42,0.45)]">
            <Image
              src={banner}
              alt={`${project.title} banner`}
              fill
              priority
              sizes="(max-width: 896px) 100vw, 896px"
              quality={80}
              className="object-cover"
            />
          </div>
        ) : cover ? (
          <div className="relative aspect-16/9 w-full overflow-hidden rounded-3xl border border-neutral-200/70 bg-neutral-100 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.45)]">
            <Image
              src={cover}
              alt={`${project.title} cover`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="relative flex aspect-16/9 w-full items-center justify-center overflow-hidden rounded-3xl border border-neutral-200/70 bg-linear-to-br from-[#6c5ce7]/10 via-neutral-50 to-white shadow-[0_30px_80px_-40px_rgba(15,23,42,0.35)]">
            <div className="text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-neutral-200 bg-white text-4xl font-bold text-neutral-700 shadow-lg sm:h-24 sm:w-24 sm:text-5xl">
                {project.title.charAt(0).toUpperCase()}
              </div>
              {category && (
                <p className="mt-4 text-sm font-semibold uppercase tracking-wider text-[#6c5ce7]">
                  {category}
                </p>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </header>
  );
}
