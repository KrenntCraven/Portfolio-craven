"use client";

import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import type { Document } from "@contentful/rich-text-types";
import { animate, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BannerBackground } from "../../../frontend/banner-background";
import { usePageTransition } from "../../../frontend/page-transition/page-transition";
import type { Project } from "../../../backend/contentful_init";
import { getProjectBySlug } from "../../../backend/contentful_init";

type PageProps = { params: Promise<{ slug: string }> };

const SECTION_CONFIG: {
  id: string;
  field: keyof Project;
  label: string;
}[] = [
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

const PROSE_CLASS =
  "prose prose-neutral prose-lg max-w-none text-left sm:text-justify leading-[1.75] prose-headings:text-neutral-800 prose-headings:font-semibold prose-headings:tracking-tight prose-h2:text-2xl prose-h2:mb-4 prose-h3:text-xl prose-h3:mb-3 prose-p:text-neutral-600 prose-p:leading-[1.75] prose-p:mb-6 prose-strong:text-neutral-900 prose-strong:font-semibold prose-a:text-[#6c5ce7] prose-a:font-medium prose-a:no-underline hover:prose-a:underline prose-a:transition-all prose-ul:text-neutral-600 prose-ul:list-none prose-ul:pl-0 prose-ul:space-y-3 prose-ol:text-neutral-600 prose-ol:list-none prose-ol:pl-0 prose-ol:space-y-3 prose-li:pl-0 prose-li:relative prose-li:flex prose-li:items-start prose-li:gap-3 prose-li:before:content-[''] prose-li:before:mt-2.5 prose-li:before:h-1.5 prose-li:before:w-1.5 prose-li:before:flex-shrink-0 prose-li:before:rounded-full prose-li:before:bg-[#6c5ce7]";

function CaseStudySection({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
  index: number;
}) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16 min-h-screen md:min-h-[80vh] flex items-center"
    >
      <div className="mx-auto max-w-3xl w-full">
        {label && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8 sm:mb-10"
          >
            <div className="flex items-center gap-3 mb-4">
              <motion.div
                className="h-1 w-12 rounded-full bg-linear-to-r from-[#6c5ce7] to-[#a29bfe]"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              />
              <span className="text-sm font-semibold uppercase tracking-wider text-[#6c5ce7]">
                {label}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-neutral-800 sm:text-3xl lg:text-4xl tracking-tight">
              {label}
            </h2>
          </motion.div>
        )}
        <div className="relative">
          <div className="absolute -inset-4 sm:-inset-6 rounded-2xl bg-linear-to-br from-white via-neutral-50/50 to-white opacity-60 blur-xl" />
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative rounded-2xl bg-white/80 backdrop-blur-sm border border-neutral-200/50 p-6 sm:p-8 lg:p-10 shadow-sm"
          >
            <div className={PROSE_CLASS}>{children}</div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

