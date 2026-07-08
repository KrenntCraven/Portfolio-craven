"use client";
import { BannerBackground } from "@/app/frontend/banner-background";
import { FeaturedSlugDesign } from "@/app/frontend/featured[slug]_Design";
import { usePageTransition } from "@/app/frontend/page-transition/page-transition";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BookIcon,
  EASE,
  Eyebrow,
  ExternalIcon,
  FOCUS_RING,
  GithubIcon,
  fadeUpItem,
  heroStagger,
  inViewProps,
  sectionReveal,
} from "@/app/frontend/project-ui";
import { MotionConfig, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { Project } from "../../backend/types";

/** Inline **bold** markdown → <strong> for plain-text Contentful fields. */
const parseBold = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-neutral-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
};

export default function ProjectPageClient({ project }: { project: Project }) {
  const { startTransition } = usePageTransition();
  const slug = project.slug;
  const [prevImageUrl, setPrevImageUrl] = useState(project.imageUrl);
  const [imageAspectRatio, setImageAspectRatio] =
    useState<string>("aspect-square");
  const [isImageLoaded, setIsImageLoaded] = useState<boolean>(
    !project.imageUrl,
  );

  // Sync when navigating between projects (calling setState during render is the React-recommended
  // pattern for deriving state from props — avoids extra effect + cascading render)
  if (prevImageUrl !== project.imageUrl) {
    setPrevImageUrl(project.imageUrl);
    setIsImageLoaded(!project.imageUrl);
    setImageAspectRatio("aspect-square");
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "instant" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 50);
    return () => clearTimeout(timer);
  }, [slug]);

  const projectTypes = Array.isArray(project.projectType)
    ? project.projectType
    : project.projectType
      ? [project.projectType]
      : [];
  const technologies = Array.isArray(project.technologies)
    ? project.technologies
    : project.technologies
      ? [project.technologies]
      : [];
  const keyFeatures = Array.isArray(project.keyFeatures)
    ? project.keyFeatures
    : project.keyFeatures
      ? [project.keyFeatures]
      : [];

  const hasLinks = Boolean(
    project.githubLink || project.caseStudy || project.siteLink,
  );

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen overflow-hidden bg-white text-neutral-900 pt-16 sm:pt-20 md:pt-24 lg:pt-28">
        <BannerBackground />

        {/* Back button */}
        <nav
          aria-label="Breadcrumb"
          className="relative z-20 mx-auto mt-16 sm:mt-0 max-w-6xl px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8"
        >
          <motion.button
            type="button"
            onClick={() => startTransition("/")}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            whileTap={{ scale: 0.97 }}
            className={`group inline-flex w-full items-center justify-center gap-2.5 rounded-xl border border-neutral-300 bg-white/80 px-4 py-2.5 text-sm font-semibold text-neutral-800 shadow-sm backdrop-blur transition-all hover:-translate-y-0.5 hover:border-[#6c5ce7]/40 hover:bg-[#6c5ce7]/5 hover:text-neutral-900 hover:shadow-md active:translate-y-0 sm:w-auto sm:text-base ${FOCUS_RING}`}
          >
            <ArrowLeftIcon className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:-translate-x-1 sm:h-5 sm:w-5" />
            Back to projects
          </motion.button>
        </nav>

        {/* ---------------------------------------------------------- */}
        {/* Hero                                                       */}
        {/* ---------------------------------------------------------- */}
        <header className="relative z-10 mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:pt-16 lg:pb-20">
          <div className="flex w-full flex-col items-center gap-8 sm:gap-12 lg:flex-row lg:items-center lg:gap-16">
            {/* Left Column — content */}
            <motion.div
              variants={heroStagger}
              initial="hidden"
              animate="show"
              className="w-full lg:flex-[1.4]"
            >
              <div className="w-full space-y-5">
                <motion.div variants={fadeUpItem}>
                  <Eyebrow>
                    {projectTypes[0] ?? "Featured Project"}
                  </Eyebrow>
                </motion.div>

                <motion.h1
                  variants={fadeUpItem}
                  className="text-4xl font-bold tracking-tight text-neutral-800 sm:text-5xl lg:text-[3.25rem] lg:leading-[1.05]"
                >
                  {project.title}
                </motion.h1>

                {project.headline && (
                  <motion.p
                    variants={fadeUpItem}
                    className="max-w-xl text-lg leading-relaxed text-neutral-600 sm:text-xl"
                  >
                    {project.headline}
                  </motion.p>
                )}

                {/* Meta chips: role + project types */}
                {(project.role || projectTypes.length > 0) && (
                  <motion.div
                    variants={fadeUpItem}
                    className="flex flex-wrap items-center gap-2 pt-1"
                  >
                    {project.role && (
                      <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#6c5ce7]/25 bg-[#6c5ce7]/5 px-3 py-1.5 text-sm font-medium text-neutral-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#6c5ce7]" aria-hidden />
                        <span className="text-neutral-500">Role</span>
                        <span className="font-semibold text-neutral-800">
                          {project.role}
                        </span>
                      </span>
                    )}
                    {projectTypes.map((type, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700"
                      >
                        {type}
                      </span>
                    ))}
                  </motion.div>
                )}

                {/* Primary CTAs */}
                {hasLinks && (
                  <motion.div
                    variants={fadeUpItem}
                    className="relative z-30 flex flex-col gap-2.5 pt-2 sm:flex-row sm:flex-wrap sm:gap-3"
                  >
                    {project.caseStudy && (
                      <motion.button
                        type="button"
                        onClick={() =>
                          startTransition(`/projects/${slug}/casestudy`)
                        }
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className={`group inline-flex touch-manipulation items-center justify-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_-12px_rgba(15,23,42,0.5)] transition-colors hover:bg-neutral-800 sm:text-base ${FOCUS_RING}`}
                      >
                        <BookIcon className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
                        Read Case Study
                        <ArrowRightIcon className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
                      </motion.button>
                    )}
                    {project.siteLink && (
                      <motion.a
                        href={project.siteLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className={`group inline-flex touch-manipulation items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white/80 px-5 py-2.5 text-sm font-semibold text-neutral-800 shadow-sm backdrop-blur transition-colors hover:border-[#6c5ce7]/40 hover:bg-[#6c5ce7]/5 sm:text-base ${FOCUS_RING}`}
                      >
                        <ExternalIcon className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
                        View site
                      </motion.a>
                    )}
                    {project.githubLink && (
                      <motion.a
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className={`group inline-flex touch-manipulation items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white/80 px-5 py-2.5 text-sm font-semibold text-neutral-800 shadow-sm backdrop-blur transition-colors hover:border-[#6c5ce7]/40 hover:bg-[#6c5ce7]/5 sm:text-base ${FOCUS_RING}`}
                      >
                        <GithubIcon className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
                        View repository
                      </motion.a>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Right Column - Hero Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.7, ease: EASE }}
              className="relative z-0 w-full lg:flex-[0.9]"
            >
              <div className="relative flex flex-col items-center">
                <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-none">
                  {project.imageUrl ? (
                    <div
                      className={`relative ${imageAspectRatio} w-full rounded-2xl sm:rounded-3xl`}
                    >
                      {/* Background design */}
                      <div className="absolute inset-0 flex items-center justify-center overflow-visible z-0">
                        <FeaturedSlugDesign />
                      </div>
                      {/* Skeleton shown until image loads */}
                      {!isImageLoaded && (
                        <div className="absolute inset-0 z-10 flex h-full w-full items-center justify-center rounded-2xl sm:rounded-3xl border-2 sm:border-4 border-white/50 bg-linear-to-br from-neutral-100 via-neutral-50 to-white shadow-xl sm:shadow-2xl" />
                      )}
                      {/* Image — always rendered so onLoad can fire */}
                      <div
                        className={`relative z-20 ${imageAspectRatio} w-full rounded-2xl sm:rounded-3xl select-none transition-opacity duration-500 ${isImageLoaded ? "opacity-100" : "opacity-0"} ${
                          imageAspectRatio === "aspect-[4/5]" ||
                          imageAspectRatio === "aspect-square"
                            ? "lg:scale-[1.2] lg:origin-center overflow-visible"
                            : ""
                        }`}
                      >
                        <Image
                          src={project.imageUrl}
                          alt={project.title}
                          fill
                          onLoad={(e) => {
                            const img = e.currentTarget;
                            const ratio = img.naturalWidth / img.naturalHeight;
                            if (ratio >= 1.3) setImageAspectRatio("aspect-video");
                            else if (ratio >= 0.9)
                              setImageAspectRatio("aspect-square");
                            else setImageAspectRatio("aspect-[4/5]");
                            setIsImageLoaded(true);
                          }}
                          className={`object-contain object-center relative z-10 select-none pointer-events-none ${
                            imageAspectRatio === "aspect-video"
                              ? "translate-x-2 p-0 sm:translate-x-4 sm:p-0.5 md:translate-x-4 md:p-1 lg:translate-x-8 lg:scale-115 lg:p-0"
                              : "p-0"
                          }`}
                          priority
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex aspect-square w-full items-center justify-center rounded-2xl sm:rounded-3xl border-2 sm:border-4 border-white/50 bg-linear-to-br from-neutral-100 via-neutral-50 to-white shadow-xl sm:shadow-2xl">
                      <div className="flex h-24 w-24 sm:h-32 sm:w-32 items-center justify-center rounded-xl sm:rounded-2xl border border-neutral-200 bg-white text-4xl sm:text-5xl font-bold text-neutral-700 shadow-lg">
                        {project.title.charAt(0).toUpperCase()}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </header>

        {/* ---------------------------------------------------------- */}
        {/* Body sections                                              */}
        {/* ---------------------------------------------------------- */}
        {(keyFeatures.length > 0 || technologies.length > 0) && (
          <main className="relative z-10 mx-auto max-w-6xl px-4 pb-4 sm:px-6 lg:px-8">
            <div className="mx-auto h-px max-w-6xl bg-linear-to-r from-transparent via-neutral-200 to-transparent" />

            {/* Key Features */}
            {keyFeatures.length > 0 && (
              <motion.section
                {...inViewProps}
                variants={sectionReveal}
                aria-labelledby="key-features-heading"
                className="py-12 sm:py-16"
              >
                <div className="mb-8 space-y-3">
                  <Eyebrow>What it does</Eyebrow>
                  <h2
                    id="key-features-heading"
                    className="text-2xl font-bold tracking-tight text-neutral-800 sm:text-3xl"
                  >
                    Key Features
                  </h2>
                </div>
                <ul className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
                  {keyFeatures.map((feature, index) => (
                    <motion.li
                      key={index}
                      variants={fadeUpItem}
                      className="group flex items-start gap-3 rounded-2xl border border-neutral-200/70 bg-white/70 p-4 shadow-[0_10px_40px_-28px_rgba(15,23,42,0.35)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#6c5ce7]/30 hover:shadow-[0_20px_55px_-26px_rgba(108,92,231,0.28)] sm:p-5"
                    >
                      <span
                        aria-hidden
                        className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#6c5ce7] transition-transform duration-200 group-hover:scale-125"
                      />
                      <span className="text-base leading-relaxed text-neutral-600 transition-colors duration-200 group-hover:text-neutral-800">
                        {parseBold(feature)}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </motion.section>
            )}

            {/* Technologies */}
            {technologies.length > 0 && (
              <motion.section
                {...inViewProps}
                variants={sectionReveal}
                aria-labelledby="technologies-heading"
                className="pb-12 sm:pb-16"
              >
                <div className="mb-6 space-y-3">
                  <Eyebrow>Built with</Eyebrow>
                  <h2
                    id="technologies-heading"
                    className="text-2xl font-bold tracking-tight text-neutral-800 sm:text-3xl"
                  >
                    Technologies
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2 sm:gap-2.5">
                  {technologies.map((tech, index) => (
                    <motion.span
                      key={index}
                      variants={fadeUpItem}
                      whileHover={{ y: -2 }}
                      className="inline-flex items-center rounded-lg bg-neutral-900 px-3.5 py-1.5 text-sm font-medium text-white shadow-[0_8px_24px_-14px_rgba(15,23,42,0.6)] transition-colors duration-200 hover:bg-neutral-800"
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </motion.section>
            )}
          </main>
        )}

        {/* ---------------------------------------------------------- */}
        {/* Bottom CTA — invite to the case study                      */}
        {/* ---------------------------------------------------------- */}
        {project.caseStudy && (
          <motion.section
            {...inViewProps}
            variants={sectionReveal}
            className="relative z-10 mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28"
          >
            <div className="relative overflow-hidden rounded-3xl border border-neutral-200/60 bg-white/80 p-8 shadow-sm backdrop-blur-sm sm:p-12">
              <div
                aria-hidden
                className="absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(108,92,231,0.08),transparent_55%)]"
              />
              <div className="relative z-10 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                  <Eyebrow>Go behind the build</Eyebrow>
                  <h2 className="text-2xl font-bold tracking-tight text-neutral-800 sm:text-3xl">
                    Curious how it came together?
                  </h2>
                  <p className="max-w-xl text-neutral-500">
                    Dive into the problem, the decisions, and the impact behind{" "}
                    {project.title}.
                  </p>
                </div>
                <motion.button
                  type="button"
                  onClick={() =>
                    startTransition(`/projects/${slug}/casestudy`)
                  }
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className={`group inline-flex shrink-0 touch-manipulation items-center justify-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900 px-6 py-3 text-base font-semibold text-white shadow-[0_14px_34px_-14px_rgba(15,23,42,0.55)] transition-colors hover:bg-neutral-800 ${FOCUS_RING}`}
                >
                  Read Case Study
                  <ArrowRightIcon className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </motion.button>
              </div>
            </div>
          </motion.section>
        )}
      </div>
    </MotionConfig>
  );
}
