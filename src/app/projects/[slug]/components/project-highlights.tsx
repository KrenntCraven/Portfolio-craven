/**
 * ProjectHighlights — key features as editorial callout cards. Server Component.
 */
import { parseInline } from "./rich-text";
import { SectionShell } from "./section-shell";

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 10.5l3.5 3.5L15 6.5"
      />
    </svg>
  );
}

export function ProjectHighlights({ features }: { features?: string[] }) {
  if (!features?.length) return null;

  return (
    <SectionShell eyebrow="What it does" title="Key features">
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {features.map((feature, i) => (
          <li
            key={i}
            className="group flex items-start gap-4 rounded-2xl border border-neutral-200/70 bg-white/70 p-5 shadow-[0_10px_40px_-28px_rgba(15,23,42,0.35)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#6c5ce7]/30 hover:shadow-[0_20px_55px_-26px_rgba(108,92,231,0.28)]"
          >
            <span
              aria-hidden
              className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#6c5ce7]/10 text-[#6c5ce7] transition-transform duration-200 group-hover:scale-110"
            >
              <CheckIcon className="h-4 w-4" />
            </span>
            <span className="text-base leading-relaxed text-neutral-600 transition-colors duration-200 group-hover:text-neutral-800">
              {parseInline(feature)}
            </span>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}
