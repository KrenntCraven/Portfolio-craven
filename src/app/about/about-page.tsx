"use client";
import { animate, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { BannerBackground } from "../frontend/banner-background";
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
  const isMobileRef = useRef(false);
  const cancelSnapRef = useRef<(() => void) | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const NAV_OFFSET = 80;

  const getSectionTops = () =>
    Array.from(document.querySelectorAll<HTMLElement>("section[id], main[id]"))
      .map((el) => {
        const rawTop = el.getBoundingClientRect().top + window.scrollY;
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        return Math.min(rawTop - NAV_OFFSET, maxScroll);
      })
      .sort((a, b) => a - b);

  const getNearestSection = () => {
    const tops = getSectionTops();
    if (!tops.length) return null;
    const currentY = window.scrollY;
    return tops.reduce((nearest, top) =>
      Math.abs(top - currentY) < Math.abs(nearest - currentY) ? top : nearest
    );
  };

  const smoothScrollTo = (targetY: number) => {
    // Cancel any in-flight snap
    if (cancelSnapRef.current) {
      cancelSnapRef.current();
      cancelSnapRef.current = null;
    }
    isSnappingRef.current = true;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const clamped = Math.min(Math.max(targetY, 0), maxScroll);
    const controls = animate(window.scrollY, clamped, {
      duration: 0.75,
      ease: "easeInOut",
      onUpdate: (latest) => window.scrollTo(0, latest),
      onComplete: () => {
        isSnappingRef.current = false;
        cancelSnapRef.current = null;
      },
    });
    cancelSnapRef.current = () => {
      controls.stop();
      isSnappingRef.current = false;
    };
  };

  // Snap to nearest section immediately (no animation) — used on resize
  const snapToNearestImmediate = () => {
    if (cancelSnapRef.current) {
      cancelSnapRef.current();
      cancelSnapRef.current = null;
    }
    const nearest = getNearestSection();
    if (nearest !== null) {
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      window.scrollTo(0, Math.min(Math.max(nearest, 0), maxScroll));
    }
    isSnappingRef.current = false;
  };

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      isMobileRef.current = mobile;
      setIsMobile(mobile);
    };
    checkMobile();

    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      checkMobile();
      // Debounce: wait until resize is settled before snapping
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        snapToNearestImmediate();
      }, 120);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimer);
    };
  // snapToNearestImmediate is stable (no deps) — safe to omit
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const aboutData = isMobile ? aboutMobileParagraphs : aboutParagraphs;

  // Wheel-based snapping (desktop)
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isMobileRef.current) return;
      if (isSnappingRef.current) return;

      const targetNode = e.target as HTMLElement | null;
      if (targetNode?.closest("#certifications")) return;

      const tops = getSectionTops();
      if (!tops.length) return;

      const currentY = window.scrollY;
      const threshold = 60;

      if (e.deltaY > 0) {
        const next = tops.find((top) => top > currentY + threshold);
        if (next !== undefined) {
          e.preventDefault();
          smoothScrollTo(next);
        }
      } else if (e.deltaY < 0) {
        const prev = [...tops].reverse().find((top) => top < currentY - threshold);
        if (prev !== undefined) {
          e.preventDefault();
          smoothScrollTo(prev);
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  // getSectionTops / smoothScrollTo use only refs — safe to register once
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Touch-based snapping (mobile)
  useEffect(() => {
    let touchStartY = 0;
    let touchStartX = 0;
    let didSnap = false;

    const handleTouchStart = (e: TouchEvent) => {
      if (!isMobileRef.current) return;
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
      didSnap = false;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isMobileRef.current) return;
      if (didSnap) return;

      const targetNode = e.target as HTMLElement | null;
      if (targetNode?.closest("#certifications")) return;

      const deltaY = touchStartY - e.changedTouches[0].clientY;
      const deltaX = touchStartX - e.changedTouches[0].clientX;

      // Only snap on predominantly vertical swipes with enough distance
      if (Math.abs(deltaX) > Math.abs(deltaY)) return;
      if (Math.abs(deltaY) < 30) return;

      if (isSnappingRef.current) return;

      const tops = getSectionTops();
      if (!tops.length) return;

      const currentY = window.scrollY;
      const threshold = 40;

      if (deltaY > 0) {
        // Swiped up → go to next section
        const next = tops.find((top) => top > currentY + threshold);
        if (next !== undefined) {
          didSnap = true;
          smoothScrollTo(next);
        }
      } else {
        // Swiped down → go to previous section
        const prev = [...tops].reverse().find((top) => top < currentY - threshold);
        if (prev !== undefined) {
          didSnap = true;
          smoothScrollTo(prev);
        }
      }
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  // getSectionTops / smoothScrollTo use only refs — safe to register once
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="relative min-h-screen overflow-visible bg-white text-neutral-900 pt-16 sm:pt-20 md:pt-24 lg:pt-28">
      <BannerBackground />

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
                    src="/Picture.jpg"
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
