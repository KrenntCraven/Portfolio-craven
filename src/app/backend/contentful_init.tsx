import "server-only";
import type { Asset, EntryFieldTypes } from "contentful";
import { createClient } from "contentful";
import { unstable_cache } from "next/cache";
export type { Project } from "./types";
import type { Project } from "./types";

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
  order?: EntryFieldTypes.Integer;
}

interface ProjectEntrySkeleton {
  contentTypeId: typeof PROJECT_TYPE;
  fields: ProjectEntryFields;
}

function isAsset(asset: any): asset is Asset {
  return asset && "fields" in asset;
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
      projectType: item.fields.projectType,
      keyFeatures: item.fields.keyFeatures || [],
      role: item.fields.role,
      caseStudy: item.fields.caseStudy,
      problemCaseStudy: item.fields.problemCaseStudy,
      solutionCaseStudy: item.fields.solutionCaseStudy,
      technicalCaseStudy: item.fields.technicalCaseStudy,
      impactOutcomeCaseStudy: item.fields.impactOutcomeCaseStudy,
      challengesLearningsCaseStudy: item.fields.challengesLearningsCaseStudy,
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
    projectType: item.fields.projectType,
    keyFeatures: item.fields.keyFeatures || [],
    role: item.fields.role,
    caseStudy: item.fields.caseStudy,
    problemCaseStudy: item.fields.problemCaseStudy,
    solutionCaseStudy: item.fields.solutionCaseStudy,
    technicalCaseStudy: item.fields.technicalCaseStudy,
    impactOutcomeCaseStudy: item.fields.impactOutcomeCaseStudy,
    challengesLearningsCaseStudy: item.fields.challengesLearningsCaseStudy,
    siteLink: item.fields.siteLink,
    technologies: item.fields.technologies,
    githubLink: item.fields.githubLink,
    order: item.fields.order,
  };
}

export function getProjectBySlug(slug: string): Promise<Project | null> {
  return unstable_cache(
    () => _getProjectBySlug(slug),
    [`project-${slug}`],
    { revalidate: 3600, tags: [`project-${slug}`, "projects"] },
  )();
}

interface ResumeEntryFields {
  resumeFile: EntryFieldTypes.AssetLink;
}

interface ResumeEntrySkeleton {
  contentTypeId: "resume";
  fields: ResumeEntryFields;
}

async function _getResumeUrl(): Promise<string | null> {
  const entries = await client.getEntries<ResumeEntrySkeleton>({
    content_type: "resume",
    limit: 1,
  });

  const item = entries.items[0];
  if (!item) return null;

  const file = item.fields.resumeFile;
  if (!isAsset(file) || !file.fields?.file?.url) return null;

  return `https:${file.fields.file.url}`;
}

export const getResumeUrl = unstable_cache(
  _getResumeUrl,
  ["resume-url"],
  { revalidate: 3600, tags: ["resume"] },
);

export default client;
