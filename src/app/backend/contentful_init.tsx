import type { Asset, EntryFieldTypes } from "contentful";
import { createClient } from "contentful";
import { unstable_cache } from "next/cache";
import "server-only";
import type { ImpactStat, Project } from "./types";
export type { Project } from "./types";

const client = createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID!,
  environment: process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT_ID || "craven",
  accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_DELIVERY_TOKEN!,
});

const PROJECT_TYPE = "featuredProjects" as const;

interface ProjectEntryFields {
  title: EntryFieldTypes.Text;
  slug: EntryFieldTypes.Text;
  headline?: EntryFieldTypes.Text;
  /** Long text, or a list of paragraphs — see `toParagraphs`. */
  overview?: EntryFieldTypes.Text;
  heroImage?: EntryFieldTypes.AssetLink;
  coverPage?: EntryFieldTypes.AssetLink;
  projectType?: EntryFieldTypes.Array<EntryFieldTypes.Symbol>;
  keyFeatures?: EntryFieldTypes.Array<EntryFieldTypes.Symbol>;
  role?: EntryFieldTypes.Text;
  githubLink?: EntryFieldTypes.Text;
  siteLink?: EntryFieldTypes.Text;
  technologies?: EntryFieldTypes.Array<EntryFieldTypes.Symbol>;
  caseStudy?: EntryFieldTypes.RichText;
  problemCaseStudy?: EntryFieldTypes.RichText;
  solutionCaseStudy?: EntryFieldTypes.RichText;
  technicalCaseStudy?: EntryFieldTypes.RichText;
  impactOutcomeCaseStudy?: EntryFieldTypes.RichText;
  challengesLearningsCaseStudy?: EntryFieldTypes.RichText;
  impactStats?: EntryFieldTypes.Object;
  order?: EntryFieldTypes.Integer;
}

interface ProjectEntrySkeleton {
  contentTypeId: typeof PROJECT_TYPE;
  fields: ProjectEntryFields;
}

function isAsset(asset: any): asset is Asset {
  return asset && "fields" in asset;
}

// Contentful list fields can arrive as an array, a single value, or (for
// short-text lists) a comma-separated string. Normalize to a clean string[].
// `toTags` splits on commas (tech/type chips); `toList` preserves commas
// inside each item (feature sentences).
function toTags(value: unknown): string[] {
  const arr = Array.isArray(value)
    ? value
    : value !== undefined && value !== null && value !== ""
      ? [value]
      : [];
  return arr
    .flatMap((v) => String(v).split(","))
    .map((v) => v.trim())
    .filter(Boolean);
}

function toList(value: unknown): string[] {
  const arr = Array.isArray(value)
    ? value
    : value !== undefined && value !== null && value !== ""
      ? [value]
      : [];
  return arr.map((v) => String(v).trim()).filter(Boolean);
}

// Overview accepts either a short-text list (one entry per paragraph) or a
// long-text field with blank lines between paragraphs, so the content type can
// be modelled either way without a code change.
function toParagraphs(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((v) => String(v).trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean);
  }
  return [];
}

async function _getFeaturedProjects(): Promise<Project[]> {
  const entries = await client.getEntries<ProjectEntrySkeleton>({
    content_type: PROJECT_TYPE,
    order: ["fields.order"],
  });

  return entries.items
    .map((item) => ({
      id: item.sys.id,
      title: item.fields.title ?? "Untitled",
      slug: item.fields.slug ?? "",
      headline: item.fields.headline,
      overview: toParagraphs(item.fields.overview),
      imageUrl:
        item.fields.heroImage &&
        isAsset(item.fields.heroImage) &&
        item.fields.heroImage.fields?.file?.url
          ? `https:${item.fields.heroImage.fields.file.url}`
          : undefined,
      coverPageUrl:
        item.fields.coverPage &&
        isAsset(item.fields.coverPage) &&
        item.fields.coverPage.fields?.file?.url
          ? `https:${item.fields.coverPage.fields.file.url}`
          : undefined,
      projectType: toTags(item.fields.projectType),
      technologies: toTags(item.fields.technologies),
      keyFeatures: toList(item.fields.keyFeatures),
      role: item.fields.role,
      caseStudy: item.fields.caseStudy,
      problemCaseStudy: item.fields.problemCaseStudy,
      solutionCaseStudy: item.fields.solutionCaseStudy,
      technicalCaseStudy: item.fields.technicalCaseStudy,
      impactOutcomeCaseStudy: item.fields.impactOutcomeCaseStudy,
      challengesLearningsCaseStudy: item.fields.challengesLearningsCaseStudy,
      impactStats: item.fields.impactStats as ImpactStat[] | undefined,
      githubLink: item.fields.githubLink,
      siteLink: item.fields.siteLink,
      order: item.fields.order,
    }))
    .filter((p) => p.slug);
}

export const getFeaturedProjects = unstable_cache(
  _getFeaturedProjects,
  ["featured-projects"],
  { revalidate: 3600, tags: ["featured-projects"] },
);

async function _getProjectBySlug(slug: string): Promise<Project | null> {
  const entries = await client.getEntries<ProjectEntrySkeleton>({
    content_type: PROJECT_TYPE,
    "fields.slug": slug,
    limit: 1,
  });

  const item = entries.items[0];
  if (!item) return null;

  return {
    id: item.sys.id,
    title: item.fields.title ?? "Untitled",
    slug: item.fields.slug ?? "",
    headline: item.fields.headline,
    overview: toParagraphs(item.fields.overview),
    imageUrl:
      item.fields.heroImage &&
      isAsset(item.fields.heroImage) &&
      item.fields.heroImage.fields?.file?.url
        ? `https:${item.fields.heroImage.fields.file.url}`
        : undefined,
    coverPageUrl:
      item.fields.coverPage &&
      isAsset(item.fields.coverPage) &&
      item.fields.coverPage.fields?.file?.url
        ? `https:${item.fields.coverPage.fields.file.url}`
        : undefined,
    projectType: toTags(item.fields.projectType),
    keyFeatures: toList(item.fields.keyFeatures),
    role: item.fields.role,
    caseStudy: item.fields.caseStudy,
    problemCaseStudy: item.fields.problemCaseStudy,
    solutionCaseStudy: item.fields.solutionCaseStudy,
    technicalCaseStudy: item.fields.technicalCaseStudy,
    impactOutcomeCaseStudy: item.fields.impactOutcomeCaseStudy,
    challengesLearningsCaseStudy: item.fields.challengesLearningsCaseStudy,
    impactStats: item.fields.impactStats as ImpactStat[] | undefined,
    siteLink: item.fields.siteLink,
    technologies: toTags(item.fields.technologies),
    githubLink: item.fields.githubLink,
    order: item.fields.order,
  };
}

export function getProjectBySlug(slug: string): Promise<Project | null> {
  return unstable_cache(() => _getProjectBySlug(slug), [`project-${slug}`], {
    revalidate: 3600,
    tags: [`project-${slug}`, "projects"],
  })();
}

export default client;