export default function CaseStudyPage({ params }: PageProps) {
  const [project, setProject] = useState<Project | null>(null);
  const [slug, setSlug] = useState<string>("");
  const [isMobile, setIsMobile] = useState(false);
  const isSnappingRef = useRef(false);
  const { startTransition } = usePageTransition();

  const smoothScrollTo = (targetY: number) => {
    if (isSnappingRef.current) return;
    isSnappingRef.current = true;
    // Clamp so we never scroll past the bottom of the main content
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const clamped = Math.min(targetY, maxScroll);
    animate(window.scrollY, clamped, {
      duration: 0.8,
      ease: "easeInOut",
      onUpdate: (latest) => window.scrollTo(0, latest),
      onComplete: () => {
        isSnappingRef.current = false;
      },
    });
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const loadProject = async () => {
      const resolvedParams = await params;
      const resolvedSlug = resolvedParams.slug;
      setSlug(resolvedSlug);
      const projectData = await getProjectBySlug(resolvedSlug);
      setProject(projectData);
    };
    loadProject();
  }, [params]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const t = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "instant" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 100);
    return () => clearTimeout(t);
  }, [slug]);

  useEffect(() => {
    if (isMobile || !project) return;

    // Navbar height offset so sections land just below the nav
    const NAV_OFFSET = 80;

    const getSectionTops = () =>
      Array.from(document.querySelectorAll<HTMLElement>("section[id]"))
        .map((el) => {
          const rawTop = el.getBoundingClientRect().top + window.scrollY;
          // For the CTA section, clamp so it never pushes into the footer
          const maxScroll = document.body.scrollHeight - window.innerHeight;
          return Math.min(rawTop - NAV_OFFSET, maxScroll);
        })
        .sort((a, b) => a - b);

    const handleWheel = (e: WheelEvent) => {
      if (isSnappingRef.current) return;

      const tops = getSectionTops();
      if (!tops.length) return;

      const currentY = window.scrollY;
      const threshold = 60;

      if (e.deltaY > 0) {
        const next = tops.find((top) => top > currentY + threshold);
        if (next !== undefined) {
          e.preventDefault();
          smoothScrollTo(next);
        }
      } else if (e.deltaY < 0) {
        const prev = [...tops].reverse().find((top) => top < currentY - threshold);
        if (prev !== undefined) {
          e.preventDefault();
          smoothScrollTo(prev);
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [isMobile, project]);

  if (!project) {
    return (
      <main className="relative flex min-h-screen items-center justify-center bg-white text-neutral-800 pt-16 sm:pt-20 md:pt-24 lg:pt-28">
        <BannerBackground />
        <p className="relative z-10 text-neutral-500">Loading case study...</p>
      </main>
    );
  }

  const sectionsToRender = SECTION_CONFIG.filter(
    (s) => project[s.field] && typeof project[s.field] === "object",
  ) as { id: string; field: keyof Project; label: string }[];

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-white text-neutral-800">
      <BannerBackground />

      {/* Back button with enhanced styling */}
      <div className="relative z-20 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Link
            href={`/projects/${slug}`}
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
          </Link>
        </motion.div>
      </div>

      {/* Hero section */}
      <section id="hero-section" className="relative z-10 mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:pt-16 lg:pb-12 min-h-screen flex items-center">
        <div className="mx-auto max-w-3xl w-full">
          {/* Decorative element */}
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

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center gap-4 text-sm text-neutral-600"
          >
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-[#6c5ce7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="font-medium">In-depth analysis</span>
            </div>
            <div className="h-1 w-1 rounded-full bg-neutral-400" />
            <span>{sectionsToRender.length} sections</span>
          </motion.div>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 h-px w-full bg-linear-to-r from-transparent via-neutral-300 to-transparent"
          />
        </div>
      </section>

      {/* Content sections */}
      {sectionsToRender.map(({ id, field, label }, index) => (
        <CaseStudySection key={id} id={id} label={label} index={index}>
          {documentToReactComponents(project[field] as Document)}
        </CaseStudySection>
      ))}

      {/* Bottom CTA section */}
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
                  <motion.div
                    className="h-1 w-10 rounded-full bg-linear-to-r from-[#6c5ce7] to-[#a29bfe]"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  />
                  <span className="text-sm font-semibold uppercase tracking-wider text-[#6c5ce7]">
                    Like what you see?
                  </span>
                  <motion.div
                    className="h-1 w-10 rounded-full bg-linear-to-r from-[#a29bfe] to-[#6c5ce7]"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  />
                </div>
                <h3 className="text-2xl font-bold text-neutral-800 sm:text-3xl mb-4 tracking-tight">
                  Interested in this project?
                </h3>
                <p className="text-neutral-500 mb-8 max-w-xl mx-auto leading-relaxed">
                  Let&apos;s discuss how we can work together on your next project
                </p>
                <button
                  type="button"
                  onClick={() => startTransition(`/projects/${slug}`)}
                  className="inline-flex items-center gap-2 rounded-xl border border-[#6c5ce7]/30 bg-[#6c5ce7]/5 px-6 py-3 text-base font-semibold text-[#6c5ce7] shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#6c5ce7]/50 hover:bg-[#6c5ce7]/10 hover:shadow-md active:translate-y-0"
                >
                  View full project
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </main>
  );
}
