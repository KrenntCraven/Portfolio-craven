"use client";

import { MotionConfig, animate, motion, useTransform } from "framer-motion";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { BannerBackground } from "../frontend/banner-background";
import {
  ArrowUpIcon,
  EASE,
  Eyebrow,
  FOCUS_RING,
  fadeUpItem,
  heroStagger,
} from "../frontend/project-ui";
import { useMouseParallax } from "../frontend/use-mouse-parallax";
import { AboutGridOverlay } from "./about-ui";
import { aboutMobileParagraphs, aboutParagraphs } from "./about-data";

const ExperiencePage = dynamic(() => import("./experience-page"), {
  loading: () => (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-4">
        <div className="h-10 w-56 animate-pulse rounded-xl bg-neutral-100" />
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="space-y-3 rounded-2xl border border-neutral-100 p-6"
          >
            <div className="h-5 w-40 animate-pulse rounded bg-neutral-100" />
            <div className="h-4 w-28 animate-pulse rounded bg-neutral-50" />
            <div className="h-4 w-full animate-pulse rounded bg-neutral-50" />
          </div>
        ))}
      </div>
    </section>
  ),
});

const Certification = dynamic(() => import("./certification-page"), {
  loading: () => (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-4">
        <div className="h-10 w-48 animate-pulse rounded-xl bg-neutral-100" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="space-y-2 rounded-xl border border-neutral-100 p-5"
            >
              <div className="h-10 w-10 animate-pulse rounded-lg bg-neutral-100" />
              <div className="h-5 w-3/4 animate-pulse rounded bg-neutral-100" />
            </div>
          ))}
        </div>
      </div>
    </section>
  ),
});

const Technologies = dynamic(
  () =>
    import("./techonologies-page").then((mod) => ({
      default: mod.Technologies,
    })),
  {
    loading: () => (
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl space-y-4">
          <div className="h-10 w-52 animate-pulse rounded-xl bg-neutral-100" />
          <div className="flex flex-wrap gap-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="h-9 animate-pulse rounded-full bg-neutral-100"
              />
            ))}
          </div>
        </div>
      </section>
    ),
  },
);

