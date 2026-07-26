/**
 * ProjectMetadata — a desktop-only sticky rail summarizing the project's facts
 * and quick links. Hidden on mobile (the hero already surfaces this). Server
 * Component; sticky behavior is pure CSS.
 */
import Link from "next/link";
import type { Project } from "../../../backend/types";
import {
  BookIcon,
  ClockIcon,
  ExternalIcon,
  FOCUS_RING,
  GithubIcon,
} from "../../../frontend/project-ui";
import { StatusBadge } from "./status-badge";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wider text-neutral-400">
        {label}
      </dt>
      <dd className="mt-1.5 text-sm font-medium text-neutral-800">{children}</dd>
    </div>
  );
}

export function ProjectMetadata({ project }: { project: Project }) {
  const category = project.projectType?.[0];
  const technologies = project.technologies ?? [];
  const hasLinks = Boolean(
    project.caseStudy || project.siteLink || project.githubLink,
  );

  return (
    <aside className="hidden lg:block">
      <div className="sticky top-28 space-y-6 rounded-2xl border border-neutral-200/70 bg-white/70 p-6 shadow-[0_10px_40px_-28px_rgba(15,23,42,0.35)] backdrop-blur-sm">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[#6c5ce7]">
          Project details
        </h2>

        <dl className="space-y-4">
          {project.status && (
            <Field label="Status">
              <StatusBadge status={project.status} />
            </Field>
          )}
          {project.timeline && (
            <Field label="Timeline">
              <span className="inline-flex items-center gap-1.5">
                <ClockIcon className="h-4 w-4 text-[#6c5ce7]" />
                {project.timeline}
              </span>
            </Field>
          )}
          {project.role && <Field label="Role">{project.role}</Field>}
          {category && <Field label="Category">{category}</Field>}
        </dl>

        {technologies.length > 0 && (
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-neutral-400">
              Tech
            </p>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {technologies.map((tech, i) => (
                <li
                  key={i}
                  className="rounded-md border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-xs font-medium text-neutral-600"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </div>
        )}

        {hasLinks && (
          <div className="space-y-2.5 border-t border-neutral-200/70 pt-5">
            {project.caseStudy && (
              <Link
                href={`/projects/${project.slug}/casestudy`}
                className={`flex items-center gap-2 rounded-lg text-sm font-semibold text-[#6c5ce7] transition-colors hover:text-[#5a4bd4] ${FOCUS_RING}`}
              >
                <BookIcon className="h-4 w-4 shrink-0" />
                Read case study
              </Link>
            )}
            {project.siteLink && (
              <a
                href={project.siteLink}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 rounded-lg text-sm font-medium text-neutral-700 transition-colors hover:text-[#6c5ce7] ${FOCUS_RING}`}
              >
                <ExternalIcon className="h-4 w-4 shrink-0" />
                Live demo
              </a>
            )}
            {project.githubLink && (
              <a
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 rounded-lg text-sm font-medium text-neutral-700 transition-colors hover:text-[#6c5ce7] ${FOCUS_RING}`}
              >
                <GithubIcon className="h-4 w-4 shrink-0" />
                Source code
              </a>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
