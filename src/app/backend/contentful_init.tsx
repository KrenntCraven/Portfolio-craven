import type { Document } from "@contentful/rich-text-types";
import type { Asset, EntryFieldTypes } from "contentful";
import { createClient } from "contentful";

const client = createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID!,
  environment: process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT_ID || "craven",
  accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_DELIVERY_TOKEN!,
});

const PROJECT_TYPE = "featuredProjects" as const;

// Entry Skeleton Types
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

export type Project = {
  id: string;
  title: string;
  slug: string;
  headline?: string;
  imageUrl?: string;
  coverPageUrl?: string;
  projectType?: string[];
  keyFeatures?: string[];
  role?: string;
  technologies?: string[];
  order?: number;
  githubLink?: string;
  siteLink?: string;
  caseStudy?: Document;
  problemCaseStudy?: Document;
  solutionCaseStudy?: Document;
  technicalCaseStudy?: Document;
  impactOutcomeCaseStudy?: Document;
  challengesLearningsCaseStudy?: Document;
};

// Helper function to check if asset is resolved
function isAsset(asset: any): asset is Asset {
  return asset && "fields" in asset;
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const entries = await client.getEntries<ProjectEntrySkeleton>({
    content_type: PROJECT_TYPE,
    order: ["fields.order"],
  });

  return entries.items
    .map((item) => {
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
        // Case Study fields
        caseStudy: item.fields.caseStudy,
        problemCaseStudy: item.fields.problemCaseStudy,
        solutionCaseStudy: item.fields.solutionCaseStudy,
        technicalCaseStudy: item.fields.technicalCaseStudy,
        impactOutcomeCaseStudy: item.fields.impactOutcomeCaseStudy,
        challengesLearningsCaseStudy: item.fields.challengesLearningsCaseStudy,

        // Links
        githubLink: item.fields.githubLink,
        siteLink: item.fields.siteLink,
        order: item.fields.order,
      };
    })
    .filter((p) => p.slug);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const entries = await client.getEntries<ProjectEntrySkeleton>({
    content_type: PROJECT_TYPE,
    "fields.slug": slug,
    limit: 1,
  });

  const item = entries.items[0];
  if (!item) return null;
  console.log("Contentful fields:", item.fields);
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
    // Case Study fields
    caseStudy: item.fields.caseStudy,
    problemCaseStudy: item.fields.problemCaseStudy,
    solutionCaseStudy: item.fields.solutionCaseStudy,
    technicalCaseStudy: item.fields.technicalCaseStudy,
    impactOutcomeCaseStudy: item.fields.impactOutcomeCaseStudy,
    challengesLearningsCaseStudy: item.fields.challengesLearningsCaseStudy,
    // Links
    siteLink: item.fields.siteLink,
    technologies: item.fields.technologies,
    githubLink: item.fields.githubLink,
    order: item.fields.order,
  };
}

export default client;
