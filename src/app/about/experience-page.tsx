"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { BannerBackground } from "../frontend/banner-background";
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
      className="relative min-h-[100dvh] overflow-hidden bg-white text-neutral-900 pt-16 sm:pt-20 md:pt-24 lg:pt-28"
    >
      <BannerBackground />

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
          {/* Carousel Content - tap/click card to go to next */}
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
                className="flex w-full justify-center"
              >
                <motion.button
                  type="button"
                  onClick={handleNext}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.995 }}
                  className="group relative w-full cursor-pointer text-left max-w-4xl overflow-hidden rounded-2xl border border-neutral-200/70 bg-white/80 p-6 shadow-[0_18px_60px_-24px_rgba(15,23,42,0.25)] backdrop-blur-sm transition-all duration-300 hover:border-[#6c5ce7]/20 hover:shadow-[0_24px_70px_-22px_rgba(108,92,231,0.2)] sm:p-8 lg:p-10"
                  aria-label="Next experience"
                >
                  {/* Subtle hover gradient */}
                  <div className="absolute inset-0 bg-linear-to-br from-[#6c5ce7]/0 via-transparent to-[#6c5ce7]/0 opacity-0 transition-opacity duration-300 group-hover:opacity-[0.06]" />

                  {/* Card shine on hover */}
                  <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out pointer-events-none" />

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
                </motion.button>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots + Counter */}
          <div className="mt-8 flex flex-col items-center gap-4 sm:mt-10">
            <div className="flex items-center gap-2.5">
              {data.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "h-2.5 w-8 bg-[#6c5ce7] shadow-md"
                      : "h-2.5 w-2.5 bg-neutral-300 hover:bg-neutral-400 hover:scale-110"
                  }`}
                  aria-label={`Go to experience ${index + 1}`}
                />
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center text-sm font-medium text-neutral-600"
            >
              <span className="font-semibold text-neutral-800">{currentIndex + 1}</span>
              <span className="text-neutral-500"> / {data.length}</span>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
