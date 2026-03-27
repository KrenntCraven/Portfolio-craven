import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getFeaturedProjects, getProjectBySlug } from "../../../backend/contentful_init";
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
  return {
    title: `Case Study: ${project.title} | Krennt Craven`,
    description: project.headline ?? `Case study for ${project.title} by Krennt Craven.`,
    openGraph: {
      title: `Case Study: ${project.title}`,
      description: project.headline ?? `Case study for ${project.title}.`,
      ...(project.coverPageUrl && { images: [{ url: project.coverPageUrl }] }),
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

  return <CaseStudyPageClient project={project} />;
}
