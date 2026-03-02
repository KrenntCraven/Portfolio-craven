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
