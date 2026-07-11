import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getFeaturedProjects, getProjectBySlug } from "../../../backend/contentful_init";
import {
  breadcrumbSchema,
  creativeWorkSchema,
  JsonLd,
  OG_LOCALE,
  OG_SITE_NAME,
} from "../../../seo";
import CaseStudyPageClient from "./CaseStudyPageClient";

export const revalidate = 3600;

export async function generateStaticParams() {
  const projects = await getFeaturedProjects();
  return projects
    .filter((p) => p.caseStudy)
    .map((p) => ({ slug: p.slug }));
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
    project.headline ?? `Case study for ${project.title} by Krennt Craven.`;
  return {
    title: `Case Study: ${project.title}`,
    description,
    alternates: {
      canonical: `/projects/${slug}/casestudy`,
    },
    openGraph: {
      title: `Case Study: ${project.title} | Krennt Craven`,
      description,
      url: `/projects/${slug}/casestudy`,
      siteName: OG_SITE_NAME,
      locale: OG_LOCALE,
      type: "article",
      ...(project.coverPageUrl && { images: [{ url: project.coverPageUrl }] }),
    },
    twitter: {
      card: "summary_large_image",
      title: `Case Study: ${project.title} | Krennt Craven`,
      description,
      ...(project.coverPageUrl && { images: [project.coverPageUrl] }),
    },
  };
}

export default async function CaseStudyPage({
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
            title: `Case Study: ${project.title}`,
            description:
              project.headline ??
              `Case study for ${project.title} by Krennt Craven.`,
            path: `/projects/${slug}/casestudy`,
            image: project.coverPageUrl,
            isCaseStudy: true,
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Projects", path: "/projects" },
            { name: project.title, path: `/projects/${slug}` },
            { name: "Case Study", path: `/projects/${slug}/casestudy` },
          ]),
        ]}
      />
      <CaseStudyPageClient project={project} />
    </>
  );
}
