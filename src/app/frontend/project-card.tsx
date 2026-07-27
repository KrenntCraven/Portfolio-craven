"use client";

/**
 * ProjectCard — a reusable, presentational project tile.
 *
 * Deliberately free of project-specific logic: it takes plain data and renders
 * it, so any surface (the /projects grid today, more grids later) can drop it in.
 * Shares the accent motif, motion language, focus states and icons with the rest
 * of the project pages via `project-ui`.
 *
 * Entrance animation is driven by the parent's stagger container — this element
 * only declares `variants`, so it inherits `initial`/`animate` from above.
 */
import { motion } from "framer-motion";
import Image from "next/image";
import type { ProjectStatus } from "../backend/types";
import { usePageTransition } from "./page-transition/page-transition";
import {
  ArrowRightIcon,
  BookIcon,
  ExternalIcon,
  FOCUS_RING,
  GithubIcon,
  fadeUpItem,
} from "./project-ui";

export type { ProjectStatus } from "../backend/types";

export type ProjectCardData = {
  /** Stable id used as the React key + to build unique element ids. */
  id: string;
  title: string;
  description: string;
  technologies: string[];
  /** Optional featured image (public path or absolute URL). */
  image?: string;
  /** Metadata label, e.g. "Full-Stack" or "AI / Automation". */
  category?: string;
  status?: ProjectStatus;
  github?: string;
  liveDemo?: string;
  /** Optional case-study link (internal route or external URL). */
  caseStudy?: string;
  /** Optional highlight badge. */
  featured?: boolean;
  /**
   * Optional detail-page route (e.g. `/projects/<slug>`). When set, the whole
   * card links here and shows a "View project" CTA; internal routes navigate
   * with the site's page-transition animation.
   */
  href?: string;
};

export type ProjectCardProps = ProjectCardData & {
  className?: string;
  /** Eager-load the cover (use for above-the-fold cards). */
  priority?: boolean;
};

// Max technology chips before collapsing the remainder into a "+N more".
const MAX_TECH = 4;

const STATUS_STYLES: Record<ProjectStatus, { dot: string; badge: string }> = {
  Completed: {
    dot: "bg-emerald-500",
    badge: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  },
  "In Progress": {
    dot: "bg-amber-500",
    badge: "bg-amber-50 text-amber-700 ring-amber-600/20",
  },
  Archived: {
    dot: "bg-neutral-400",
    badge: "bg-neutral-100 text-neutral-600 ring-neutral-500/20",
  },
};

const isExternal = (href: string) => /^https?:\/\//i.test(href);

