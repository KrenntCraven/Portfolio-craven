"use client";

import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import type { Document } from "@contentful/rich-text-types";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { ImpactStat, Project } from "../../../backend/types";
import { BannerBackground } from "../../../frontend/banner-background";
import { usePageTransition } from "../../../frontend/page-transition/page-transition";

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

const COLLAPSE_HEIGHT = 300; // px — content taller than this gets a read-more toggle

const PROSE_CLASS =
  "prose prose-neutral prose-lg max-w-none text-left sm:text-justify leading-[1.75] prose-headings:text-neutral-800 prose-headings:font-semibold prose-headings:tracking-tight prose-h2:text-2xl prose-h2:mb-4 prose-h3:text-xl prose-h3:mb-3 prose-p:text-neutral-600 prose-p:leading-[1.75] prose-p:mb-6 prose-strong:text-neutral-900 prose-strong:font-semibold prose-a:text-[#6c5ce7] prose-a:font-medium prose-a:no-underline hover:prose-a:underline prose-a:transition-all prose-ul:text-neutral-600 prose-ul:list-none prose-ul:pl-0 prose-ul:space-y-3 prose-ol:text-neutral-600 prose-ol:list-none prose-ol:pl-0 prose-ol:space-y-3 prose-li:pl-0 prose-li:relative prose-li:flex prose-li:items-start prose-li:gap-3 prose-li:before:content-[''] prose-li:before:mt-2.5 prose-li:before:h-1.5 prose-li:before:w-1.5 prose-li:before:flex-shrink-0 prose-li:before:rounded-full prose-li:before:bg-[#6c5ce7]";

