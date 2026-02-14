"use client";
import { FeaturedSlugDesign } from "@/app/frontend/featured[slug]_Design";
import { usePageTransition } from "@/app/frontend/page-transition/page-transition";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getProjectBySlug, type Project } from "../../backend/contentful_init";

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

// Helper function to parse bold markdown syntax
const parseBold = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

export default function ProjectPage() {
  const { startTransition } = usePageTransition();
  const [project, setProject] = useState<Project | null>(null);
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;
  const [imageAspectRatio, setImageAspectRatio] =
    useState<string>("aspect-square");
  const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);

  // Scroll to top when navigating to this project (e.g. from featured projects)
  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "instant" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 50);
    return () => clearTimeout(timer);
  }, [slug]);

  useEffect(() => {
    if (!slug) return;
    setIsImageLoaded(false);
    getProjectBySlug(slug).then((data) => {
      if (!data) notFound();
      setProject(data);
      if (data.imageUrl) {
        setImageAspectRatio("aspect-square");
        const img = new window.Image();
        img.src = data.imageUrl;
        img.onload = () => {
          const aspectRatio = img.width / img.height;
          // More precise aspect ratio detection
          if (aspectRatio >= 1.3) {
            // Wide landscape images (16:9, etc.)
            setImageAspectRatio("aspect-video");
          } else if (aspectRatio >= 0.9 && aspectRatio < 1.3) {
            // Nearly square images (including 579x534 = 1.08)
            setImageAspectRatio("aspect-square");
          } else {
            // Portrait images
            setImageAspectRatio("aspect-[4/5]");
          }
          setIsImageLoaded(true);
        };
      } else {
        setIsImageLoaded(true);
      }
    });
  }, [slug]);

  const projectTypes = project
    ? Array.isArray(project.projectType)
      ? project.projectType
      : project.projectType
        ? [project.projectType]
        : []
    : [];
  const technologies = project
    ? Array.isArray(project.technologies)
      ? project.technologies
      : project.technologies
        ? [project.technologies]
        : []
    : [];
  const keyFeatures = project
    ? Array.isArray(project.keyFeatures)
      ? project.keyFeatures
      : project.keyFeatures
        ? [project.keyFeatures]
        : []
    : [];

  return (
    <AnimatePresence mode="wait">
      {!project ? (
        <motion.div
          key="loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } }}
          className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-white text-neutral-900"
        >
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,0,0,0.05),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(0,0,0,0.03),transparent_28%)]" />
            <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-black/5 via-transparent to-transparent" />
          </div>
          <div className="relative z-10 flex flex-col items-center gap-6">
            <div className="flex items-end justify-center gap-1.5 h-10">
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  className="w-1.5 rounded-full bg-neutral-800 origin-bottom"
                  style={{ height: 24 }}
                  initial={{ scaleY: 0, opacity: 0.6 }}
                  animate={{ scaleY: 1, opacity: 1 }}
                  transition={{
                    delay: i * 0.08,
                    duration: 0.4,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />
              ))}
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.3 }}
              className="text-sm font-medium text-neutral-500"
            >
              Loading project
            </motion.p>
          </div>
        </motion.div>
      ) : (
        <motion.main
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="relative min-h-screen overflow-hidden bg-white text-neutral-900 pt-16 sm:pt-20 md:pt-24 lg:pt-28"
        >
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,0,0,0.05),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(0,0,0,0.03),transparent_28%)]" />
        <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-black/5 via-transparent to-transparent" />
        <div className="absolute inset-x-12 sm:inset-x-24 bottom-[-12rem] h-72 rounded-[36px] bg-black/5 blur-3xl" />
      </div>

      {/* Back button */}
      <div className="relative z-20 mx-auto mt-16 sm:mt-0 max-w-6xl px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {" "}
        <button
          type="button"
          onClick={() => startTransition("/")}
          className="inline-flex w-full items-center justify-center gap-3 rounded-xl border border-neutral-300 bg-white/80 px-4 py-2.5 text-sm font-semibold text-neutral-800 shadow-sm backdrop-blur transition-all hover:-translate-y-0.5 hover:border-neutral-400 hover:shadow-md active:translate-y-0 sm:w-auto sm:text-base sm:px-4 sm:py-2.5"
        >
          <svg
            className="h-4 w-4 sm:h-5 sm:w-5"
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
        </button>
      </div>
      <section className="relative z-10 mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:pt-16 lg:pb-20">
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
                className="text-4xl font-bold tracking-tight text-neutral-800 sm:text-5xl lg:text-5xl"
              >
                {project.title}
              </motion.h1>

              {/* Headline */}
              {project.headline && (
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="text-lg text-neutral-600 sm:text-xl leading-relaxed max-w-md"
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
                      className="inline-flex items-center rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-neutral-900 border border-neutral-300"
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
                  className="space-y-4 max-w-lg"
                >
                  <h2 className="text-2xl font-semibold text-neutral-800">
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
                        className="flex items-start gap-3 text-base text-neutral-600 leading-relaxed"
                      >
                        <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-neutral-500" />
                        <span>{parseBold(feature)}</span>
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
                  <h3 className="text-lg font-semibold text-neutral-800">
                    Role
                  </h3>
                  <p className="text-base text-neutral-600">{project.role}</p>
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
                  <h3 className="text-lg font-semibold text-neutral-800">
                    Technologies
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center rounded-lg bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white relative z-20"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
              {/* Links */}
              {(project.githubLink || project.caseStudy) && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                  className="relative z-30 space-y-2"
                >
                  <h3 className="text-lg font-semibold text-neutral-800">
                    Links
                  </h3>
                  <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
                    {project.githubLink && (
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex touch-manipulation items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white/80 px-3 py-2 text-sm font-semibold text-neutral-800 shadow-sm backdrop-blur transition-all hover:-translate-y-0.5 hover:border-neutral-400 hover:shadow-md active:translate-y-0 sm:gap-3 sm:px-4 sm:py-2.5 sm:text-base"
                      >
                        View repository
                      </a>
                    )}
                    {project.caseStudy && (
                      <button
                        type="button"
                        onClick={() =>
                          startTransition(`/projects/${slug}/casestudy`)
                        }
                        className="inline-flex touch-manipulation items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-neutral-900 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-neutral-400 hover:shadow-md active:translate-y-0 sm:gap-3 sm:px-4 sm:py-2.5 sm:text-base"
                      >
                        Case Study
                      </button>
                    )}
                    {project.siteLink && (
                      <a
                        href={project.siteLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex touch-manipulation items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white/80 px-3 py-2 text-sm font-semibold text-neutral-800 shadow-sm backdrop-blur transition-all hover:-translate-y-0.5 hover:border-neutral-400 hover:shadow-md active:translate-y-0 sm:gap-3 sm:px-4 sm:py-2.5 sm:text-base"
                      >
                        View site
                      </a>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Right Column - Hero Image */}
          <motion.div
            {...fadeUp}
            initial={false}
            animate="animate"
            transition={{ delay: 0.2, duration: 0.7 }}
            className="relative z-0 w-full lg:flex-[0.85]"
          >
            <div className="relative flex flex-col items-center">
              <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-none">
                {project.imageUrl ? (
                  imageAspectRatio && isImageLoaded ? (
                    <div
                      className={`relative ${imageAspectRatio} w-full rounded-2xl sm:rounded-3xl transition-opacity duration-500 opacity-100`}
                    >
                      {/* SVG Background */}
                      <div className="absolute inset-0 flex items-center justify-center overflow-visible z-0">
                        <FeaturedSlugDesign />
                      </div>

                      {/* Image on top */}
                      <div
                        className={`relative z-10 ${imageAspectRatio} w-full rounded-2xl sm:rounded-3xl select-none`}
                      >
                        <Image
                          src={project.imageUrl}
                          alt={project.title}
                          fill
                          className={`object-contain object-center relative z-10 select-none pointer-events-none lg:scale-110 ${
                            imageAspectRatio === "aspect-video"
                              ? "translate-x-2 p-0 sm:translate-x-4 sm:p-0.5 md:translate-x-4 md:p-1 lg:translate-x-8 lg:scale-115 lg:p-0"
                              : "p-6 sm:p-4 md:p-5 lg:p-2 lg:-translate-x-2"
                          }`}
                          priority
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="relative z-0 aspect-square w-full rounded-2xl sm:rounded-3xl">
                      <div className="absolute inset-0 flex items-center justify-center overflow-visible z-0">
                        <FeaturedSlugDesign />
                      </div>
                      <div className="flex h-full w-full items-center justify-center rounded-2xl sm:rounded-3xl border-2 sm:border-4 border-white/50 bg-gradient-to-br from-neutral-100 via-neutral-50 to-white shadow-xl sm:shadow-2xl" />
                    </div>
                  )
                ) : (
                  <div className="flex aspect-square w-full items-center justify-center rounded-2xl sm:rounded-3xl border-2 sm:border-4 border-white/50 bg-gradient-to-br from-neutral-100 via-neutral-50 to-white shadow-xl sm:shadow-2xl">
                    <div className="flex h-24 w-24 sm:h-32 sm:w-32 items-center justify-center rounded-xl sm:rounded-2xl border border-neutral-200 bg-white text-4xl sm:text-5xl font-bold text-neutral-700 shadow-lg">
                      {project.title.charAt(0).toUpperCase()}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
        </motion.main>
      )}
    </AnimatePresence>
  );
}
