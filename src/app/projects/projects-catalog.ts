/**
 * Projects catalog — the one list every project surface reads from.
 *
 * The portfolio has two content sources: Contentful (older work, with rich
 * case studies) and the local `projects-data.ts` registry (recent work). They
 * used to be listed independently, which let /projects and the homepage drift
 * into two disjoint lists. Everything now funnels through `getAllProjects`, so
 * /projects is the full catalog and the homepage Spotlight is a slice of it —
 * a visitor moving from one to the other always sees a superset.
 *
 * Ordering is newest work first (local registry, top-down) followed by the
 * Contentful projects in their editorial `order` field.
 */
import "server-only";
import { getFeaturedProjects } from "../backend/contentful_init";
import type { Project, ProjectStatus } from "../backend/types";
import type { ProjectCardData } from "../frontend/project-card";
import { localProjects, type LocalProject } from "./projects-data";

/** A project reduced to what a card needs, plus its slug for navigation. */
export type ProjectSummary = ProjectCardData & { slug: string };

/**
 * The homepage Spotlight, in display order. These are the first entries of the
 * catalog, so the homepage grid reads as the opening row of /projects rather
 * than a separately maintained list. Reorder or swap slugs freely — anything
 * listed here gets the Spotlight badge on /projects too.
 */
export const SPOTLIGHT_SLUGS = [
  "automated-job-workflow",
  "budget-tracker",
  "onesync",
];

/**
 * Hand-picked card tags for Contentful projects, whose `technologies` field is
 * free text and inconsistently punctuated. The first entry is the category
 * label, the rest are the stack chips. Keyed by slug; without an entry the raw
 * Contentful fields are used as-is.
 */
const TAG_OVERRIDES: Record<string, string[]> = {
  onesync: ["Full-Stack", "Flutter", "Node.js", "Firebase", "RFID/Hardware"],
  sagip: ["Full-Stack", "React Native", "Firebase", "Google Maps API"],
  "ang-pamantasan": ["Full-Stack", "Next.js", "Contentful", "GraphQL"],
  "g-connect": ["Full-Stack", "Next.js", "API Design", "Vercel"],
};

/**
 * Delivery status per Contentful project. The `featuredProjects` content type
 * has no status field, and these all shipped, so they are marked here rather
 * than left blank next to the local projects that do carry a status.
 */
const CONTENTFUL_STATUS: Record<string, ProjectStatus> = {
  onesync: "Completed",
  "ang-pamantasan": "Completed",
  sagip: "Completed",
  campustnest: "Completed",
  "g-connect": "Completed",
};

/** Case-study routes only exist for entries that actually have the content. */
const hasCaseStudy = (p: Project) =>
  Boolean(p.problemCaseStudy || p.solutionCaseStudy || p.caseStudy);

/** Contentful serves its own CDN transforms; ask for WebP up front. */
const cdnImage = (url?: string) => (url ? `${url}?fm=webp&fit=fill` : undefined);

function contentfulToSummary(p: Project): ProjectSummary {
  const override = TAG_OVERRIDES[p.slug];
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    description: p.headline ?? "",
    category: override ? override[0] : p.projectType?.[0],
    technologies: override ? override.slice(1) : (p.technologies ?? []),
    image: cdnImage(p.coverPageUrl),
    status: CONTENTFUL_STATUS[p.slug],
    github: p.githubLink,
    liveDemo: p.siteLink,
    caseStudy: hasCaseStudy(p) ? `/projects/${p.slug}/casestudy` : undefined,
    href: `/projects/${p.slug}`,
  };
}

function localToSummary(p: LocalProject): ProjectSummary {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    description: p.description,
    category: p.category,
    technologies: p.technologies,
    image: p.coverImage,
    status: p.status,
    github: p.github,
    liveDemo: p.liveDemo,
    href: `/projects/${p.slug}`,
  };
}

/**
 * Every project, newest first. Contentful failures degrade to the local
 * registry instead of emptying the page.
 */
export async function getAllProjects(): Promise<ProjectSummary[]> {
  let fromContentful: ProjectSummary[] = [];
  try {
    fromContentful = (await getFeaturedProjects()).map(contentfulToSummary);
  } catch (error) {
    console.error("Failed to load Contentful projects for the catalog:", error);
  }

  const spotlight = new Set(SPOTLIGHT_SLUGS);
  return [...localProjects.map(localToSummary), ...fromContentful].map(
    (project) => ({ ...project, featured: spotlight.has(project.slug) }),
  );
}

/** The curated homepage slice, in `SPOTLIGHT_SLUGS` order. */
export async function getSpotlightProjects(): Promise<ProjectSummary[]> {
  const bySlug = new Map((await getAllProjects()).map((p) => [p.slug, p]));
  return SPOTLIGHT_SLUGS.map((slug) => bySlug.get(slug)).filter(
    (project): project is ProjectSummary => Boolean(project),
  );
}
