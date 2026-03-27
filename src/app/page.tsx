import { Suspense } from "react";
import LandingPage from "./frontend/home/landing-page";
import FeaturedProjectsWrapper from "./backend/featured_projectsClient";

function ProjectsFallback() {
  return (
    <div className="relative min-h-screen bg-white pb-24" aria-hidden>
      <section className="mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 sm:pb-24 sm:pt-20 lg:px-8 lg:pb-28 lg:pt-28">
        <div className="mb-4 mx-auto h-10 w-64 animate-pulse rounded-xl bg-neutral-100" />
        <div className="mb-12 mx-auto h-5 w-96 max-w-full animate-pulse rounded-lg bg-neutral-100 lg:mb-16" />
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {[1, 2, 3].map((n) => (
            <div key={n} className="overflow-hidden rounded-3xl border border-neutral-100 bg-white">
              <div className="aspect-16/10 w-full animate-pulse bg-neutral-100" />
              <div className="p-5 space-y-3">
                <div className="h-6 w-3/4 animate-pulse rounded-lg bg-neutral-100" />
                <div className="h-4 w-full animate-pulse rounded bg-neutral-50" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-neutral-50" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
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
