/**
 * Streaming loading UI for /projects/[slug]
 *
 * Shown while getProjectBySlug() resolves on the server.
 * Keeps the background white so the page-transition reveal is never
 * exposed to an empty or dark canvas.
 */
export default function ProjectPageLoading() {
  return (
    <div className="relative min-h-screen bg-white text-neutral-900 pt-16 sm:pt-20 md:pt-24 lg:pt-28">
      <div className="relative z-20 mx-auto mt-16 sm:mt-0 max-w-6xl px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {/* Back button skeleton */}
        <div className="h-10 w-40 animate-pulse rounded-xl bg-neutral-100" />
      </div>

      <section className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:pt-16 lg:pb-20">
        <div className="flex w-full flex-col items-center gap-8 sm:gap-12 lg:flex-row lg:items-start lg:gap-16">
          {/* Left column skeleton */}
          <div className="w-full space-y-4 lg:flex-[1.5]">
            <div className="h-10 w-3/4 animate-pulse rounded-xl bg-neutral-100" />
            <div className="h-5 w-1/2 animate-pulse rounded-lg bg-neutral-100" />
            <div className="flex flex-wrap gap-2">
              <div className="h-8 w-24 animate-pulse rounded-lg bg-neutral-100" />
              <div className="h-8 w-20 animate-pulse rounded-lg bg-neutral-100" />
            </div>
            <div className="space-y-2 pt-2">
              <div className="h-4 w-full animate-pulse rounded bg-neutral-100" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-neutral-100" />
              <div className="h-4 w-4/6 animate-pulse rounded bg-neutral-100" />
            </div>
          </div>

          {/* Right column (image area) skeleton */}
          <div className="w-full lg:flex-[0.85]">
            <div className="aspect-square w-full animate-pulse rounded-3xl bg-neutral-100" />
          </div>
        </div>
      </section>
    </div>
  );
}
