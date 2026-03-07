import { Suspense } from "react";
import LandingPage from "./frontend/home/landing-page";
import FeaturedProjectsWrapper from "./backend/featured_projectsClient";

function ProjectsFallback() {
  return (
    <div className="min-h-screen w-full animate-pulse bg-neutral-50" aria-hidden />
  );
}

export default function Home() {
  return (
    <>
      <LandingPage />
      <div id="projects">
        <Suspense fallback={<ProjectsFallback />}>
          <FeaturedProjectsWrapper />
        </Suspense>
      </div>
    </>
  );
}
