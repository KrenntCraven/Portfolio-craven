"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { BannerBackground } from "../frontend/banner-background";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronDownIcon,
  EASE,
  FOCUS_RING,
} from "../frontend/project-ui";
import { ABOUT_CARD, SectionHeader, SectionShell } from "./about-ui";
import type { Experience, ExperienceBullet } from "./experiences-data";
import { experiences, experiencesMobile } from "./experiences-data";

const COLLAPSED_BULLETS = 3;

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? "-100%" : "100%",
    opacity: 0,
  }),
};

function isHighlight(item: ExperienceBullet): item is { title: string; detail: string } {
  return typeof item !== "string";
}

function ExperienceCard({
  role,
  expanded,
  onToggleExpand,
}: {
  role: Experience;
  expanded: boolean;
  onToggleExpand: () => void;
}) {
  const isCurrent = role.period.toLowerCase().includes("present");
  const canCollapse = role.description.length > COLLAPSED_BULLETS;
  const visibleItems =
    expanded || !canCollapse
      ? role.description
      : role.description.slice(0, COLLAPSED_BULLETS);
  const hiddenCount = role.description.length - COLLAPSED_BULLETS;

  return (
    <article
      className={`${ABOUT_CARD} p-6 sm:p-8 lg:p-10 hover:border-[#6c5ce7]/25 hover:shadow-[0_24px_70px_-22px_rgba(108,92,231,0.2)]`}
    >
      <div className="mb-5 flex flex-col gap-2 sm:mb-6 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-2xl font-semibold text-neutral-800 sm:text-3xl">
              {role.company}
            </h3>
            {isCurrent && (
              <span className="rounded-full border border-[#6c5ce7]/25 bg-[#6c5ce7]/6 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#6c5ce7]">
                Current
              </span>
            )}
          </div>
          <p className="text-base font-medium text-[#6c5ce7] sm:text-lg">
            {role.position}
          </p>
        </div>
        <time className="shrink-0 text-sm font-medium text-neutral-600 sm:text-base">
          {role.period}
        </time>
      </div>

      <ul className="space-y-3 text-base text-neutral-700 sm:text-lg">
        {visibleItems.map((item, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: i * 0.04, ease: EASE }}
            className="flex items-start gap-3 leading-relaxed"
          >
            <span
              aria-hidden
              className="mt-[0.55em] h-2 w-2 shrink-0 rounded-full bg-neutral-400"
            />
            {isHighlight(item) ? (
              <span>
                <span className="font-semibold text-neutral-900">{item.title}</span>
                <span className="mt-0.5 block text-neutral-600">{item.detail}</span>
              </span>
            ) : (
              <span>{item}</span>
            )}
          </motion.li>
        ))}
      </ul>

      {canCollapse && (
        <button
          type="button"
          onClick={onToggleExpand}
          className={`mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#6c5ce7] transition-colors hover:text-[#5a4bd1] ${FOCUS_RING} rounded-md`}
          aria-expanded={expanded}
        >
          {expanded ? "Show less" : `Show ${hiddenCount} more`}
          <ChevronDownIcon
            className={`h-4 w-4 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
          />
        </button>
      )}
    </article>
  );
}

export default function ExperiencePage() {
  const sectionRef = useRef<HTMLElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const [isMobile, setIsMobile] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [expanded, setExpanded] = useState(false);

  useLayoutEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const data = isMobile ? experiencesMobile : experiences;
  const active = data[currentIndex];

  const goTo = useCallback(
    (index: number) => {
      if (index === currentIndex) return;
      setDirection(index > currentIndex ? 1 : -1);
      setCurrentIndex(index);
      setExpanded(false);
    },
    [currentIndex],
  );

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + data.length) % data.length);
    setExpanded(false);
  }, [data.length]);

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % data.length);
    setExpanded(false);
  }, [data.length]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const onKeyDown = (e: KeyboardEvent) => {
      const rect = section.getBoundingClientRect();
      const inView =
        rect.top < window.innerHeight * 0.75 &&
        rect.bottom > window.innerHeight * 0.25;
      if (!inView) return;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleNext, handlePrev]);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (e.changedTouches.length !== 1) return;
      const deltaX = e.changedTouches[0].clientX - touchStartX.current;
      const deltaY = e.changedTouches[0].clientY - touchStartY.current;
      if (Math.abs(deltaX) < 48 || Math.abs(deltaX) < Math.abs(deltaY)) return;
      if (deltaX < 0) handleNext();
      else handlePrev();
    };

    carousel.addEventListener("touchstart", onTouchStart, { passive: true });
    carousel.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      carousel.removeEventListener("touchstart", onTouchStart);
      carousel.removeEventListener("touchend", onTouchEnd);
    };
  }, [handleNext, handlePrev]);

  return (
    <div className="relative min-h-dvh overflow-hidden bg-white text-neutral-900">
      <BannerBackground />

      <SectionShell
        id="experience"
        ref={sectionRef}
        className="relative z-10 flex min-h-dvh flex-col justify-center pb-10 pt-16 sm:pt-20 lg:pb-14 lg:pt-24"
      >
        <SectionHeader
          eyebrow="Experience"
          title="Work experience"
          subtitle={
            <>
              I build cloud infrastructure that has to work —{" "}
              <span className="font-semibold text-[#6c5ce7]">
                no room for &ldquo;it works on my machine.&rdquo;
              </span>
            </>
          }
        />

        <div className="relative mx-auto w-full max-w-4xl">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous experience"
              className={`shrink-0 rounded-full border border-neutral-200/80 bg-white/90 p-2.5 text-neutral-600 shadow-sm transition-all duration-300 hover:border-[#6c5ce7]/25 hover:text-[#6c5ce7] sm:p-3 ${FOCUS_RING}`}
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>

            <div ref={carouselRef} className="min-w-0 flex-1 overflow-hidden px-1 sm:px-2">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 32 },
                    opacity: { duration: 0.2 },
                  }}
                  layout
                >
                  <ExperienceCard
                    role={active}
                    expanded={expanded}
                    onToggleExpand={() => setExpanded((prev) => !prev)}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Next experience"
              className={`shrink-0 rounded-full border border-neutral-200/80 bg-white/90 p-2.5 text-neutral-600 shadow-sm transition-all duration-300 hover:border-[#6c5ce7]/25 hover:text-[#6c5ce7] sm:p-3 ${FOCUS_RING}`}
            >
              <ArrowRightIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-8 flex flex-col items-center gap-4 sm:mt-10">
            <div className="flex items-center gap-2.5">
              {data.map((role, index) => (
                <button
                  key={`${role.company}-${role.period}`}
                  type="button"
                  onClick={() => goTo(index)}
                  aria-label={`Go to ${role.company}`}
                  aria-current={index === currentIndex ? "true" : undefined}
                  className={`rounded-full transition-all duration-300 ${FOCUS_RING} ${
                    index === currentIndex
                      ? "h-2.5 w-8 bg-[#6c5ce7] shadow-md"
                      : "h-2.5 w-2.5 bg-neutral-300 hover:scale-110 hover:bg-neutral-400"
                  }`}
                />
              ))}
            </div>

            <p className="text-center text-sm font-medium text-neutral-600">
              <span className="font-semibold text-neutral-800">
                {currentIndex + 1}
              </span>
              <span className="text-neutral-500"> / {data.length}</span>
              <span className="mx-2 text-neutral-300">·</span>
              <span>{active.company}</span>
            </p>
          </div>
        </div>
      </SectionShell>
    </div>
  );
}
