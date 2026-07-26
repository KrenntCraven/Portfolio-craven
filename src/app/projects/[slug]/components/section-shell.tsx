/**
 * SectionShell — consistent editorial section scaffolding: an optional eyebrow +
 * heading, wrapped in a scroll `Reveal`. Server Component; the only client cost
 * is the thin Reveal boundary.
 */
import type { ReactNode } from "react";
import { Eyebrow } from "../../../frontend/project-ui";
import { Reveal } from "./reveal";

export function SectionShell({
  id,
  eyebrow,
  title,
  children,
  className,
}: {
  id?: string;
  eyebrow?: string;
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`scroll-mt-28 ${className ?? ""}`}>
      <Reveal>
        {(eyebrow || title) && (
          <div className="mb-6 space-y-3 sm:mb-8">
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            {title && (
              <h2 className="text-2xl font-bold tracking-tight text-neutral-800 sm:text-3xl lg:text-[2.5rem] lg:leading-[1.15]">
                {title}
              </h2>
            )}
          </div> 
        )}
        {children}
      </Reveal>
    </section>
  );
}
