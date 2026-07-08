/**
 * Streaming loading UI for /projects/[slug]
 *
 * Shown while getProjectBySlug() resolves on the server.
 * Mirrors the real page layout (hero + feature grid) so the transition
 * from skeleton to content is seamless, and keeps the background white so
 * the page-transition reveal is never exposed to an empty or dark canvas.
 */
export default function ProjectPageLoading() {
  return (
    <div className="relative min-h-screen bg-white text-neutral-900 pt-16 sm:pt-20 md:pt-24 lg:pt-28">
      {/* Back button skeleton */}
      <div className="relative z-20 mx-auto mt-16 sm:mt-0 max-w-6xl px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <div className="h-10 w-40 animate-pulse rounded-xl bg-neutral-100" />
      </div>

      {/* Hero skeleton */}
      <section className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:pt-16 lg:pb-20">
        <div className="flex w-full flex-col items-center gap-8 sm:gap-12 lg:flex-row lg:items-center lg:gap-16">
          {/* Left column */}
          <div className="w-full space-y-5 lg:flex-[1.4]">
            {/* Eyebrow */}
            <div className="flex items-center gap-3">
              <div className="h-1 w-10 animate-pulse rounded-full bg-neutral-200" />
              <div className="h-3 w-28 animate-pulse rounded bg-neutral-100" />
            </div>
            {/* Title */}
            <div className="h-11 w-3/4 animate-pulse rounded-xl bg-neutral-100" />
            {/* Headline */}
            <div className="space-y-2">
              <div className="h-5 w-full max-w-md animate-pulse rounded-lg bg-neutral-100" />
              <div className="h-5 w-2/3 animate-pulse rounded-lg bg-neutral-100" />
            </div>
            {/* Meta chips */}
            <div className="flex flex-wrap gap-2 pt-1">
              <div className="h-8 w-32 animate-pulse rounded-lg bg-neutral-100" />
              <div className="h-8 w-24 animate-pulse rounded-lg bg-neutral-100" />
            </div>
            {/* CTAs */}
            <div className="flex flex-wrap gap-3 pt-2">
              <div className="h-11 w-40 animate-pulse rounded-xl bg-neutral-100" />
              <div className="h-11 w-32 animate-pulse rounded-xl bg-neutral-100" />
            </div>
          </div>

          {/* Right column (image area) */}
          <div className="w-full lg:flex-[0.9]">
            <div className="aspect-square w-full animate-pulse rounded-3xl bg-neutral-100" />
          </div>
        </div>
      </section>

      {/* Feature grid skeleton */}
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto h-px max-w-6xl bg-linear-to-r from-transparent via-neutral-200 to-transparent" />
        <div className="py-12 sm:py-16">
          <div className="mb-8 space-y-3">
            <div className="h-3 w-24 animate-pulse rounded bg-neutral-100" />
            <div className="h-8 w-52 animate-pulse rounded-lg bg-neutral-100" />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="h-20 animate-pulse rounded-2xl border border-neutral-100 bg-neutral-50"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
