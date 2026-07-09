import type { MetadataRoute } from "next";
import { getFeaturedProjects } from "./backend/contentful_init";
import { SITE_URL } from "./seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/projects`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  let projectRoutes: MetadataRoute.Sitemap = [];

  try {
    const projects = await getFeaturedProjects();
    projectRoutes = projects.flatMap((project) => {
      const routes: MetadataRoute.Sitemap = [
        {
          url: `${SITE_URL}/projects/${project.slug}`,
          lastModified: now,
          changeFrequency: "monthly" as const,
          priority: 0.9,
        },
      ];
      // Only list case-study URLs that actually exist to avoid 404s in the sitemap.
      if (project.caseStudy) {
        routes.push({
          url: `${SITE_URL}/projects/${project.slug}/casestudy`,
          lastModified: now,
          changeFrequency: "monthly" as const,
          priority: 0.7,
        });
      }
      return routes;
    });
  } catch (error) {
    console.error("Failed to load projects for sitemap:", error);
  }

  return [...staticRoutes, ...projectRoutes];
}
