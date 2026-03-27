/**
 * Streaming loading UI for /projects/[slug]/casestudy
 * Shows a skeleton matching the hero + section nav pills + content cards.
 */
export default function CaseStudyLoading() {
  return (
    <div className="relative min-h-screen bg-white text-neutral-900 pt-16 sm:pt-20 md:pt-24 lg:pt-28">
      {/* Back button */}
      <div className="relative z-20 mx-auto mt-16 sm:mt-0 max-w-6xl px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <div className="h-10 w-40 animate-pulse rounded-xl bg-neutral-100" />
      </div>

      {/* Hero skeleton */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:pt-20 lg:pb-12">
        <div className="mx-auto max-w-3xl space-y-5">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-neutral-200" />
            <div className="h-2 w-2 animate-pulse rounded-full bg-neutral-150" />
            <div className="h-2 w-2 animate-pulse rounded-full bg-neutral-100" />
            <div className="h-4 w-24 animate-pulse rounded bg-neutral-100" />
          </div>
          <div className="h-12 w-3/4 animate-pulse rounded-xl bg-neutral-100" />

          {/* Nav pills skeleton */}
          <div className="flex flex-wrap gap-2">
            {[80, 64, 104, 96, 112].map((w, i) => (
              <div
                key={i}
                className="h-8 animate-pulse rounded-full bg-neutral-100"
                style={{ width: w }}
              />
            ))}
          </div>
          <div className="h-px w-full bg-neutral-100" />
        </div>
      </section>

      {/* Content section skeletons */}
      {[1, 2].map((n) => (
        <section key={n} className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
          <div className="mx-auto max-w-3xl space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-1 w-12 animate-pulse rounded-full bg-neutral-200" />
              <div className="h-4 w-28 animate-pulse rounded bg-neutral-100" />
            </div>
            <div className="h-8 w-1/2 animate-pulse rounded-xl bg-neutral-100" />
            <div className="rounded-2xl border border-neutral-100 p-6 sm:p-8 space-y-3">
              <div className="h-4 w-full animate-pulse rounded bg-neutral-100" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-neutral-100" />
              <div className="h-4 w-4/6 animate-pulse rounded bg-neutral-100" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-neutral-100" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-neutral-100" />
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
