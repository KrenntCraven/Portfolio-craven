"use client";
import { FeaturedSlugDesign } from "@/app/frontend/featured[slug]_Design";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { getProjectBySlug, type Project } from "../../backend/contentful_init";

type PageProps = { params: Promise<{ slug: string }> };

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

export default function ProjectPage({ params }: PageProps) {
  const [project, setProject] = useState<Project | null>(null);
  const [slug, setSlug] = useState<string>("");

  useEffect(() => {
    params.then((p) => {
      setSlug(p.slug);
      getProjectBySlug(p.slug).then((data) => {
        if (!data) notFound();
        setProject(data);
      });
    });
  }, [params]);

  if (!project) return null;

  // Convert projectType to array if it's not already
  const projectTypes = Array.isArray(project.projectType)
    ? project.projectType
    : project.projectType
      ? [project.projectType]
      : [];

  // Convert technologies to array if it's not already
  const technologies = Array.isArray(project.technologies)
    ? project.technologies
    : project.technologies
      ? [project.technologies]
      : [];

  // Convert keyFeatures to array if it's not already
  const keyFeatures = Array.isArray(project.keyFeatures)
    ? project.keyFeatures
    : project.keyFeatures
      ? [project.keyFeatures]
      : [];

  return (
    <main className="relative min-h-screen overflow-hidden bg-white text-neutral-900 pt-16 sm:pt-20 md:pt-24 lg:pt-28">
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,0,0,0.05),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(0,0,0,0.03),transparent_28%)]" />
        <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-black/5 via-transparent to-transparent" />
        <div className="absolute inset-x-12 sm:inset-x-24 bottom-[-12rem] h-72 rounded-[36px] bg-black/5 blur-3xl" />
      </div>

      {/* Back button */}
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to projects
        </Link>
      </div>

      <section className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:pt-16 lg:pb-20">
        <div className="flex w-full flex-col items-center gap-8 sm:gap-12 lg:flex-row lg:items-start lg:gap-16">
          {/* Left Column - Content */}
          <motion.div
            {...fadeUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.1, duration: 0.7 }}
            className="w-full lg:flex-[1.5]"
          >
            <div className="w-full space-y-4">
              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl lg:text-5xl"
              >
                {project.title}
              </motion.h1>

              {/* Headline */}
              {project.headline && (
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="text-lg text-neutral-700 sm:text-xl leading-relaxed max-w-md"
                >
                  {project.headline}
                </motion.p>
              )}

              {/* Project Type */}
              {projectTypes.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="flex flex-wrap gap-2"
                >
                  {projectTypes.map((type, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center rounded-full bg-neutral-200 px-4 py-1.5 text-sm font-medium text-neutral-900 border border-neutral-300"
                    >
                      {type}
                    </span>
                  ))}
                </motion.div>
              )}

              {/* Key Features */}
              {keyFeatures.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="space-y-4"
                >
                  <h2 className="text-2xl font-semibold text-neutral-900">
                    Key Features
                  </h2>
                  <ul className="space-y-3">
                    {keyFeatures.map((feature, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: 0.6 + index * 0.05,
                          duration: 0.4,
                        }}
                        className="flex items-start gap-3 text-base text-neutral-700 leading-relaxed"
                      >
                        <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-neutral-500" />
                        <span>{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Role */}
              {project.role && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className="space-y-2"
                >
                  <h3 className="text-lg font-semibold text-neutral-900">
                    Role
                  </h3>
                  <p className="text-base text-neutral-700">{project.role}</p>
                </motion.div>
              )}

              {/* Technologies */}
              {technologies.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="space-y-3"
                >
                  <h3 className="text-lg font-semibold text-neutral-900">
                    Technologies
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center rounded-lg bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Right Column - Hero Image */}
          <motion.div
            {...fadeUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.2, duration: 0.7 }}
            className="w-full lg:flex-[0.85]"
          >
            <div className="relative flex flex-col items-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-none"
              >
                {project.imageUrl ? (
                  <div className="relative aspect-square w-full rounded-2xl sm:rounded-3xl">
                    {/* SVG Background */}
                    <div className="absolute inset-0 flex items-center justify-center overflow-visible">
                      <FeaturedSlugDesign />
                    </div>

                    {/* Image on top */}
                    <div className="relative aspect-square w-full overflow-hidden rounded-2xl sm:rounded-3xl select-none">
                      <Image
                        src={project.imageUrl}
                        alt={project.title}
                        fill
                        className="object-contain relative z-10 select-none pointer-events-none p-12 sm:p-8 md:p-10 lg:p-0"
                        priority
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex aspect-square w-full items-center justify-center rounded-2xl sm:rounded-3xl border-2 sm:border-4 border-white/50 bg-gradient-to-br from-neutral-100 via-neutral-50 to-white shadow-xl sm:shadow-2xl">
                    <div className="flex h-24 w-24 sm:h-32 sm:w-32 items-center justify-center rounded-xl sm:rounded-2xl border border-neutral-200 bg-white text-4xl sm:text-5xl font-bold text-neutral-700 shadow-lg">
                      {project.title.charAt(0).toUpperCase()}
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