function ImpactStatCards({ stats }: { stats: ImpactStat[] }) {
  if (!stats.length) return null;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-8">
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.08 }}
          className="rounded-xl border border-[#6c5ce7]/20 bg-linear-to-br from-[#6c5ce7]/5 to-white p-4 sm:p-5 text-center"
        >
          <p className="text-2xl sm:text-3xl font-bold text-[#6c5ce7] tracking-tight leading-none mb-1">
            {stat.value}
          </p>
          <p className="text-xs sm:text-sm font-semibold text-neutral-700 uppercase tracking-wider">
            {stat.label}
          </p>
          {stat.description && (
            <p className="mt-1.5 text-xs text-neutral-500 leading-snug">
              {stat.description}
            </p>
          )}
        </motion.div>
      ))}
    </div>
  );
}

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
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-white to-transparent pointer-events-none" />
      )}

      {needsCollapse && (
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="inline-flex items-center gap-2 rounded-xl border border-[#6c5ce7]/30 bg-[#6c5ce7]/5 px-5 py-2.5 text-sm font-semibold text-[#6c5ce7] transition-all hover:bg-[#6c5ce7]/10 hover:border-[#6c5ce7]/50"
          >
            {expanded ? (
              <>
                Show less
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </>
            ) : (
              <>
                Read more
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

function CaseStudySection({
  id,
  label,
  children,
  stats,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
  index: number;
  stats?: ImpactStat[];
}) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5 }}
      className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16"
    >
      <div className="mx-auto max-w-3xl w-full">
        {label && (
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-1 w-12 rounded-full bg-linear-to-r from-[#6c5ce7] to-[#a29bfe]" />
              <span className="text-sm font-semibold uppercase tracking-wider text-[#6c5ce7]">
                {label}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-neutral-800 sm:text-3xl lg:text-4xl tracking-tight">
              {label}
            </h2>
          </div>
        )}

        {stats && stats.length > 0 && <ImpactStatCards stats={stats} />}

        <div className="relative rounded-2xl bg-white border border-neutral-200/50 p-6 sm:p-8 lg:p-10 shadow-sm">
          <CollapsibleContent>
            <div className={PROSE_CLASS}>{children}</div>
          </CollapsibleContent>
        </div>
      </div>
    </motion.section>
  );
}

export default function CaseStudyPageClient({ project }: { project: Project }) {
  const slug = project.slug;
  const { startTransition } = usePageTransition();
  const [showScrollTop, setShowScrollTop] = useState(false);

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

  return (
    <main className="relative min-h-screen overflow-x-clip bg-white text-neutral-800">
      <BannerBackground />

      {/* Back button */}
      <div className="relative z-20 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <button
            type="button"
            onClick={() => startTransition(`/projects/${slug}`)}
            className="group inline-flex w-full items-center justify-center gap-3 rounded-xl border border-neutral-300 bg-white/80 px-4 py-2.5 text-sm font-semibold text-neutral-800 shadow-sm backdrop-blur transition-all hover:-translate-y-0.5 hover:border-[#6c5ce7]/40 hover:bg-[#6c5ce7]/5 hover:shadow-md active:translate-y-0 sm:w-auto sm:text-base sm:px-5 sm:py-3"
          >
            <svg
              className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 transition-transform group-hover:-translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to project
          </button>
        </motion.div>
      </div>

      {/* Hero section */}
      <section
        id="hero-section"
        className="relative z-10 mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:pt-20 lg:pb-12"
      >
        <div className="mx-auto max-w-3xl w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6 flex items-center gap-3"
          >
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[#6c5ce7]" />
              <div className="h-2 w-2 rounded-full bg-[#6c5ce7]/60" />
              <div className="h-2 w-2 rounded-full bg-[#6c5ce7]/30" />
            </div>
            <span className="text-sm font-semibold uppercase tracking-wider text-[#6c5ce7]">
              Case Study
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl font-bold tracking-tight text-neutral-800 sm:text-5xl lg:text-6xl mb-6"
          >
            {project.title}
          </motion.h1>

          {/* Section nav pills */}
          {labeledSections.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-wrap gap-2 mb-6"
            >
              {labeledSections.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() =>
                    document
                      .getElementById(s.id)
                      ?.scrollIntoView({ behavior: "smooth", block: "start" })
                  }
                  className="rounded-full border border-neutral-200 bg-white/80 px-3.5 py-1.5 text-xs font-semibold text-neutral-600 shadow-sm backdrop-blur transition-all hover:border-[#6c5ce7]/40 hover:bg-[#6c5ce7]/5 hover:text-[#6c5ce7]"
                >
                  {s.label}
                </button>
              ))}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-2 h-px w-full bg-linear-to-r from-transparent via-neutral-300 to-transparent"
          />
        </div>
      </section>

      {/* Content sections */}
      {sectionsToRender.map(({ id, field, label }, index) => (
        <CaseStudySection
          key={id}
          id={id}
          label={label}
          index={index}
          stats={id === "impact-outcome-case-study" ? project.impactStats : undefined}
        >
          {documentToReactComponents(project[field] as Document)}
        </CaseStudySection>
      ))}

      {/* Bottom CTA */}
      <motion.section
        id="cta-section"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8 flex items-center"
      >
        <div className="mx-auto max-w-3xl w-full">
          <div className="relative">
            <div className="absolute -inset-4 sm:-inset-6 rounded-2xl bg-linear-to-br from-white via-neutral-50/50 to-white opacity-60 blur-xl" />
            <div className="relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm border border-neutral-200/50 p-8 sm:p-12 shadow-sm text-center">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(108,92,231,0.06),transparent_60%)]" />
              <div className="relative z-10">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="h-1 w-10 rounded-full bg-linear-to-r from-[#6c5ce7] to-[#a29bfe]" />
                  <span className="text-sm font-semibold uppercase tracking-wider text-[#6c5ce7]">
                    Like what you see?
                  </span>
                  <div className="h-1 w-10 rounded-full bg-linear-to-r from-[#a29bfe] to-[#6c5ce7]" />
                </div>
                <h3 className="text-2xl font-bold text-neutral-800 sm:text-3xl mb-4 tracking-tight">
                  Interested in this project?
                </h3>
                <p className="text-neutral-500 mb-8 max-w-xl mx-auto leading-relaxed">
                  Let&apos;s discuss how we can work together on your next
                  project
                </p>
                <button
                  type="button"
                  onClick={() => startTransition(`/projects/${slug}`)}
                  className="inline-flex items-center gap-2 rounded-xl border border-[#6c5ce7]/30 bg-[#6c5ce7]/5 px-6 py-3 text-base font-semibold text-[#6c5ce7] shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#6c5ce7]/50 hover:bg-[#6c5ce7]/10 hover:shadow-md active:translate-y-0"
                >
                  View full project
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </button>
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
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 right-4 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-neutral-200 bg-white/90 shadow-lg backdrop-blur-sm transition-colors hover:bg-[#6c5ce7]/10 hover:border-[#6c5ce7]/40 sm:hidden"
            aria-label="Scroll to top"
          >
            <svg className="h-5 w-5 text-[#6c5ce7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </main>
  );
}
