import FeaturedProjectsClient from "../frontend/home/featured-spotlight";
import { getSpotlightProjects } from "../projects/projects-catalog";

export const revalidate = 3600;

// Server wrapper: fetches the curated Spotlight slice of the projects catalog
// (see projects-catalog.ts) and passes it to the client grid. Reading from the
// catalog rather than Contentful directly keeps the homepage a strict subset of
// /projects.
export default async function FeaturedProjectsWrapper() {
  const projects = await getSpotlightProjects();
  return <FeaturedProjectsClient projects={projects} />;
}
