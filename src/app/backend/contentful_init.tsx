import type { Asset, EntryFieldTypes } from "contentful";
import { createClient } from "contentful";

const client = createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID!,
  environment: process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT_ID || "craven",
  accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_DELIVERY_TOKEN!,
});

const PROJECT_TYPE = "featuredProjects" as const;

// Define proper Entry Skeleton Types
interface ProjectEntryFields {
  title: EntryFieldTypes.Text;
  slug: EntryFieldTypes.Text;
  headline?: EntryFieldTypes.Text;
  heroImage?: EntryFieldTypes.AssetLink;
  coverPage?: EntryFieldTypes.AssetLink;
  projectType?: EntryFieldTypes.Array<EntryFieldTypes.Symbol>;
  keyFeatures?: EntryFieldTypes.Array<EntryFieldTypes.Symbol>;
  role?: EntryFieldTypes.Text;
  technologies?: EntryFieldTypes.Array<EntryFieldTypes.Symbol>;
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
      keyFeatures: item.fields.keyFeatures,
      role: item.fields.role,
      technologies: item.fields.technologies,
      order: item.fields.order,
    }))
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
    keyFeatures: item.fields.keyFeatures,
    role: item.fields.role,
    technologies: item.fields.technologies,
    order: item.fields.order,
  };
}

export default client;
