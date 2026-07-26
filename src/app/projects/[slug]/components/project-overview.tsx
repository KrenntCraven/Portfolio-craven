/**
 * ProjectOverview — the editorial lead of the article. Renders locally-authored
 * overview paragraphs when present, otherwise the Contentful intro rich text.
 * Server Component.
 */
import type { Project } from "../../../backend/types";
import { PROSE_CLASS, parseInline, renderRichText } from "./rich-text";
import { SectionShell } from "./section-shell";

export function ProjectOverview({ project }: { project: Project }) {
  const hasOverview = Boolean(project.overview?.length);
  const hasIntro = Boolean(project.caseStudy);
  if (!hasOverview && !hasIntro) return null;

  return (
    <SectionShell eyebrow="Overview" title="About this project">
      <div className={PROSE_CLASS}>
        {hasOverview
          ? project.overview!.map((paragraph, i) => (
              <p key={i}>{parseInline(paragraph)}</p>
            ))
          : renderRichText(project.caseStudy!)}
      </div>
    </SectionShell>
  );
}
