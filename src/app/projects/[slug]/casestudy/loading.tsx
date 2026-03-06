/**
 * Streaming loading UI for /projects/[slug]/casestudy
 * Matches the same white-background pattern as the parent slug loading state.
 */
export default function CaseStudyLoading() {
  return (
    <div className="relative min-h-screen bg-white text-neutral-900 pt-16 sm:pt-20 md:pt-24 lg:pt-28">
      <div className="relative z-20 mx-auto mt-16 sm:mt-0 max-w-6xl px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <div className="h-10 w-40 animate-pulse rounded-xl bg-neutral-100" />
      </div>
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-6">
        <div className="h-10 w-2/3 animate-pulse rounded-xl bg-neutral-100" />
        <div className="space-y-3">
          <div className="h-4 w-full animate-pulse rounded bg-neutral-100" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-neutral-100" />
          <div className="h-4 w-4/6 animate-pulse rounded bg-neutral-100" />
        </div>
      </section>
    </div>
  );
}
