"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { certifications } from "./certification-data";

export default function Certification() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [maxOffset, setMaxOffset] = useState(0);
  const x = useMotionValue(0);
  const xSmooth = useSpring(x, { stiffness: 220, damping: 30, mass: 0.6 });

  useEffect(() => {
    const section = sectionRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!section || !viewport || !track) return;

    const updateBounds = () => {
      const max = Math.max(0, track.scrollWidth - viewport.clientWidth);
      setMaxOffset(max);
      if (x.get() < -max) x.set(-max);
    };

    updateBounds();
    window.addEventListener("resize", updateBounds);

    const handleScroll = (e: WheelEvent) => {
      const sectionRect = section.getBoundingClientRect();

      // Fixed: Check if section is visible in viewport
      const isSectionInView =
        sectionRect.top < window.innerHeight * 0.7 &&
        sectionRect.bottom > window.innerHeight * 0.3;

      if (!isSectionInView) return;

      if (maxOffset <= 0) return;

      const delta =
        Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;

      if (delta === 0) return;

      e.preventDefault();
      const next = x.get() - delta;
      const clamped = Math.max(-maxOffset, Math.min(0, next));
      x.set(clamped);
    };

    section.addEventListener("wheel", handleScroll, { passive: false });

    return () => {
      section.removeEventListener("wheel", handleScroll);
      window.removeEventListener("resize", updateBounds);
    };
  }, [maxOffset, x]);

  return (
    <section
      ref={sectionRef}
      className="relative mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16 lg:px-8 lg:pt-24"
    >
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-10 text-center text-4xl font-semibold text-neutral-900 sm:text-5xl lg:mb-14"
      >
        Certifications
      </motion.h1>
      <div className="relative min-h-[420px]">
        {/* Edge fade */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-white to-transparent z-10" />

        <div ref={viewportRef} className="overflow-hidden pb-6 px-2 sm:px-4">
          <motion.div
            ref={trackRef}
            style={{ x: xSmooth }}
            className="flex gap-6"
          >
            {certifications.map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}
                className="relative min-w-[280px] sm:min-w-[320px] lg:min-w-[320px] rounded-2xl border border-black/10 bg-white p-6 shadow-[0_16px_50px_-30px_rgba(0,0,0,0.45)] transition-transform duration-200 hover:-translate-y-1 hover:border-black/20 hover:z-10"
              >
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="relative h-32 w-32 select-none sm:h-36 sm:w-36 lg:h-44 lg:w-44">
                    <Image
                      src={c.badge}
                      alt={`${c.title} badge`}
                      fill
                      className="object-contain select-none pointer-events-none"
                      draggable={false}
                    />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-semibold text-neutral-900 sm:text-lg">
                      {c.title}
                    </h3>
                    <p className="text-md text-neutral-600">{c.issuer}</p>
                    <p className="text-s text-neutral-500">{c.date}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
