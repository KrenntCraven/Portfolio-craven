import { createClient } from "contentful";

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  environment: process.env.CONTENTFUL_ENVIRONMENT_ID || "craven",
  accessToken: process.env.CONTENTFUL_DELIVERY_TOKEN!,
});

export type Project = {
  id: string;
  title: string;
  slug: string;
  imageUrl?: string;
};

const PROJECT_TYPE =
  process.env.CONTENTFUL_PROJECT_TYPE_ID || "featuredProjects";

export async function getFeaturedProjects() {
  const entries = await client.getEntries<{
    title: string;
    slug: string;
    thumbnail?: { fields?: { file?: { url?: string } } };
  }>({ content_type: PROJECT_TYPE });

  return entries.items
    .map((item) => ({
      id: item.sys.id,
      title: item.fields.title ?? "Untitled",
      slug: item.fields.slug ?? "",
      imageUrl: item.fields.thumbnail?.fields?.file?.url
        ? `https:${item.fields.thumbnail.fields.file.url}`
        : undefined,
    }))
    .filter((p) => p.slug);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const entries = await client.getEntries<{
    title: string;
    slug: string;
    thumbnail?: { fields?: { file?: { url?: string } } };
  }>({
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
    imageUrl: item.fields.thumbnail?.fields?.file?.url
      ? `https:${item.fields.thumbnail.fields.file.url}`
      : undefined,
  };
}
