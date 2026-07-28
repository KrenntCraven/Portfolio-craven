/**
 * QuickMetrics — headline "by the numbers" stat cards from `impactStats`.
 * Server Component; renders nothing when a project has no stats.
 */
import type { ImpactStat } from "../../../backend/types";
import { SectionShell } from "./section-shell";

// Long values (e.g. "50/30/20", "$0.01") would overflow the narrow card at the
// display size, so step the type down as the string grows.
function valueSizeClass(value: string) {
  if (value.length > 9) return "text-lg sm:text-xl";
  if (value.length > 6) return "text-xl sm:text-2xl";
  if (value.length > 4) return "text-2xl sm:text-3xl";
  return "text-3xl sm:text-4xl";
}

/**
 * The cards on their own, without the editorial section wrapper, so the
 * Contentful project layout can render them under its own heading style.
 */
export function MetricCards({ stats }: { stats: ImpactStat[] }) {
  return (
    <dl className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="flex h-full min-w-0 flex-col rounded-2xl border border-[#6c5ce7]/20 bg-linear-to-br from-[#6c5ce7]/5 to-white p-5 shadow-[0_10px_40px_-28px_rgba(108,92,231,0.4)] transition-shadow duration-300 hover:shadow-[0_20px_50px_-26px_rgba(108,92,231,0.35)]"
        >
          <dt className="sr-only">{stat.label}</dt>
          <dd className="min-w-0">
            <p
              className={`wrap-break-word font-bold leading-tight tracking-tight text-[#6c5ce7] ${valueSizeClass(
                stat.value,
              )}`}
            >
              {stat.value}
            </p>
            <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-neutral-700">
              {stat.label}
            </p>
            {stat.description && (
              <p className="mt-1.5 text-xs leading-snug text-neutral-500">
                {stat.description}
              </p>
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function QuickMetrics({ stats }: { stats?: ImpactStat[] }) {
  if (!stats?.length) return null;

  return (
    <SectionShell eyebrow="By the numbers" title="Quick metrics">
      <MetricCards stats={stats} />
    </SectionShell>
  );
}