export default function About() {
  const isSnappingRef = useRef(false);
  const isMobileRef = useRef(false);
  const cancelSnapRef = useRef<(() => void) | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const NAV_OFFSET = 80;

  const getSnapPoints = () => {
    const maxScroll = Math.max(
      0,
      document.documentElement.scrollHeight - window.innerHeight,
    );
    const viewport = window.innerHeight;
    const clamp = (v: number) => Math.min(Math.max(v, 0), maxScroll);
    const points: number[] = [];

    document
      .querySelectorAll<HTMLElement>("section[id], main[id]")
      .forEach((el) => {
        const rect = el.getBoundingClientRect();
        const rawTop = rect.top + window.scrollY;
        const rawBottom = rect.bottom + window.scrollY;
        const height = rawBottom - rawTop;

        const topPoint = clamp(rawTop - NAV_OFFSET);
        points.push(topPoint);

        // #experience scrolls internally when its card is expanded, so it
        // only ever contributes a single top-aligned snap point. The wheel
        // handler lets it free-scroll and snaps to the next section at its
        // bottom edge — no jarring mid-section stops.
        if (el.id === "experience") return;

        const OVERFLOW_TOL = 48;
        if (height > viewport + OVERFLOW_TOL) {
          const bottomPoint = clamp(rawBottom - viewport);
          const step = Math.max(viewport - NAV_OFFSET, 1);
          for (let p = topPoint + step; p < bottomPoint - 2; p += step) {
            points.push(clamp(p));
          }
          points.push(bottomPoint);
        }
      });

    return points
      .sort((a, b) => a - b)
      .filter((v, i, arr) => i === 0 || v - arr[i - 1] > 8);
  };

  const getNearestSection = () => {
    const tops = getSnapPoints();
    if (!tops.length) return null;
    const currentY = window.scrollY;
    return tops.reduce((nearest, top) =>
      Math.abs(top - currentY) < Math.abs(nearest - currentY) ? top : nearest,
    );
  };

  const smoothScrollTo = (targetY: number) => {
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
      if (isMobileRef.current) return;
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
  }, []);

  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (isMobileRef.current) {
        setShowScrollTop(window.scrollY > 300);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const aboutData = isMobile ? aboutMobileParagraphs : aboutParagraphs;

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isMobileRef.current) return;
      if (isSnappingRef.current) return;

      const targetNode = e.target as HTMLElement | null;
      const certEl = targetNode?.closest<HTMLElement>("#certifications");
      if (certEl) {
        const hstate = certEl.dataset.hscroll ?? "none";
        if (hstate !== "none") {
          if (e.deltaY > 0 && hstate !== "end") return;
          if (e.deltaY < 0 && hstate !== "start") return;
        }
      }

      // When the experience card is expanded it can exceed the viewport.
      // Let the section scroll naturally and only snap to the neighbouring
      // section once its top/bottom edge is reached.
      const expEl = targetNode?.closest<HTMLElement>("#experience");
      if (expEl) {
        const rect = expEl.getBoundingClientRect();
        const EDGE_TOL = 4;
        const overflowing = rect.height > window.innerHeight + EDGE_TOL;
        if (overflowing) {
          const canScrollDown = rect.bottom > window.innerHeight + EDGE_TOL;
          const canScrollUp = rect.top < NAV_OFFSET - EDGE_TOL;
          if (e.deltaY > 0 && canScrollDown) return;
          if (e.deltaY < 0 && canScrollUp) return;
        }
      }

      const tops = getSnapPoints();
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
        const prev = [...tops]
          .reverse()
          .find((top) => top < currentY - threshold);
        if (prev !== undefined) {
          e.preventDefault();
          smoothScrollTo(prev);
        }
      }
    };

    const opts = { passive: false, capture: true } as const;
    window.addEventListener("wheel", handleWheel, opts);
    return () => window.removeEventListener("wheel", handleWheel, opts);
  }, []);

  const { x: mx, y: my, skip: skipParallax } = useMouseParallax();
  const tiltX = useTransform(my, [0, 1], [6, -6]);
  const tiltY = useTransform(mx, [0, 1], [-6, 6]);
  const avatarTx = useTransform(mx, [0, 1], [-8, 8]);
  const avatarTy = useTransform(my, [0, 1], [-6, 6]);

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen overflow-visible bg-white text-neutral-900 pt-16 sm:pt-20 md:pt-24 lg:pt-28">
        <BannerBackground />

        {/* Grid texture — bounded to the hero region and kept on the base
            layer so the opaque sections below always cover it (no bleed into
            Work Experience) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[80vh] overflow-hidden"
        >
          <AboutGridOverlay />
        </div>

        {/* Hero — engineering journey intro */}
        <section
          id="about"
          className="relative z-10 mx-auto flex max-w-6xl flex-col items-center gap-10 px-4 pb-16 pt-8 sm:gap-12 sm:px-6 sm:pb-20 sm:pt-12 lg:flex-row lg:items-center lg:gap-16 lg:px-8 lg:pb-24 lg:pt-16 min-h-[60vh]"
        >
          <motion.div
            variants={heroStagger}
            initial="hidden"
            animate="show"
            className="order-2 w-full space-y-6 lg:order-1 lg:flex-[1.4]"
          >
            <motion.div variants={fadeUpItem}>
              <Eyebrow>About me</Eyebrow>
            </motion.div>

            <motion.h1
              variants={fadeUpItem}
              className="text-3xl font-bold leading-[1.08] tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl"
            >
              My engineering{" "}
              <span className="bg-linear-to-r from-[#6c5ce7] to-[#a29bfe] bg-clip-text text-transparent">
                journey
              </span>
            </motion.h1>

            <motion.div variants={fadeUpItem} className="space-y-4">
              {aboutData.map((text, index) => (
                <p
                  key={index}
                  className="text-base leading-relaxed text-neutral-600 sm:text-lg"
                >
                  {text}
                </p>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
            className="order-1 w-full max-w-sm lg:order-2 lg:flex-1"
            style={skipParallax ? undefined : { perspective: 800 }}
          >
            <motion.div
              className="relative mx-auto flex flex-col items-center"
              style={
                skipParallax
                  ? undefined
                  : {
                      rotateX: tiltX,
                      rotateY: tiltY,
                      x: avatarTx,
                      y: avatarTy,
                      willChange: "transform",
                    }
              }
            >
              <div
                aria-hidden
                className="absolute left-1/2 top-1/2 -z-10 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6c5ce7]/10 blur-3xl"
              />

              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.35, ease: EASE }}
                className="relative h-44 w-44 xs:h-52 xs:w-52 sm:h-60 sm:w-60 md:h-64 md:w-64 lg:h-72 lg:w-72"
              >
                <div className="relative h-full w-full overflow-hidden rounded-full border-4 border-white/60 shadow-2xl">
                  <Image
                    src="/Picture.jpg"
                    alt="Krennt Craven"
                    fill
                    sizes="(max-width: 640px) 176px, (max-width: 1024px) 240px, 288px"
                    quality={85}
                    className="select-none object-cover"
                    priority
                  />
                </div>

                <div className="-mt-12 flex items-center justify-center md:-mt-14 lg:-mt-24">
                  <Image
                    src="/Logo-Avatar.svg"
                    alt="KC Logo"
                    width={80}
                    height={80}
                    className="pointer-events-none h-20 w-20 select-none drop-shadow-2xl md:h-24 md:w-24 lg:h-[160px] lg:w-[160px]"
                  />
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        <ExperiencePage />
        <Certification />
        <Technologies />

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={
            showScrollTop
              ? { opacity: 1, scale: 1 }
              : { opacity: 0, scale: 0.9 }
          }
          transition={{ duration: 0.25 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Scroll to top"
          className={`fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-xl border border-black/10 bg-white text-neutral-700 shadow-lg backdrop-blur transition-colors hover:border-[#6c5ce7]/40 hover:bg-[#6c5ce7]/5 hover:text-[#6c5ce7] md:hidden ${FOCUS_RING}`}
          style={{ pointerEvents: showScrollTop ? "auto" : "none" }}
        >
          <ArrowUpIcon className="h-5 w-5" />
        </motion.button>
      </div>
    </MotionConfig>
  );
}
