/**
 * CloudProof — the bridge between the "cloud engineer" claim in the hero and the
 * application projects below it. Server Component; the only client cost is the
 * thin `Reveal` motion boundary.
 */
import Link from "next/link";
import { certifications } from "../../about/certification-data";
import { ArrowRightIcon, Eyebrow, ExternalIcon, FOCUS_RING } from "../project-ui";
import { Reveal } from "../reveal";
import { cloudHighlights } from "./cloud-proof-data";

/** Long text metrics ("Event-driven") need to step down to sit beside "1M+". */
function metricSizeClass(metric: string) {
  if (metric.length > 8) return "text-2xl sm:text-3xl";
  if (metric.length > 5) return "text-3xl sm:text-4xl";
  return "text-4xl sm:text-5xl";
}

const CHIP =
  "rounded-full border border-neutral-200/70 bg-neutral-50 px-2.5 py-1 text-xs font-medium text-neutral-600";

export default function CloudProof() {
  return (
    <section
      id="cloud"
      aria-labelledby="cloud-proof-heading"
      className="relative scroll-mt-24 bg-neutral-50/70"
    >
      {/* Hairline dividers separate this band from the hero above and the
          projects below without competing with either section's treatment. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-neutral-200 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-neutral-200 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-10 left-1/2 h-64 w-176 max-w-[90vw] -translate-x-1/2 rounded-full bg-[#6c5ce7]/5 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <Eyebrow className="justify-center">Cloud &amp; infrastructure</Eyebrow>
            <h2
              id="cloud-proof-heading"
              className="mt-4 text-3xl font-semibold tracking-tight text-neutral-800 sm:text-4xl"
            >
              Production cloud work, at telecom scale
            </h2>
            <p className="mt-4 text-base text-neutral-600 sm:text-lg">
              The projects below are things I built end to end. This is the
              infrastructure work behind the title — migrating and operating
              production platforms on AWS at Amdocs.
            </p>
          </div>
        </Reveal>

        {/* Matches the featured-projects grid. At the 2-column breakpoint the
            trailing card spans both so it doesn't sit alone as a half-width orphan. */}
        <ul className="mt-12 grid grid-cols-1 gap-6 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {cloudHighlights.map((item, i) => (
            <li
              key={item.title}
              className="flex sm:last:col-span-2 lg:last:col-span-1"
            >
              <Reveal delay={i * 0.08} className="flex w-full">
                <article className="group flex h-full w-full flex-col rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-[0_10px_40px_-24px_rgba(15,23,42,0.35)] transition-all duration-300 hover:border-[#6c5ce7]/30 hover:shadow-[0_28px_70px_-32px_rgba(108,92,231,0.35)] sm:p-7">
                  <p
                    className={`wrap-break-word font-bold leading-none tracking-tight text-[#6c5ce7] ${metricSizeClass(
                      item.metric,
                    )}`}
                  >
                    {item.metric}
                  </p>
                  <p className="mt-2 text-xs font-medium uppercase tracking-wider text-neutral-500">
                    {item.metricLabel}
                  </p>

                  <h3 className="mt-5 text-lg font-semibold text-neutral-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 grow text-sm leading-relaxed text-neutral-600">
                    {item.detail}
                  </p>

                  <ul
                    aria-label={`Services used: ${item.title}`}
                    className="mt-5 flex flex-wrap items-center gap-2"
                  >
                    {item.services.map((service) => (
                      <li key={service} className={CHIP}>
                        {service}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal delay={0.12}>
          <div className="mt-8 rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-[0_10px_40px_-24px_rgba(15,23,42,0.35)] sm:mt-10 sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
              <div className="lg:max-w-xs">
                <p className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
                  {certifications.length} certifications
                </p>
                <p className="mt-1.5 text-sm text-neutral-600">
                  Across AWS, Google Cloud, and Azure — each one independently
                  verifiable.
                </p>
              </div>

              <ul className="flex flex-wrap gap-2 lg:justify-end">
                {certifications.map((cert) => {
                  const label = cert.short ?? cert.title;
                  const href = "link" in cert ? cert.link : undefined;

                  if (!href) {
                    return (
                      <li key={cert.title} className={CHIP}>
                        {label}
                      </li>
                    );
                  }

                  return (
                    <li key={cert.title}>
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Verify ${cert.title} (opens in a new tab)`}
                        className={`inline-flex items-center gap-1.5 ${CHIP} transition-colors duration-200 hover:border-[#6c5ce7]/40 hover:bg-[#6c5ce7]/5 hover:text-[#6c5ce7] ${FOCUS_RING}`}
                      >
                        {label}
                        <ExternalIcon className="h-3 w-3 opacity-50" />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="mt-6 border-t border-neutral-100 pt-5">
              <Link
                href="/about#experience"
                className={`group inline-flex items-center gap-2 text-sm font-semibold text-[#6c5ce7] transition-colors hover:text-[#5a4bd1] ${FOCUS_RING} rounded-sm`}
              >
                See the full experience and credentials
                <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
