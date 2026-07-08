"use client";

import {
  documentToReactComponents,
  type Options,
} from "@contentful/rich-text-react-renderer";
import { MARKS, type Document } from "@contentful/rich-text-types";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { ImpactStat, Project } from "../../../backend/types";
import { BannerBackground } from "../../../frontend/banner-background";
import { usePageTransition } from "../../../frontend/page-transition/page-transition";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  ChevronDownIcon,
  ClockIcon,
  EASE,
  Eyebrow,
  FOCUS_RING,
  fadeUpItem,
  heroStagger,
  inViewProps,
  sectionReveal,
} from "../../../frontend/project-ui";

const SECTION_CONFIG: { id: string; field: keyof Project; label: string }[] = [
  { id: "case-study-content", field: "caseStudy", label: "" },
  { id: "problem-case-study", field: "problemCaseStudy", label: "Problem" },
  { id: "solution-case-study", field: "solutionCaseStudy", label: "Solution" },
  {
    id: "technical-case-study",
    field: "technicalCaseStudy",
    label: "Technical approach",
  },
  {
    id: "impact-outcome-case-study",
    field: "impactOutcomeCaseStudy",
    label: "Impact & outcome",
  },
  {
    id: "challenges-learnings-case-study",
    field: "challengesLearningsCaseStudy",
    label: "Challenges & learnings",
  },
];

// Contentful's default renderer emits bold as a bare <b> tag, which the
// prose-strong:* utilities (they target <strong>) never style. Render marks
// explicitly so bold/italic/underline are styled regardless of prose.
const RICH_TEXT_OPTIONS: Options = {
  renderMark: {
    [MARKS.BOLD]: (text) => (
      <strong className="font-bold text-neutral-900">{text}</strong>
    ),
    [MARKS.ITALIC]: (text) => <em className="italic">{text}</em>,
    [MARKS.UNDERLINE]: (text) => <u className="underline">{text}</u>,
    [MARKS.CODE]: (text) => (
      <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-[0.9em] text-neutral-800">
        {text}
      </code>
    ),
  },
  // Preserve soft line breaks (Shift+Enter in Contentful, stored as "\n").
  // Without this the renderer drops them and HTML collapses the newline.
  renderText: (text) =>
    text
      .split("\n")
      .flatMap((segment, i) => (i === 0 ? [segment] : [<br key={i} />, segment])),
};

const COLLAPSE_HEIGHT = 300; // px — content taller than this gets a read-more toggle

const PROSE_CLASS =
  "prose prose-neutral prose-lg max-w-none text-left sm:text-justify leading-[1.75] prose-headings:text-neutral-800 prose-headings:font-semibold prose-headings:tracking-tight prose-h2:text-2xl prose-h2:mb-4 prose-h3:text-xl prose-h3:mb-3 prose-p:text-neutral-600 prose-p:leading-[1.75] prose-p:mb-6 prose-strong:text-neutral-900 prose-strong:font-bold prose-a:text-[#6c5ce7] prose-a:font-medium prose-a:no-underline hover:prose-a:underline prose-a:transition-all prose-ul:text-neutral-600 prose-ul:list-none prose-ul:pl-0 prose-ul:space-y-3 prose-ol:text-neutral-600 prose-ol:list-none prose-ol:pl-0 prose-ol:space-y-3 prose-li:pl-0 prose-li:relative prose-li:flex prose-li:items-start prose-li:gap-3 prose-li:before:content-[''] prose-li:before:mt-2.5 prose-li:before:h-1.5 prose-li:before:w-1.5 prose-li:before:flex-shrink-0 prose-li:before:rounded-full prose-li:before:bg-[#6c5ce7]";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */
type RichNode = { value?: string; content?: RichNode[] };

function extractPlainText(node: RichNode | undefined): string {
  if (!node) return "";
  if (typeof node.value === "string") return node.value;
  if (Array.isArray(node.content))
    return node.content.map(extractPlainText).join(" ");
  return "";
}

function estimateReadingMinutes(docs: (Document | undefined)[]): number {
  const words = docs.reduce((total, doc) => {
    const text = extractPlainText(doc as unknown as RichNode);
    return total + text.split(/\s+/).filter(Boolean).length;
  }, 0);
  return Math.max(1, Math.round(words / 200));
}

