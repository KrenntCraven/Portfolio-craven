"use client";

import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import type { Document } from "@contentful/rich-text-types";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
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
  "prose prose-neutral prose-lg max-w-none text-left sm:text-justify leading-[1.6] prose-headings:text-neutral-800 prose-headings:font-semibold prose-p:text-neutral-600 prose-p:leading-[1.6] prose-strong:text-neutral-800 prose-a:text-neutral-800 prose-a:underline hover:prose-a:no-underline prose-ul:text-neutral-600 prose-ul:list-disc prose-ul:pl-6 prose-ul:list-outside prose-ol:text-neutral-600 prose-ol:list-decimal prose-ol:pl-6 prose-ol:list-outside prose-li:pl-1";

function CaseStudySection({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16"
    >
      <div className="mx-auto max-w-3xl w-full">
        {label && (
          <h2 className="mb-6 text-xl font-semibold text-neutral-800 sm:text-2xl">
            {label}
          </h2>
        )}
        <div className={PROSE_CLASS}>{children}</div>
      </div>
    </section>
  );
}

export default function CaseStudyPage({ params }: PageProps) {
  const [project, setProject] = useState<Project | null>(null);
  const [slug, setSlug] = useState<string>("");

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

  if (!project) {
    return (
      <main className="relative flex min-h-screen items-center justify-center bg-white text-neutral-800 pt-16 sm:pt-20 md:pt-24 lg:pt-28">
        <p className="text-neutral-500">Loading case study...</p>
      </main>
    );
  }

  const sectionsToRender = SECTION_CONFIG.filter(
    (s) => project[s.field] && typeof project[s.field] === "object",
  ) as { id: string; field: keyof Project; label: string }[];

  return (
    <main className="relative min-h-screen overflow-visible bg-white text-neutral-800 pt-16 sm:pt-20 md:pt-24 lg:pt-28 pb-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,0,0,0.05),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(0,0,0,0.03),transparent_28%)]" />
        <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-black/5 via-transparent to-transparent" />
        <div className="absolute inset-x-12 sm:inset-x-24 -bottom-48 h-72 rounded-[36px] bg-black/5 blur-3xl" />
      </div>

      <div className="relative z-20 mx-auto mt-16 sm:mt-0 max-w-6xl px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <Link
          href={`/projects/${slug}`}
          className="inline-flex w-full items-center justify-center gap-3 rounded-xl border border-neutral-300 bg-white/80 px-4 py-2.5 text-sm font-semibold text-neutral-800 shadow-sm backdrop-blur transition-all hover:-translate-y-0.5 hover:border-neutral-400 hover:shadow-md active:translate-y-0 sm:w-auto sm:text-base sm:px-4 sm:py-2.5"
        >
          <svg
            className="h-4 w-4 sm:h-5 sm:w-5 shrink-0"
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
      </div>

      <section className="relative z-10 mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:pt-16 lg:pb-12">
        <div className="mx-auto max-w-3xl w-full">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-3xl font-bold tracking-tight text-neutral-800 sm:text-4xl lg:text-5xl"
          >
            {project.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.06 }}
            className="mt-2 text-base font-medium text-neutral-500 sm:text-lg"
          >
            Case Study
          </motion.p>
        </div>
      </section>

      {sectionsToRender.map(({ id, field, label }) => (
        <CaseStudySection key={id} id={id} label={label}>
          {documentToReactComponents(project[field] as Document)}
        </CaseStudySection>
      ))}
    </main>
  );
}
