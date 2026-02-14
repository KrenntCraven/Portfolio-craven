"use client";

import { Button } from "@heroui/button";
import { animate, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { socials } from "./socials-link";

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

export default function LandingPage() {
  const isSnappingRef = useRef(false);

  const smoothScrollTo = (targetY: number) => {
    if (isSnappingRef.current) return;
    isSnappingRef.current = true;
    animate(window.scrollY, targetY, {
      duration: 0.8,
      ease: "easeInOut",
      onUpdate: (latest) => window.scrollTo(0, latest),
      onComplete: () => {
        isSnappingRef.current = false;
      },
    });
  };

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      if (isSnappingRef.current) return;

      const projectsSection = document.getElementById("projects");
      if (!projectsSection) return;

      const projectsTop =
        projectsSection.getBoundingClientRect().top + window.scrollY;
      const currentY = window.scrollY;
      const delta = event.deltaY;

      if (delta > 0 && currentY < projectsTop - 40) {
        event.preventDefault();
        smoothScrollTo(projectsTop);
      }

      if (delta < 0 && currentY >= projectsTop - 40) {
        event.preventDefault();
        smoothScrollTo(0);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  const handleSocialClick = (
    event: React.MouseEvent<Element>,
    href: string,
  ) => {
    const isHashLink = href.startsWith("/#") || href.startsWith("#");
    if (!isHashLink) return;

    const hash = href.split("#")[1];
    if (!hash) return;

    const target = document.getElementById(hash);
    if (!target) return;

    event.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 96;
    smoothScrollTo(top);
    history.replaceState(null, "", `/#${hash}`);
  };

  return (
    <main className="relative overflow-hidden bg-white text-neutral-900 pt-16 sm:pt-20 md:pt-24 lg:pt-28 min-h-[820px]">
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,0,0,0.05),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(0,0,0,0.03),transparent_28%)]" />
        <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-black/5 via-transparent to-transparent" />
        <div className="absolute inset-x-12 sm:inset-x-24 bottom-[-12rem] h-72 rounded-[36px] bg-black/5 blur-3xl" />
      </div>
      <section className="relative mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 pb-16 pt-12 sm:gap-10 sm:px-6 sm:pb-20 sm:pt-16 lg:flex-row lg:items-center lg:gap-16 lg:px-8 lg:pt-24">
        {/* Avatar - Mobile First (appears first on mobile) */}
        <motion.div
          {...fadeUp}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.1, duration: 0.7 }}
          className="w-full max-w-sm lg:order-2 lg:flex-1"
        >
          <div className="relative flex flex-col items-center gap-4 sm:gap-5">
            {/* Avatar Image */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="relative h-40 w-40 xs:h-48 xs:w-48 sm:h-56 sm:w-56 md:h-64 md:w-64 lg:h-72 lg:w-72"
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
            </motion.div>
          </div>
        </motion.div>

        {/* Text Content - Second on mobile */}
        <motion.div
          {...fadeUp}
          initial="initial"
          animate="animate"
          className="w-full space-y-5 sm:space-y-6 lg:order-1 lg:flex-1"
        >
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center gap-3 rounded-full bg-black/5 px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-semibold uppercase tracking-[0.26em] sm:tracking-[0.28em] text-neutral-700"
          >
            <span
              className="h-1.5 w-1.5 rounded-full bg-neutral-800"
              aria-hidden
            />
            <motion.span
              initial={{ maxWidth: "0ch" }}
              animate={{ maxWidth: "40ch" }}
              transition={{ duration: 1.6, ease: "easeInOut", delay: 0.1 }}
              className="overflow-hidden whitespace-nowrap border-r border-neutral-800/60 pr-1"
            >
              Hello, I&apos;m Krennt Craven
            </motion.span>
          </motion.div>

          <h1 className="text-[1.75rem] font-semibold leading-tight text-neutral-800 sm:text-[2.35rem] md:text-[2.6rem] lg:text-[2.75rem]">
            Software Engineer Focused on Reliable Web and Mobile Solutions.
          </h1>

          <p className="max-w-2xl text-base sm:text-lg md:text-xl text-neutral-600">
            I turn ideas into scalable, real-world applications.
          </p>

          <div className="grid w-full max-w-xl grid-cols-2 gap-2.5 sm:gap-3 sm:grid-cols-4">
            {socials
              .filter((item) => item.label !== "Facebook")
              .map((item) => (
                <motion.div
                  key={item.label}
                  whileHover={{
                    y: -2,
                    scale: 1.02,
                  }}
                  whileTap={{ scale: 0.97, y: 0 }}
                  transition={{ type: "spring", stiffness: 280, damping: 18 }}
                >
                  <Button
                    as="a"
                    href={item.href}
                    onClick={(event) => handleSocialClick(event, item.href)}
                    {...(item.external && {
                      target: "_blank",
                      rel: "noopener noreferrer",
                    })}
                    startContent={
                      <span className="text-neutral-900 text-sm sm:text-base">
                        {item.icon}
                      </span>
                    }
                    variant="bordered"
                    radius="lg"
                    fullWidth
                    className="inline-flex items-center justify-center gap-1.5 sm:gap-2 overflow-hidden rounded-lg sm:rounded-xl border border-black/15 bg-white/55 px-3 py-2 sm:px-5 sm:py-2.5 text-sm sm:text-base font-semibold text-neutral-900 shadow-[0_8px_30px_-14px_rgba(0,0,0,0.4)] sm:shadow-[0_10px_40px_-16px_rgba(0,0,0,0.45)] backdrop-blur-lg hover:bg-white/80 hover:border-black/25 hover:shadow-[0_18px_55px_-26px_rgba(0,0,0,0.55)]"
                  >
                    {item.label}
                  </Button>
                </motion.div>
              ))}
          </div>
        </motion.div>
      </section>
    </main>
  );
}
