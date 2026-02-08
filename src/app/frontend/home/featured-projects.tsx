"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { usePageTransition } from "../page-transition/page-transition";

// Define the Project type
type Project = {
  id: string;
  title: string;
  imageUrl?: string;
  slug: string;
  coverPageUrl?: string;
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
    <main className="relative min-h-screen overflow-visible bg-white text-neutral-900 pb-24">
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,0,0,0.05),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(0,0,0,0.03),transparent_28%)]" />
        <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-black/5 via-transparent to-transparent" />
        <div className="absolute inset-x-12 sm:inset-x-24 bottom-[-12rem] h-72 rounded-[36px] bg-black/5 blur-3xl" />
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
            {projects.map((project) => (
              <motion.article
                key={project.id}
                variants={fadeUp}
                transition={{ duration: 0.55, ease: "easeOut" }}
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => handleProjectClick(e, project.slug)}
                className="group relative overflow-hidden rounded-3xl border border-slate-200/70 bg-gradient-to-br from-white via-slate-50 to-slate-100/70 shadow-[0_18px_60px_-35px_rgba(15,23,42,0.55)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_26px_70px_-30px_rgba(15,23,42,0.45)] cursor-pointer"
              >
                {/* Card shine effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/35 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/40" />

                <div className="relative">
                  {/* Project Image */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-neutral-100 via-neutral-50 to-white">
                    <div className="relative h-full w-full">
                      <div className="absolute left-4 top-4 z-10 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600 shadow-sm">
                        Featured
                      </div>
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
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-60" />
                        </>
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-neutral-200 bg-white text-3xl font-bold text-neutral-700 shadow-lg">
                            {firstTextCapitalize(
                              project.title?.trim()?.[0] ?? "P",
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Project Info */}
                  <div className="relative p-6 sm:p-8">
                    <div className="mb-3 flex items-center gap-2 text-xs font-medium text-[#6c5ce7]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#6c5ce7]" />
                      <span>Case study</span>
                      <span className="h-1.5 w-1.5 rounded-full bg-[#6c5ce7]" />
                      <span>UI/UX</span>
                    </div>
                    <h3 className="mb-2 line-clamp-2 text-xl font-semibold text-neutral-900 sm:text-2xl">
                      {firstTextCapitalize(project.title)}
                    </h3>
                    <p className="text-sm text-neutral-600 sm:text-base">
                      Featured project
                    </p>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}
