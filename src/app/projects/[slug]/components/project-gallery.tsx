/**
 * ProjectGallery — responsive, lazy-loaded screenshot section with captions.
 * Renders nothing when a project has no gallery. Server Component; the
 * clickable thumbnails + lightbox modal live in the ProjectGalleryGrid client
 * child so the scaffolding stays server-rendered.
 */
import type { GalleryImage } from "../../../backend/types";
import { ProjectGalleryGrid } from "./project-gallery-grid";
import { SectionShell } from "./section-shell";

export function ProjectGallery({ images }: { images?: GalleryImage[] }) {
  if (!images?.length) return null;

  return (
    <SectionShell eyebrow="Gallery" title="A closer look">
      <ProjectGalleryGrid images={images} />
    </SectionShell>
  );
}