// A short, one-line teaser for a chapter card, derived from its rich text.
function makeTeaser(doc: Document | undefined, max = 116): string {
  const text = extractPlainText(doc as unknown as RichNode)
    .replace(/\s+/g, " ")
    .trim();
  if (!text) return "";
  const end = text.search(/[.!?]\s/);
  let teaser = end > 40 && end < max ? text.slice(0, end + 1) : text;
  if (teaser.length > max) teaser = `${teaser.slice(0, max - 1).trimEnd()}…`;
  return teaser;
}

// Chapter cards slide in from the right, staggered by the rail container.
const cardSlideIn = {
  hidden: { opacity: 0, x: 32 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE } },
};

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 100;
  window.scrollTo({ top, behavior: "smooth" });
}

/* ------------------------------------------------------------------ */
/* Impact stats                                                        */
/* ------------------------------------------------------------------ */
function ImpactStatCards({ stats }: { stats: ImpactStat[] }) {
  if (!stats.length) return null;
  return (
    <motion.div
      variants={sectionReveal}
      className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4"
    >
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          variants={fadeUpItem}
          whileHover={{ y: -3 }}
          className="rounded-xl border border-[#6c5ce7]/20 bg-linear-to-br from-[#6c5ce7]/5 to-white p-4 text-center shadow-[0_10px_40px_-28px_rgba(108,92,231,0.4)] transition-shadow duration-300 hover:shadow-[0_20px_50px_-26px_rgba(108,92,231,0.35)] sm:p-5"
        >
          <p className="mb-1 text-2xl font-bold leading-none tracking-tight text-[#6c5ce7] sm:text-3xl">
            {stat.value}
          </p>
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-700 sm:text-sm">
            {stat.label}
          </p>
          {stat.description && (
            <p className="mt-1.5 text-xs leading-snug text-neutral-500">
              {stat.description}
            </p>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Collapsible long-form content                                       */
/* ------------------------------------------------------------------ */
function CollapsibleContent({ children }: { children: React.ReactNode }) {
  const [expanded, setExpanded] = useState(false);
  const [needsCollapse, setNeedsCollapse] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      setNeedsCollapse(contentRef.current.scrollHeight > COLLAPSE_HEIGHT + 40);
    }
  }, [children]);

  return (
    <div className="relative">
      <div
        ref={contentRef}
        className={[
          "transition-all duration-500",
          needsCollapse && !expanded ? "overflow-hidden" : "",
        ].join(" ")}
        {...(needsCollapse && !expanded
          ? { style: { maxHeight: COLLAPSE_HEIGHT } }
          : {})}
      >
        {children}
      </div>

      {needsCollapse && !expanded && (
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-white to-transparent" />
      )}

      {needsCollapse && (
        <div className="mt-4 flex justify-center">
          <motion.button
            type="button"
            onClick={() => setExpanded(!expanded)}
            whileTap={{ scale: 0.97 }}
            aria-expanded={expanded}
            className={`inline-flex items-center gap-2 rounded-xl border border-[#6c5ce7]/30 bg-[#6c5ce7]/5 px-5 py-2.5 text-sm font-semibold text-[#6c5ce7] transition-all hover:-translate-y-0.5 hover:border-[#6c5ce7]/50 hover:bg-[#6c5ce7]/10 ${FOCUS_RING}`}
          >
            {expanded ? "Show less" : "Read more"}
            <ChevronDownIcon
              className={`h-4 w-4 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
            />
          </motion.button>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* One content section                                                 */
/* ------------------------------------------------------------------ */
function CaseStudySection({
  id,
  label,
  children,
  stats,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
  stats?: ImpactStat[];
}) {
  return (
    <motion.section
      id={id}
      {...inViewProps}
      variants={sectionReveal}
      className="relative mx-auto max-w-6xl scroll-mt-28 px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16"
    >
      <div className="mx-auto w-full max-w-3xl">
        {label && (
          <motion.div variants={fadeUpItem} className="mb-6 space-y-3 sm:mb-8">
            <Eyebrow>{label}</Eyebrow>
            <h2 className="text-2xl font-bold tracking-tight text-neutral-800 sm:text-3xl lg:text-4xl">
              {label}
            </h2>
          </motion.div>
        )}

        {stats && stats.length > 0 && <ImpactStatCards stats={stats} />}

        <motion.div
          variants={fadeUpItem}
          className="relative rounded-2xl border border-neutral-200/60 bg-white/80 p-6 shadow-sm backdrop-blur-sm transition-shadow duration-300 hover:shadow-md sm:p-8 lg:p-10"
        >
          <CollapsibleContent>
            <div className={PROSE_CLASS}>{children}</div>
          </CollapsibleContent>
        </motion.div>
      </div>
    </motion.section>
  );
}

/* ------------------------------------------------------------------ */
/* Story map — horizontal snap-scrolling rail of chapter cards         */
/* ------------------------------------------------------------------ */
type Chapter = { id: string; label: string; teaser: string };

function StoryRail({
  chapters,
  activeId,
  onNavigate,
}: {
  chapters: Chapter[];
  activeId: string | null;
  onNavigate: (id: string) => void;
}) {
  const scrollerRef = useRef<HTMLOListElement>(null);

  const nudge = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = Math.max(el.clientWidth * 0.8, 280);
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  // Keep the active chapter card centered inside the rail as you read.
  // IMPORTANT: only scroll the rail horizontally — never call scrollIntoView,
  // which also scrolls the window vertically and yanks the page back up to the
  // (off-screen) rail on every active-section change, causing a "bouncy" loop.
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!activeId || !scroller) return;

    const card = scroller.querySelector<HTMLElement>(
      `[data-chapter="${activeId}"]`,
    );
    if (!card) return;

    // Skip work when the rail isn't on screen (no visual benefit).
    const scRect = scroller.getBoundingClientRect();
    if (scRect.bottom < 0 || scRect.top > window.innerHeight) return;

    const cardRect = card.getBoundingClientRect();
    const delta =
      cardRect.left -
      scRect.left -
      (scroller.clientWidth - card.clientWidth) / 2;
    const max = scroller.scrollWidth - scroller.clientWidth;
    const target = Math.max(0, Math.min(scroller.scrollLeft + delta, max));

    if (Math.abs(target - scroller.scrollLeft) > 2) {
      scroller.scrollTo({ left: target, behavior: "smooth" });
    }
  }, [activeId]);

  return (
    <motion.section
      {...inViewProps}
      variants={sectionReveal}
      aria-label="Case study chapters"
      className="relative z-10 mx-auto max-w-6xl px-4 pb-2 pt-2 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-3xl lg:max-w-none">
        <motion.div
          variants={fadeUpItem}
          className="mb-4 flex items-center justify-between gap-4"
        >
          <Eyebrow>The story</Eyebrow>
          <div className="hidden gap-2 sm:flex">
            <motion.button
              type="button"
              onClick={() => nudge(-1)}
              whileTap={{ scale: 0.9 }}
              aria-label="Previous chapters"
              className={`flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white/80 text-neutral-600 shadow-sm backdrop-blur transition-colors hover:border-[#6c5ce7]/40 hover:text-[#6c5ce7] ${FOCUS_RING}`}
            >
              <ArrowLeftIcon className="h-4 w-4" />
            </motion.button>
            <motion.button
              type="button"
              onClick={() => nudge(1)}
              whileTap={{ scale: 0.9 }}
              aria-label="Next chapters"
              className={`flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white/80 text-neutral-600 shadow-sm backdrop-blur transition-colors hover:border-[#6c5ce7]/40 hover:text-[#6c5ce7] ${FOCUS_RING}`}
            >
              <ArrowRightIcon className="h-4 w-4" />
            </motion.button>
          </div>
        </motion.div>

        <div className="relative">
          {/* Edge fades hint at more content off-canvas */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-6 bg-linear-to-r from-white to-transparent sm:w-10"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-6 bg-linear-to-l from-white to-transparent sm:w-10"
          />

          <motion.ol
            ref={scrollerRef}
            variants={heroStagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-0.5 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {chapters.map((c, i) => {
              const isActive = activeId === c.id;
              const num = String(i + 1).padStart(2, "0");
              return (
                <motion.li
                  key={c.id}
                  variants={cardSlideIn}
                  className="w-[78%] shrink-0 snap-start sm:w-64 lg:w-72"
                >
                  <motion.button
                    type="button"
                    data-chapter={c.id}
                    onClick={() => onNavigate(c.id)}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    aria-current={isActive ? "true" : undefined}
                    className={`group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border p-5 text-left shadow-sm backdrop-blur transition-colors ${FOCUS_RING} ${
                      isActive
                        ? "border-[#6c5ce7]/50 bg-[#6c5ce7]/6"
                        : "border-neutral-200/70 bg-white/80 hover:border-[#6c5ce7]/40 hover:bg-[#6c5ce7]/3"
                    }`}
                  >
                    <span
                      aria-hidden
                      className="pointer-events-none absolute -right-1 -top-3 text-6xl font-bold leading-none tabular-nums text-[#6c5ce7]/10"
                    >
                      {num}
                    </span>
                    <span className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#6c5ce7]">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-[#6c5ce7]" : "bg-[#6c5ce7]/50"}`}
                      />
                      Chapter {num}
                    </span>
                    <span className="mb-2 text-lg font-bold tracking-tight text-neutral-800">
                      {c.label}
                    </span>
                    {c.teaser && (
                      <span className="line-clamp-2 text-sm leading-relaxed text-neutral-500">
                        {c.teaser}
                      </span>
                    )}
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#6c5ce7] opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      Read
                      <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </span>
                    <span
                      aria-hidden
                      className={`absolute bottom-0 left-0 h-0.5 bg-linear-to-r from-[#6c5ce7] to-[#a29bfe] transition-all duration-500 ${isActive ? "w-full" : "w-0"}`}
                    />
                  </motion.button>
                </motion.li>
              );
            })}
          </motion.ol>
        </div>
      </div>
    </motion.section>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
export default function CaseStudyPageClient({ project }: { project: Project }) {
  const slug = project.slug;
  const { startTransition } = usePageTransition();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const t = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "instant" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 100);
    return () => clearTimeout(t);
  }, [slug]);

  // Show scroll-to-top button after scrolling down
  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const sectionsToRender = SECTION_CONFIG.filter(
    (s) => project[s.field] && typeof project[s.field] === "object",
  ) as { id: string; field: keyof Project; label: string }[];

  const labeledSections = sectionsToRender.filter((s) => s.label);

  const readingMinutes = estimateReadingMinutes(
    sectionsToRender.map((s) => project[s.field] as Document | undefined),
  );

  const chapters: Chapter[] = labeledSections.map((s) => ({
    id: s.id,
    label: s.label,
    teaser: makeTeaser(project[s.field] as Document | undefined),
  }));

  // Highlight the section currently in view for the nav pills.
  useEffect(() => {
    const els = labeledSections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 1] },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen overflow-x-clip bg-white text-neutral-800">
        <BannerBackground />

        {/* Back button */}
        <nav
          aria-label="Breadcrumb"
          className="relative z-20 mx-auto max-w-6xl px-4 pb-4 pt-20 sm:px-6 sm:pt-24 md:pt-28 lg:px-8 lg:pt-32"
        >
          <motion.button
            type="button"
            onClick={() => startTransition(`/projects/${slug}`)}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            whileTap={{ scale: 0.97 }}
            className={`group inline-flex w-full items-center justify-center gap-2.5 rounded-xl border border-neutral-300 bg-white/80 px-4 py-2.5 text-sm font-semibold text-neutral-800 shadow-sm backdrop-blur transition-all hover:-translate-y-0.5 hover:border-[#6c5ce7]/40 hover:bg-[#6c5ce7]/5 hover:text-neutral-900 hover:shadow-md active:translate-y-0 sm:w-auto sm:text-base ${FOCUS_RING}`}
          >
            <ArrowLeftIcon className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:-translate-x-1 sm:h-5 sm:w-5" />
            Back to project
          </motion.button>
        </nav>

        {/* Hero */}
        <header
          id="hero-section"
          className="relative z-10 mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:pb-12 lg:pt-20"
        >
          <motion.div
            variants={heroStagger}
            initial="hidden"
            animate="show"
            className="mx-auto w-full max-w-3xl"
          >
            {/* Case-study marker */}
            <motion.div
              variants={fadeUpItem}
              className="mb-6 flex items-center gap-3"
            >
              <span className="flex items-center gap-2" aria-hidden>
                <span className="h-2 w-2 rounded-full bg-[#6c5ce7]" />
                <span className="h-2 w-2 rounded-full bg-[#6c5ce7]/60" />
                <span className="h-2 w-2 rounded-full bg-[#6c5ce7]/30" />
              </span>
              <span className="text-sm font-semibold uppercase tracking-wider text-[#6c5ce7]">
                Case Study
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUpItem}
              className="mb-5 text-4xl font-bold tracking-tight text-neutral-800 sm:text-5xl lg:text-6xl lg:leading-[1.05]"
            >
              {project.title}
            </motion.h1>

            {project.headline && (
              <motion.p
                variants={fadeUpItem}
                className="mb-6 max-w-2xl text-lg leading-relaxed text-neutral-600 sm:text-xl"
              >
                {project.headline}
              </motion.p>
            )}

            {/* Meta row */}
            <motion.div
              variants={fadeUpItem}
              className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-neutral-500"
            >
              <span className="inline-flex items-center gap-1.5">
                <ClockIcon className="h-4 w-4 text-[#6c5ce7]" />
                {readingMinutes} min read
              </span>
              {labeledSections.length > 0 && (
                <>
                  <span aria-hidden className="text-neutral-300">
                    •
                  </span>
                  <span>
                    {labeledSections.length} section
                    {labeledSections.length > 1 ? "s" : ""}
                  </span>
                </>
              )}
            </motion.div>

            <motion.div
              variants={fadeUpItem}
              className="mt-2 h-px w-full bg-linear-to-r from-transparent via-neutral-300 to-transparent"
            />
          </motion.div>
        </header>

        {/* Story map — horizontal chapter rail */}
        {chapters.length > 1 && (
          <StoryRail
            chapters={chapters}
            activeId={activeId}
            onNavigate={scrollToId}
          />
        )}

        {/* Content sections */}
        <main>
          {sectionsToRender.map(({ id, field, label }) => (
            <CaseStudySection
              key={id}
              id={id}
              label={label}
              stats={
                id === "impact-outcome-case-study"
                  ? project.impactStats
                  : undefined
              }
            >
              {documentToReactComponents(
                project[field] as Document,
                RICH_TEXT_OPTIONS,
              )}
            </CaseStudySection>
          ))}
        </main>

        {/* Bottom CTA */}
        <motion.section
          id="cta-section"
          {...inViewProps}
          variants={sectionReveal}
          className="relative z-10 mx-auto flex max-w-6xl items-center px-4 py-24 sm:px-6 lg:px-8"
        >
          <div className="mx-auto w-full max-w-3xl">
            <div className="relative">
              <div
                aria-hidden
                className="absolute -inset-4 rounded-2xl bg-linear-to-br from-white via-neutral-50/50 to-white opacity-60 blur-xl sm:-inset-6"
              />
              <div className="relative overflow-hidden rounded-2xl border border-neutral-200/50 bg-white/80 p-8 text-center shadow-sm backdrop-blur-sm sm:p-12">
                <div
                  aria-hidden
                  className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(108,92,231,0.06),transparent_60%)]"
                />
                <div className="relative z-10">
                  <div className="mb-6 flex items-center justify-center gap-3">
                    <div className="h-1 w-10 rounded-full bg-linear-to-r from-[#6c5ce7] to-[#a29bfe]" />
                    <span className="text-sm font-semibold uppercase tracking-wider text-[#6c5ce7]">
                      Like what you see?
                    </span>
                    <div className="h-1 w-10 rounded-full bg-linear-to-r from-[#a29bfe] to-[#6c5ce7]" />
                  </div>
                  <h2 className="mb-4 text-2xl font-bold tracking-tight text-neutral-800 sm:text-3xl">
                    Interested in this project?
                  </h2>
                  <p className="mx-auto mb-8 max-w-xl leading-relaxed text-neutral-500">
                    Let&apos;s discuss how we can work together on your next
                    project
                  </p>
                  <motion.button
                    type="button"
                    onClick={() => startTransition(`/projects/${slug}`)}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`group inline-flex items-center gap-2 rounded-xl border border-[#6c5ce7]/30 bg-[#6c5ce7]/5 px-6 py-3 text-base font-semibold text-[#6c5ce7] shadow-sm transition-colors hover:border-[#6c5ce7]/50 hover:bg-[#6c5ce7]/10 ${FOCUS_RING}`}
                  >
                    View full project
                    <ArrowRightIcon className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Scroll to top – mobile only */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              key="scroll-top"
              type="button"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className={`fixed bottom-6 right-4 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-neutral-200 bg-white/90 shadow-lg backdrop-blur-sm transition-colors hover:border-[#6c5ce7]/40 hover:bg-[#6c5ce7]/10 sm:hidden ${FOCUS_RING}`}
              aria-label="Scroll to top"
            >
              <ArrowUpIcon className="h-5 w-5 text-[#6c5ce7]" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
