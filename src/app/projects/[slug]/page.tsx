import { notFound } from "next/navigation";
import { getFeaturedProjects, getProjectBySlug } from "../../backend/contentful_init";
import ProjectPageClient from "./ProjectPageClient";

export const revalidate = 3600;

export async function generateStaticParams() {
  const projects = await getFeaturedProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) notFound();

  return <ProjectPageClient project={project} />;
}
