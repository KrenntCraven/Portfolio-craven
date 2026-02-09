"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { experiences, experiencesMobile } from "./experiences-data";

export default function ExperiencePage() {
  const [isMobile, setIsMobile] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 640px)");
    setIsMobile(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const data = isMobile ? experiencesMobile : experiences;

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % data.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + data.length) % data.length);
  };

  const handleDotClick = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0,
    }),
  };

  return (
    <main
      id="experience"
      className="relative min-h-[100dvh] overflow-hidden bg-gradient-to-br from-white via-neutral-50 to-white text-neutral-900 pt-16 sm:pt-20 md:pt-24 lg:pt-28"
    >
      {/* Enhanced Background decorations */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(108,92,231,0.08),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(0,0,0,0.04),transparent_30%)]" />
        <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-neutral-900/5 via-transparent to-transparent" />
        <div className="absolute inset-x-12 sm:inset-x-24 bottom-[-14rem] h-80 rounded-[40px] bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-indigo-500/10 blur-3xl" />
      </div>

      <section className="relative mx-auto max-w-6xl px-4 pb-8 pt-8 sm:px-6 sm:pb-12 sm:pt-16 md:pb-12 lg:px-8 lg:pb-16 lg:pt-24">
        {/* Page Title */}
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12 text-center text-4xl font-semibold text-neutral-800 sm:text-5xl lg:mb-16"
        >
          Work Experience
        </motion.h1>

        {/* Carousel Container */}
        <div className="relative min-h-[450px] sm:min-h-[500px]">
          {/* Navigation Buttons - Large screens only */}
          <button
            onClick={handlePrev}
            className="absolute -left-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-neutral-200/60 bg-white/70 p-3 shadow-xl backdrop-blur-md transition-all hover:scale-110 hover:border-neutral-300 hover:bg-white hover:shadow-2xl disabled:opacity-50 lg:-left-16 lg:block hidden lg:p-4"
            aria-label="Previous experience"
          >
            <svg
              className="h-5 w-5 text-neutral-900 sm:h-6 sm:w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={handleNext}
            className="absolute -right-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-neutral-200/60 bg-white/70 p-3 shadow-xl backdrop-blur-md transition-all hover:scale-110 hover:border-neutral-300 hover:bg-white hover:shadow-2xl disabled:opacity-50 lg:-right-16 lg:block hidden lg:p-4"
            aria-label="Next experience"
          >
            <svg
              className="h-5 w-5 text-neutral-900 sm:h-6 sm:w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* Carousel Content */}
          <div className="overflow-hidden px-2 sm:px-4">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="w-full"
              >
                <motion.div
                  whileHover={{
                    scale: 1.01,
                    transition: { duration: 0.2 },
                  }}
                  className="group relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-neutral-200/60 bg-white/70 p-6 shadow-xl backdrop-blur-md hover:shadow-2xl transition-shadow duration-300 sm:p-8 lg:p-10"
                >
                  {/* Animated gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500/0 via-purple-500/0 to-indigo-500/0 opacity-0 transition-opacity duration-500 group-hover:opacity-10" />

                  {/* Card shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />

                  <div className="relative">
                    {/* Company and Period */}
                    <div className="mb-4 flex flex-col gap-2 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
                      <h2 className="text-2xl font-bold text-neutral-900 sm:text-3xl">
                        {data[currentIndex].company}
                      </h2>
                      <span className="whitespace-nowrap text-base font-medium text-neutral-700 sm:text-base md:text-lg lg:text-xl">
                        {data[currentIndex].period}
                      </span>
                    </div>

                    {/* Position */}
                    <h3 className="mb-6 text-lg font-medium text-neutral-700 sm:text-xl">
                      {data[currentIndex].position}
                    </h3>

                    {/* Description */}
                    <ul className="space-y-3 text-base text-neutral-700 sm:text-lg">
                      {data[currentIndex].description.map((item, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -15 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            duration: 0.4,
                            delay: i * 0.05,
                          }}
                          className="group/item flex items-start gap-3 leading-[2.2] sm:leading-loose lg:leading-loose"
                        >
                          <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-neutral-500 transition-transform duration-200 group-hover/item:scale-125" />
                          <span className="text-left sm:text-justify hyphens-auto sm:hyphens-auto md:hyphens-auto lg:hyphens-none group-hover/item:text-neutral-900 transition-colors duration-200">
                            {item}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Carousel Indicators with Navigation */}
          <div className="mt-8 flex items-center justify-center gap-4 sm:mt-12">
            {/* Previous Button - Small/Medium screens */}
            <button
              onClick={handlePrev}
              className="rounded-full border border-neutral-200/60 bg-white/70 p-2.5 shadow-lg backdrop-blur-md transition-all hover:scale-110 hover:border-neutral-300 hover:bg-white hover:shadow-xl lg:hidden"
              aria-label="Previous experience"
            >
              <svg
                className="h-4 w-4 text-neutral-900"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {/* Indicators */}
            <div className="flex items-center gap-2.5">
              {data.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "h-2.5 w-10 bg-gradient-to-r from-neutral-800 to-neutral-900 shadow-lg"
                      : "h-2.5 w-2.5 bg-neutral-300 hover:bg-neutral-500 hover:scale-125"
                  }`}
                  aria-label={`Go to experience ${index + 1}`}
                />
              ))}
            </div>

            {/* Next Button - Small/Medium screens */}
            <button
              onClick={handleNext}
              className="rounded-full border border-neutral-200/60 bg-white/70 p-2.5 shadow-lg backdrop-blur-md transition-all hover:scale-110 hover:border-neutral-300 hover:bg-white hover:shadow-xl lg:hidden"
              aria-label="Next experience"
            >
              <svg
                className="h-4 w-4 text-neutral-900"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {/* Counter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-4 text-center text-sm font-medium text-neutral-600 sm:mt-6"
          >
            <span className="text-neutral-900">{currentIndex + 1}</span> /{" "}
            {data.length}
          </motion.div>
        </div>
      </section>
    </main>
  );
}
