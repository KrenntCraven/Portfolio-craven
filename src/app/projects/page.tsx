import type { Metadata } from "next";
import { breadcrumbSchema, JsonLd, OG_LOCALE, OG_SITE_NAME } from "../seo";
import ProjectsPageClient from "./projects-page";

// Distinct copy per surface, all highlighting the actual stack and the kind of
// engineering work the projects demonstrate — no homepage copy reused.
const PROJECTS_META_DESCRIPTION =
  "Explore software projects by Krennt Craven — full-stack web and mobile apps and cloud-native systems built with React, Next.js, Node.js, TypeScript, and AWS, demonstrating scalable, production-grade engineering.";
const PROJECTS_OG_DESCRIPTION =
  "A showcase of Krennt Craven's engineering work — production systems, web and mobile apps, and cloud-native solutions built with React, Next.js, and AWS.";
const PROJECTS_TWITTER_DESCRIPTION =
  "Full-stack & cloud projects built with React, Next.js, Node.js, and AWS — from production systems to in-depth case studies.";

export const metadata: Metadata = {
  title: { absolute: "Projects — Krennt Craven" },
  description: PROJECTS_META_DESCRIPTION,
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    title: "Projects — Krennt Craven",
    description: PROJECTS_OG_DESCRIPTION,
    url: "/projects",
    siteName: OG_SITE_NAME,
    locale: OG_LOCALE,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects — Krennt Craven",
    description: PROJECTS_TWITTER_DESCRIPTION,
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
