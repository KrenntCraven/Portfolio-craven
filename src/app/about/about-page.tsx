"use client";
import { animate, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { aboutMobileParagraphs, aboutParagraphs } from "./about-data";
import Certification from "./certification-page";
import ExperiencePage from "./experience-page";
import { Technologies } from "./techonologies-page";

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

export default function About() {
  const isSnappingRef = useRef(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 640px)");
    setIsMobile(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const aboutData = isMobile ? aboutMobileParagraphs : aboutParagraphs;

  const smoothScrollTo = (targetY: number) => {
    if (isSnappingRef.current) return;
    isSnappingRef.current = true;
    animate(window.scrollY, targetY, {
      duration: 0.9,
      ease: "easeInOut",
      onUpdate: (latest) => window.scrollTo(0, latest),
      onComplete: () => {
        isSnappingRef.current = false;
      },
    });
  };

  useEffect(() => {
    const sections = ["about", "experience", "certifications", "technologies"];

    const handleWheel = (event: WheelEvent) => {
      if (isSnappingRef.current) return;

      const targetNode = event.target as HTMLElement | null;
      if (targetNode?.closest("#certifications")) {
        return;
      }

      const sectionEls = sections
        .map((id) => document.getElementById(id))
        .filter((el): el is HTMLElement => Boolean(el));
      if (!sectionEls.length) return;

      const sectionsWithBounds = sectionEls
        .map((el) => {
          const rect = el.getBoundingClientRect();
          const top = rect.top + window.scrollY;
          const bottom = top + rect.height;
          return { el, top, bottom };
        })
        .sort((a, b) => a.top - b.top);

      const currentY = window.scrollY;
      const delta = event.deltaY;
      const threshold = 140;

      const currentIndex = sectionsWithBounds.findIndex(
        ({ top, bottom }) =>
          currentY >= top - threshold && currentY < bottom - threshold,
      );

      if (currentIndex === -1) return;

      const currentSection = sectionsWithBounds[currentIndex];

      if (delta > 0) {
        const isNearBottom =
          currentY >= currentSection.bottom - window.innerHeight - threshold;
        const next = sectionsWithBounds[currentIndex + 1];
        if (isNearBottom && next) {
          event.preventDefault();
          smoothScrollTo(next.top);
        }
      } else if (delta < 0) {
        const isNearTop = currentY <= currentSection.top + threshold;
        const prev = sectionsWithBounds[currentIndex - 1];
        if (isNearTop && prev) {
          event.preventDefault();
          smoothScrollTo(prev.top);
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <main className="relative min-h-screen overflow-visible bg-white text-neutral-900 pt-16 sm:pt-20 md:pt-24 lg:pt-28">
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,0,0,0.05),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(0,0,0,0.03),transparent_28%)]" />
        <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-black/5 via-transparent to-transparent" />
        <div className="absolute inset-x-12 sm:inset-x-24 bottom-[-12rem] h-72 rounded-[36px] bg-black/5 blur-3xl" />
      </div>

      <section
        id="about"
        className="relative mx-auto max-w-6xl px-4 py-18 sm:px-6 sm:py-16 lg:px-8 lg:pt-22 lg:pb-20 min-h-[190px] sm:min-h-[20vh] lg:min-h-[60vh]"
      >
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12 text-center text-4xl font-semibold text-neutral-800 sm:text-5xl lg:mb-16"
        >
          My Engineering Journey
        </motion.h2>
        <div className="flex w-full flex-col items-center gap-6 sm:gap-10 lg:flex-row lg:items-start lg:gap-16">
          {/* First Section - Left Column */}
          <motion.div
            {...fadeUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.1, duration: 0.7 }}
            className="w-full lg:flex-[1.5]"
          >
            <div className="w-full space-y-8">
              <div className="space-y-6 text-base text-neutral-600 sm:text-lg">
                {aboutData.map((text, index) => (
                  <motion.p
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex items-start gap-3 leading-[2.5] sm:leading-[2] lg:leading-[2] text-center sm:text-justify hyphens-auto"
                  >
                    {text}
                  </motion.p>
                ))}
              </div>
            </div>
          </motion.div>
          {/* Second Section - Right Column */}
          <motion.div
            {...fadeUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.2, duration: 0.7 }}
            className="w-full lg:flex-[0.65]"
          >
            <div className="relative flex flex-col items-center gap-4 sm:gap-5">
              {/* Avatar Image */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="relative h-40 w-40 xs:h-48 xs:w-48 sm:h-56 sm:w-56 md:h-50 md:w-50 lg:h-72 lg:w-72"
              >
                <div className="relative h-full w-full overflow-hidden rounded-full border-4 border-white/50 shadow-2xl">
                  <Image
                    src="/Picture2.jpg"
                    alt="Avatar"
                    fill
                    className="object-cover select-none"
                    priority
                  />
                </div>

                {/* Logo Below Avatar */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="flex items-center justify-center -mt-12 md:-mt-14 lg:-mt-24"
                >
                  <Image
                    src="/Logo-Avatar.svg"
                    alt="KC Logo"
                    width={80}
                    height={80}
                    className="drop-shadow-2xl w-20 h-20 md:w-24 md:h-24 lg:w-[160px] lg:h-[160px] select-none pointer-events-none"
                  />
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
      <ExperiencePage />
      <Certification />
      <Technologies />
    </main>
  );
}
