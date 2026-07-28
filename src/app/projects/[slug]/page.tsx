import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getFeaturedProjects, getProjectBySlug } from "../../backend/contentful_init";
import type { Project } from "../../backend/types";
import {
  breadcrumbSchema,
  creativeWorkSchema,
  JsonLd,
  OG_LOCALE,
  OG_SITE_NAME,
} from "../../seo";
import { BannerBackground } from "../../frontend/banner-background";
import {
  getLocalProject,
  localProjectToProject,
  localProjects,
} from "../projects-data";
import ProjectPageClient from "./ProjectPageClient";
import { ChallengesSolutions } from "./components/challenges-solutions";
import { MotionProvider } from "./components/motion-provider";
import { ProjectActions } from "./components/project-actions";
import { ProjectGallery } from "./components/project-gallery";
import { ProjectHero } from "./components/project-hero";
import { ProjectHighlights } from "./components/project-highlights";
import { ProjectMetadata } from "./components/project-metadata";
import { ProjectOverview } from "./components/project-overview";
import { QuickMetrics } from "./components/quick-metrics";
import { TechnologyStack } from "./components/technology-stack";

export const revalidate = 3600;

// Every valid slug is known at build time, so anything else is a genuine 404.
// Without this, Next streams the layout shell before `notFound()` resolves and
// the response goes out as 200 — a soft 404 that Google indexes as a duplicate
// of the homepage, since the fallback metadata is the root metadata.
export const dynamicParams = false;

// Local (hardcoded) projects take precedence over Contentful for the same slug.
async function resolveProject(slug: string): Promise<Project | null> {
  const local = getLocalProject(slug);
  if (local) return localProjectToProject(local);
  return getProjectBySlug(slug);
}

export async function generateStaticParams() {
  const projects = await getFeaturedProjects();
  return [
    ...projects.map((p) => ({ slug: p.slug })),
    ...localProjects.map((p) => ({ slug: p.slug })),
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await resolveProject(slug);
  if (!project) return {};
  const description =
    project.headline ?? `${project.title} — a project by Krennt Craven.`;
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
  const local = getLocalProject(slug);
  const project = local
    ? localProjectToProject(local)
    : await getProjectBySlug(slug);

  if (!project) notFound();

  const structuredData = (
    <JsonLd
      schema={[
        creativeWorkSchema({
          title: project.title,
          description:
            project.headline ??
            `${project.title} — a project by Krennt Craven.`,
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
  );

  // Contentful "Spotlight" projects keep their original detail design. Only
  // local /projects entries use the newer editorial layout.
  if (!local) {
    return (
      <>
        {structuredData}
        <ProjectPageClient project={project} />
      </>
    );
  }

  return (
    <>
      {structuredData}
      <MotionProvider>
        <div className="relative min-h-screen overflow-x-clip bg-white text-neutral-800">
          <BannerBackground />

          <ProjectHero project={project} />

          {/* Article body — comfortable reading column + sticky meta rail */}
          <div className="relative z-10 mx-auto mt-16 max-w-6xl px-4 pb-4 sm:mt-20 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-16">
              <article className="min-w-0 space-y-16 sm:space-y-20">
                <ProjectOverview project={project} />
                <ProjectHighlights features={project.keyFeatures} />
                <TechnologyStack technologies={project.technologies} />
                <ProjectGallery images={project.gallery} />
                <QuickMetrics stats={project.impactStats} />
                <ChallengesSolutions project={project} />
              </article>

              <ProjectMetadata project={project} />
            </div>
          </div>

          <div className="relative z-10 mx-auto max-w-5xl px-4 pb-20 pt-16 sm:px-6 sm:pb-28 sm:pt-20 lg:px-8">
            <ProjectActions project={project} />
          </div>
        </div>
      </MotionProvider>
    </>
  );
}
