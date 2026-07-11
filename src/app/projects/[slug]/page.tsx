import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getFeaturedProjects, getProjectBySlug } from "../../backend/contentful_init";
import {
  breadcrumbSchema,
  creativeWorkSchema,
  JsonLd,
  OG_LOCALE,
  OG_SITE_NAME,
} from "../../seo";
import ProjectPageClient from "./ProjectPageClient";

export const revalidate = 3600;

export async function generateStaticParams() {
  const projects = await getFeaturedProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  const description =
    project.headline ?? `${project.title} — a featured project by Krennt Craven.`;
  // Plain string title lets the root "%s | Krennt Craven" template apply once.
  return {
    title: project.title,
    description,
    alternates: {
      canonical: `/projects/${slug}`,
    },
    openGraph: {
      title: `${project.title} | Krennt Craven`,
      description,
      url: `/projects/${slug}`,
      siteName: OG_SITE_NAME,
      locale: OG_LOCALE,
      type: "article",
      ...(project.coverPageUrl && { images: [{ url: project.coverPageUrl }] }),
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} | Krennt Craven`,
      description,
      ...(project.coverPageUrl && { images: [project.coverPageUrl] }),
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) notFound();

  return (
    <>
      <JsonLd
        schema={[
          creativeWorkSchema({
            title: project.title,
            description:
              project.headline ??
              `${project.title} — a featured project by Krennt Craven.`,
            path: `/projects/${slug}`,
            image: project.coverPageUrl,
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Projects", path: "/projects" },
            { name: project.title, path: `/projects/${slug}` },
          ]),
        ]}
      />
      <ProjectPageClient project={project} />
    </>
  );
}
