import FeaturedProjectsClient from "../frontend/home/featured-projects";
import { getFeaturedProjects } from "./contentful_init";

export const revalidate = 3600;

// server Wrapper to fetch data and pass to client component
export default async function FeaturedProjectsWrapper() {
  const projects = await getFeaturedProjects();
  return <FeaturedProjectsClient projects={projects} />;
}
