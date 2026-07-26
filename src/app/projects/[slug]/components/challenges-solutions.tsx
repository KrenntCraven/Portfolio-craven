/**
 * ChallengesSolutions — a condensed teaser of the problem/solution narrative,
 * pulled from the Contentful case-study fields and linking to the full write-up.
 * Renders nothing unless that content exists. Server Component.
 */
import Link from "next/link";
import type { Project } from "../../../backend/types";
import { ArrowRightIcon, FOCUS_RING } from "../../../frontend/project-ui";
import { richTextTeaser } from "./rich-text";
import { SectionShell } from "./section-shell";

export function ChallengesSolutions({ project }: { project: Project }) {
  const problem = richTextTeaser(project.problemCaseStudy);
  const solution = richTextTeaser(project.solutionCaseStudy);
  if (!problem && !solution) return null;

  const cards = [
    { label: "The challenge", body: problem, accent: "from-rose-500/10" },
    { label: "The solution", body: solution, accent: "from-emerald-500/10" },
  ].filter((c) => c.body);

  return (
    <SectionShell eyebrow="The story, in brief" title="Challenges & solutions">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`relative overflow-hidden rounded-2xl border border-neutral-200/70 bg-white/70 p-6 shadow-[0_10px_40px_-28px_rgba(15,23,42,0.35)] backdrop-blur-sm`}
          >
            <div
              aria-hidden
              className={`absolute inset-x-0 top-0 h-24 bg-linear-to-b ${card.accent} to-transparent`}
            />
            <div className="relative">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#6c5ce7]">
                {card.label}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-neutral-600">
                {card.body}
              </p>
            </div>
          </div>
        ))}
      </div>
      {project.caseStudy && (
        <Link
          href={`/projects/${project.slug}/casestudy`}
          className={`mt-6 inline-flex items-center gap-1.5 rounded-lg text-sm font-semibold text-[#6c5ce7] hover:underline ${FOCUS_RING}`}
        >
          Read the full breakdown in the case study
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      )}
    </SectionShell>
  );
}
