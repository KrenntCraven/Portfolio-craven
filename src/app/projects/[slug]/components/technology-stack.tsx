/**
 * TechnologyStack — the full, modern technology badge showcase. Server Component.
 */
import { SectionShell } from "./section-shell";

export function TechnologyStack({
  technologies,
}: {
  technologies?: string[];
}) {
  if (!technologies?.length) return null;

  return (
    <SectionShell eyebrow="Built with" title="Technology stack">
      <ul className="flex flex-wrap gap-2.5 sm:gap-3">
        {technologies.map((tech, i) => (
          <li
            key={i}
            className="group inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 shadow-[0_8px_24px_-18px_rgba(15,23,42,0.5)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#6c5ce7]/40 hover:text-neutral-900"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#6c5ce7] transition-transform duration-200 group-hover:scale-125" />
            {tech}
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}
