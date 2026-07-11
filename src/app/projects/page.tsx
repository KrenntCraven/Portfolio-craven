import type { Metadata } from "next";
import { breadcrumbSchema, JsonLd, OG_LOCALE, OG_SITE_NAME } from "../seo";
import ProjectsPageClient from "./projects-page";

const PROJECTS_DESCRIPTION =
  "Projects by Krennt Craven — full-stack and cloud engineering work, from production systems to in-depth case studies.";

export const metadata: Metadata = {
  title: "Projects",
  description: PROJECTS_DESCRIPTION,
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    title: "Projects | Krennt Craven",
    description: PROJECTS_DESCRIPTION,
    url: "/projects",
    siteName: OG_SITE_NAME,
    locale: OG_LOCALE,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects | Krennt Craven",
    description: PROJECTS_DESCRIPTION,
  },
};

export default function ProjectsPage() {
  return (
    <>
      <JsonLd
        schema={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Projects", path: "/projects" },
        ])}
      />
      <ProjectsPageClient />
    </>
  );
}