function ProjectLink({
  href,
  label,
  ariaLabel,
  icon,
  variant = "secondary",
}: {
  href: string;
  label: string;
  ariaLabel: string;
  icon: React.ReactNode;
  variant?: "primary" | "secondary";
}) {
  const external = isExternal(href);
  const base =
    "group/link inline-flex touch-manipulation items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors sm:text-sm";
  const styles =
    variant === "primary"
      ? "border border-neutral-800 bg-neutral-900 text-white hover:bg-neutral-800"
      : "border border-neutral-300 bg-white/80 text-neutral-800 hover:border-[#6c5ce7]/40 hover:bg-[#6c5ce7]/5";
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      {...(external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      className={`${base} ${styles} ${FOCUS_RING}`}
    >
      {icon}
      {label}
    </a>
  );
}

export default function ProjectCard({
  id,
  title,
  description,
  technologies,
  image,
  category,
  status,
  github,
  liveDemo,
  caseStudy,
  featured,
  href,
  className,
  priority = false,
}: ProjectCardProps) {
  const { startTransition } = usePageTransition();
  const titleId = `project-${id}-title`;
  const descId = `project-${id}-desc`;
  const visibleTech = technologies.slice(0, MAX_TECH);
  const hiddenTech = technologies.length - visibleTech.length;
  const statusStyle = status ? STATUS_STYLES[status] : null;
  const hasButtons = Boolean(github || liveDemo || caseStudy);
  // The whole card links to its destination: an explicit detail-page `href`
  // when given, otherwise the best available link. Action buttons (when shown)
  // sit above this overlay (relative z-index) so they stay independently
  // clickable.
  const primaryHref = href || caseStudy || liveDemo || github;
  const primaryIsInternal = primaryHref?.startsWith("/") ?? false;

  return (
    <motion.article
      variants={fadeUpItem}
      whileHover={{ y: -6 }}
      aria-labelledby={titleId}
      aria-describedby={descId}
      className={`group relative flex flex-col overflow-hidden rounded-3xl border border-neutral-200/80 bg-white shadow-[0_10px_40px_-24px_rgba(15,23,42,0.35)] transition-all duration-300 hover:border-[#6c5ce7]/30 hover:shadow-[0_28px_70px_-32px_rgba(108,92,231,0.35)] ${
        className ?? ""
      }`}
    >
      {/* Whole-card link (stretched over the card); action buttons override it. */}
      {primaryHref && (
        <a
          href={primaryHref}
          aria-label={`View ${title}`}
          onClick={
            primaryIsInternal
              ? (e) => {
                  e.preventDefault();
                  startTransition(primaryHref);
                }
              : undefined
          }
          {...(isExternal(primaryHref)
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
          className={`absolute inset-0 z-20 rounded-3xl ${FOCUS_RING}`}
        />
      )}

      {/* Media */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-linear-to-br from-neutral-100 via-neutral-50 to-white">
        {/* Top-left badges: spotlight (optional) + category */}
        <div className="pointer-events-none absolute left-4 top-4 z-30 flex flex-col items-start gap-2">
          {featured && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-linear-to-r from-[#6c5ce7] to-[#a29bfe] px-3 py-1 text-xs font-semibold text-white shadow-sm">
              <svg
                className="h-3 w-3"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden
              >
                <path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.79L10 14.77l-5.2 2.73.99-5.79-4.21-4.1 5.82-.85L10 1.5z" />
              </svg>
              Spotlight
            </span>
          )}
          {category && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#6c5ce7] shadow-sm backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-[#6c5ce7]" />
              {category}
            </span>
          )}
        </div>

        {/* Top-right: status */}
        {status && statusStyle && (
          <span
            className={`pointer-events-none absolute right-4 top-4 z-30 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold shadow-sm ring-1 ring-inset backdrop-blur ${statusStyle.badge}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`} />
            {status}
          </span>
        )}

        {image ? (
          <>
            <Image
              src={image}
              alt={`${title} preview`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              quality={75}
              priority={priority}
              loading={priority ? undefined : "lazy"}
            />
            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent" />
          </>
        ) : (
          <div className="flex h-full items-center justify-center">
            <div
              aria-hidden
              className="flex h-20 w-20 items-center justify-center rounded-2xl border border-neutral-200 bg-white text-3xl font-bold text-neutral-700 shadow-lg transition-transform duration-500 ease-out group-hover:scale-105"
            >
              {title.trim().charAt(0).toUpperCase() || "P"}
            </div>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-4 p-6 sm:p-7">
        <h3
          id={titleId}
          className="line-clamp-2 text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl"
        >
          {title}
        </h3>

        <p
          id={descId}
          className="line-clamp-2 text-sm leading-relaxed text-neutral-600 sm:text-base"
        >
          {description}
        </p>

        {visibleTech.length > 0 && (
          <ul className="flex flex-wrap items-center gap-2" aria-label="Technologies">
            {visibleTech.map((tech) => (
              <li
                key={tech}
                className="rounded-full border border-neutral-200/70 bg-neutral-50 px-2.5 py-1 text-xs font-medium text-neutral-600"
              >
                {tech}
              </li>
            ))}
            {hiddenTech > 0 && (
              <li className="text-xs font-medium text-neutral-400">
                +{hiddenTech} more
              </li>
            )}
          </ul>
        )}

        {hasButtons && (
          <div className="relative z-30 mt-auto flex flex-wrap items-center gap-2 pt-1">
            {caseStudy && (
              <ProjectLink
                href={caseStudy}
                label="Case Study"
                ariaLabel={`Read the case study for ${title}`}
                variant="primary"
                icon={<BookIcon className="h-4 w-4 shrink-0" />}
              />
            )}
            {liveDemo && (
              <ProjectLink
                href={liveDemo}
                label="Live Demo"
                ariaLabel={`Open the live demo of ${title}`}
                icon={<ExternalIcon className="h-4 w-4 shrink-0" />}
              />
            )}
            {github && (
              <ProjectLink
                href={github}
                label="GitHub"
                ariaLabel={`View the source code for ${title} on GitHub`}
                icon={<GithubIcon className="h-4 w-4 shrink-0" />}
              />
            )}
          </div>
        )}

        {!hasButtons && primaryHref && (
          <div className="mt-auto flex items-center gap-1.5 pt-1 text-sm font-semibold text-[#6c5ce7]">
            View project
            <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        )}

        {!hasButtons && !primaryHref && (
          <div className="mt-auto flex items-center gap-1.5 pt-1 text-sm font-semibold text-neutral-400">
            Coming soon
            <ArrowRightIcon className="h-4 w-4" />
          </div>
        )}
      </div>
    </motion.article>
  );
}
