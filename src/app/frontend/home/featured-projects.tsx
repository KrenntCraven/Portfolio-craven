"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

// Define the Project type
type Project = { id: string; title: string; imageUrl?: string; slug: string };

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
  return (
    <main className="relative min-h-screen overflow-hidden bg-white text-neutral-900">
      <section className="relative mx-auto flex max-w-xl flex-col items-center gap-8 px-4 pb-16 pt-16 sm:gap-10 sm:px-6 sm:pb-20 sm:pt-20 lg:max-w-6xl lg:gap-14 lg:px-8 lg:pb-24 lg:pt-28 xl:max-w-7xl">
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
            className="relative grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 md:grid-cols-3 lg:grid-cols-4 lg:gap-10"
          >
            {projects.map((project) => (
              <motion.article
                key={project.id}
                variants={fadeUp}
                transition={{ duration: 0.55, ease: "easeOut" }}
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.99 }}
                className="group relative mx-auto w-full max-w-lg rounded-[24px] border border-black/10 bg-white/60 p-4 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.55] backdrop-blur-xl transition-shadow hover:shadow-[0_30px_90px_-50px_rgba(0,0,0,0.65)] sm:rounded-[28px] sm:p-6"
              >
                {/* subtle surface */}
                <div className="pointer-events-none absolute inset-0 rounded-[24px] bg-[linear-gradient(120deg,rgba(255,255,255,0.55),transparent_48%),radial-gradient(circle_at_28%_18%,rgba(0,0,0,0.06),transparent_42%)] opacity-90 transition-opacity group-hover:opacity-100 sm:rounded-[28px]" />

                <div className="relative flex flex-col items-center gap-4 sm:gap-6">
                  <div className="relative w-full overflow-hidden rounded-xl border border-white/70 bg-gradient-to-br from-white via-[#f7f7f7] to-black/10 shadow-inner ring-1 ring-black/5 sm:rounded-2xl">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="relative block aspect-square w-full"
                    >
                      {project.imageUrl ? (
                        <>
                          <Image
                            src={project.imageUrl}
                            alt={project.title}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                          />
                          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.22),transparent_55%)] opacity-70" />
                        </>
                      ) : (
                        <div className="absolute inset-0 grid place-items-center">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-black/10 bg-white/70 text-lg font-semibold text-neutral-700 shadow-sm sm:h-14 sm:w-14 sm:rounded-2xl sm:text-xl">
                            {firstTextCapitalize(
                              project.title?.trim()?.[0] ?? "P",
                            )}
                          </div>
                        </div>
                      )}
                    </Link>
                  </div>

                  <div className="w-full rounded-xl border border-black/10 bg-white/80 px-4 py-3 text-center shadow-sm transition-colors group-hover:bg-white sm:rounded-2xl sm:px-5 sm:py-4">
                    <div className="line-clamp-2 text-sm font-semibold tracking-tight text-neutral-900 sm:text-base">
                      {firstTextCapitalize(project.title)}
                    </div>
                    <div className="mt-1 text-[0.65rem] text-neutral-600 sm:text-xs">
                      Featured project
                    </div>
                    <Link
                      href={`/projects/${project.slug}`}
                      className="mt-2.5 inline-flex items-center justify-center rounded-full border border-black/10 px-3.5 py-1.5 text-[0.65rem] font-semibold text-neutral-900 transition-colors hover:bg-black hover:text-white sm:mt-3 sm:px-4 sm:py-2 sm:text-xs"
                    >
                      View project
                    </Link>
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
