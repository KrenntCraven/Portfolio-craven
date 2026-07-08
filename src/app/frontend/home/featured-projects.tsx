"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { BannerBackground } from "../banner-background";
import { usePageTransition } from "../page-transition/page-transition";
import { ArrowRightIcon } from "../project-ui";

// Define the Project type
type Project = {
  id: string;
  title: string;
  imageUrl?: string;
  slug: string;
  coverPageUrl?: string;
  projectType?: string | string[];
  technologies?: string | string[];
};

// Normalize a Contentful field that may be a single value, an array, or a
// comma-separated string ("React Native, Firebase,") into clean tags.
const toTags = (value?: string | string[]): string[] => {
  const arr = Array.isArray(value) ? value : value ? [value] : [];
  return arr
    .flatMap((v) => v.split(","))
    .map((v) => v.trim())
    .filter(Boolean);
};

// Curated per-project tag lists (overrides the raw Contentful fields so the
// featured cards show a consistent, hand-picked stack). Keyed by slug.
const TAG_OVERRIDES: Record<string, string[]> = {
  onesync: ["Full-Stack", "Flutter", "Node.js", "Firebase", "RFID/Hardware"],
  sagip: ["Full-Stack", "React Native", "Firebase", "Google Maps API"],
  "ang-pamantasan": ["Full-Stack", "Next.js", "Contentful", "GraphQL"],
  "g-connect": ["Full-Stack", "Next.js", "API Design", "Vercel"],
};

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
};
const gridStagger = {
  initial: {},
  animate: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

// Capitalizes the first letter of a given text
const firstTextCapitalize = (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1);

export default function FeaturedProjectsClient({
  projects = [],
}: {
  projects: Project[];
}) {
  const [clickedProject, setClickedProject] = useState<string | null>(null);
  const { startTransition } = usePageTransition();

  const handleProjectClick = (e: React.MouseEvent, slug: string) => {
    e.preventDefault();
    setClickedProject(slug);
    startTransition(`/projects/${slug}`);
  };

  return (
    <div className="relative min-h-screen overflow-visible bg-white text-neutral-900 pb-24">
      <BannerBackground />

      {/* Section background treatment — depth + separation from the hero */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        {/* Faint panel tint so the section reads as its own surface */}
        <div className="absolute inset-0 bg-linear-to-b from-neutral-50/80 via-white/0 to-neutral-50/60" />

        {/* Developer grid — masked to fade toward the edges */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(108,92,231,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(108,92,231,0.05) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage:
              "radial-gradient(ellipse 80% 55% at 50% 22%, #000 30%, transparent 80%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 55% at 50% 22%, #000 30%, transparent 80%)",
          }}
        />

        {/* Soft accent glow behind the heading */}
        <div className="absolute -top-8 left-1/2 h-72 w-176 max-w-[90vw] -translate-x-1/2 rounded-full bg-[#6c5ce7]/6 blur-3xl" />

        {/* Hairline divider from the hero above */}
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-neutral-200 to-transparent" />
      </div>

      <section
        id="projects"
        className="relative mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 sm:pb-24 sm:pt-20 lg:px-8 lg:pb-28 lg:pt-28"
      >
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-4 text-center text-4xl font-semibold text-neutral-800 sm:text-5xl lg:mb-6"
        >
          Featured Projects
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12 text-center text-base text-neutral-600 sm:text-lg lg:mb-16 max-w-3xl mx-auto lg:whitespace-nowrap"
        >
          A collection of projects I&apos;ve built, focusing on real-world
          problems and scalable solutions
        </motion.h2>

        <motion.div
          {...fadeUp}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.1, duration: 0.7 }}
          className="w-full"
        >
          <motion.div
            {...gridStagger}
            initial="initial"
            animate="animate"
            className="relative grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10"
          >
          {projects.map((project) => {
            const override = TAG_OVERRIDES[project.slug];
            // Category (metadata, e.g. "Full-Stack") is emphasised separately
            // from the technology stack for a clearer information hierarchy.
            const category = override
              ? override.slice(0, 1)
              : toTags(project.projectType);
            const stack = override
              ? override.slice(1)
              : toTags(project.technologies);
            const MAX_STACK = 3;
            const visibleStack = stack.slice(0, MAX_STACK);
            const hiddenStack = stack.length - visibleStack.length;
            return (
            <motion.article
              key={project.id}
                variants={fadeUp}
                transition={{ duration: 0.55, ease: "easeOut" }}
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.99 }}
                onClick={(e) => handleProjectClick(e, project.slug)}
                className="group relative flex cursor-pointer flex-col overflow-hidden rounded-3xl border border-neutral-200/80 bg-white shadow-[0_10px_40px_-24px_rgba(15,23,42,0.35)] transition-all duration-300 hover:border-[#6c5ce7]/30 hover:shadow-[0_28px_70px_-32px_rgba(108,92,231,0.35)]"
              >
                {/* Project Image */}
                <div className="relative aspect-4/3 w-full overflow-hidden bg-linear-to-br from-neutral-100 via-neutral-50 to-white">
                  {category[0] && (
                    <span className="absolute left-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#6c5ce7] shadow-sm backdrop-blur">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#6c5ce7]" />
                      {category[0]}
                    </span>
                  )}
                  {project.coverPageUrl ? (
                    <>
                      <Image
                        src={`${project.coverPageUrl}?fm=webp&fit=fill`}
                        alt={project.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        quality={85}
                        loading="lazy"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent" />
                    </>
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-neutral-200 bg-white text-3xl font-bold text-neutral-700 shadow-lg">
                        {firstTextCapitalize(project.title?.trim()?.[0] ?? "P")}
                      </div>
                    </div>
                  )}
                </div>

                {/* Project Info */}
                <div className="flex flex-1 flex-col gap-4 p-6 sm:p-7">
                  <h3 className="line-clamp-2 text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl">
                    {firstTextCapitalize(project.title)}
                  </h3>

                  {visibleStack.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                      {visibleStack.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full border border-neutral-200/70 bg-neutral-50 px-2.5 py-1 text-xs font-medium text-neutral-600"
                        >
                          {tech}
                        </span>
                      ))}
                      {hiddenStack > 0 && (
                        <span className="text-xs font-medium text-neutral-400">
                          +{hiddenStack} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* CTA */}
                  <div className="mt-auto flex items-center gap-1.5 pt-1 text-sm font-semibold text-[#6c5ce7]">
                    View project
                    <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </motion.article>
            );
          })}
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
