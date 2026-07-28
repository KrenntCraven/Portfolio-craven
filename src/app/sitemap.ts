import type { MetadataRoute } from "next";
import { getFeaturedProjects } from "./backend/contentful_init";
import { localProjects } from "./projects/projects-data";
import { SITE_URL } from "./seo";

/**
 * `lastModified` is deliberately omitted. We have no real per-page edit dates,
 * and stamping every URL with the build time tells Google the whole site
 * changes on each deploy — a signal it learns to distrust and then ignores for
 * the entire sitemap. Better to say nothing than to say something false.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      // No trailing slash, to match the canonical tag the page actually renders.
      url: SITE_URL,
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/about`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/projects`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  // Locally registered projects have no case-study route.
  const localProjectRoutes: MetadataRoute.Sitemap = localProjects.map(
    (project) => ({
      url: `${SITE_URL}/projects/${project.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    }),
  );

  let projectRoutes: MetadataRoute.Sitemap = [];

  try {
    const projects = await getFeaturedProjects();
    projectRoutes = projects.flatMap((project) => {
      const routes: MetadataRoute.Sitemap = [
        {
          url: `${SITE_URL}/projects/${project.slug}`,
          changeFrequency: "monthly" as const,
          priority: 0.9,
        },
      ];
      // Only list case-study URLs that actually exist to avoid 404s in the sitemap.
      if (project.caseStudy) {
        routes.push({
          url: `${SITE_URL}/projects/${project.slug}/casestudy`,
          changeFrequency: "monthly" as const,
          priority: 0.7,
        });
      }
      return routes;
    });
  } catch (error) {
    console.error("Failed to load projects for sitemap:", error);
  }

  return [...staticRoutes, ...localProjectRoutes, ...projectRoutes];
}
