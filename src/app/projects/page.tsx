import type { Metadata } from "next";
import ProjectsPageClient from "./projects-page";

export const metadata: Metadata = {
  title: "Projects",
  description: "Projects by Krennt Craven — full-stack and cloud engineering work.",
  alternates: {
    canonical: "/projects",
  },
};

export default function ProjectsPage() {
  return <ProjectsPageClient />;
}
