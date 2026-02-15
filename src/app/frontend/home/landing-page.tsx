"use client";

import { Button } from "@heroui/button";
import { animate, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { socials } from "./socials-link";

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

/** Apple-style banner background with mouse-reactive splash orbs (UI colors only) */
function BannerBackground() {
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const spring = { damping: 28, stiffness: 120 };
  const x = useSpring(mouseX, spring);
  const y = useSpring(mouseY, spring);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const nx = e.clientX / window.innerWidth;
      const ny = e.clientY / window.innerHeight;
      mouseX.set(nx);
      mouseY.set(ny);
    };
    const handleLeave = () => {
      mouseX.set(0.5);
      mouseY.set(0.5);
    };
    window.addEventListener("mousemove", handleMove);
    document.body.addEventListener("mouseleave", handleLeave);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      document.body.removeEventListener("mouseleave", handleLeave);
    };
  }, [mouseX, mouseY]);

  const move = 48;
  const orb1X = useTransform(x, [0, 1], [-move * 0.8, move * 0.8]);
  const orb1Y = useTransform(y, [0, 1], [-move * 0.6, move * 0.6]);
  const orb2X = useTransform(x, [0, 1], [move * 0.5, -move * 0.5]);
  const orb2Y = useTransform(y, [0, 1], [move * 0.4, -move * 0.4]);
  const orb3X = useTransform(x, [0, 1], [-move * 0.4, move * 0.4]);
  const orb3Y = useTransform(y, [0, 1], [move * 0.5, -move * 0.5]);
  const orb4X = useTransform(x, [0, 1], [move * 0.6, -move * 0.6]);
  const orb4Y = useTransform(y, [0, 1], [-move * 0.3, move * 0.3]);
  const orb5X = useTransform(x, [0, 1], [-move * 0.3, move * 0.3]);
  const orb5Y = useTransform(y, [0, 1], [-move * 0.5, move * 0.5]);

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      {/* Base gradient layer — from globals.css so it always applies */}
      <div className="landing-banner-base absolute inset-0" />
      {/* Top vignette */}
      <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-black/10 via-transparent to-transparent dark:from-white/5" />

      {/* Mouse-reactive orbs — classes from globals.css */}
      <motion.div
        className="absolute left-[10%] top-[18%] h-[320px] w-[320px] rounded-full opacity-90 dark:opacity-85"
        style={{ x: orb1X, y: orb1Y }}
      >
        <div className="landing-banner-orb-purple-1 h-full w-full rounded-full blur-3xl" />
      </motion.div>
      <motion.div
        className="absolute right-[5%] top-[25%] h-[280px] w-[280px] rounded-full opacity-85"
        style={{ x: orb2X, y: orb2Y }}
      >
        <div className="landing-banner-orb-neutral h-full w-full rounded-full blur-3xl" />
      </motion.div>
      <motion.div
        className="absolute bottom-[20%] left-[15%] h-[240px] w-[240px] rounded-full opacity-90"
        style={{ x: orb3X, y: orb3Y }}
      >
        <div className="landing-banner-orb-purple-2 h-full w-full rounded-full blur-3xl" />
      </motion.div>
      <motion.div
        className="absolute bottom-[15%] right-[12%] h-[360px] w-[360px] rounded-full opacity-80"
        style={{ x: orb4X, y: orb4Y }}
      >
        <div className="landing-banner-orb-neutral-2 h-full w-full rounded-full blur-3xl" />
      </motion.div>
      <motion.div
        className="absolute left-1/2 top-1/2 h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-80"
        style={{ x: orb5X, y: orb5Y }}
      >
        <div className="landing-banner-orb-purple-3 h-full w-full rounded-full blur-2xl" />
      </motion.div>

      {/* Subtle bottom glow */}
      <div className="absolute inset-x-12 sm:inset-x-24 -bottom-48 h-72 rounded-[36px] bg-black/5 blur-3xl dark:bg-white/5" />
    </div>
  );
}

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
    <main className="relative isolate overflow-hidden bg-white text-neutral-900 pt-16 sm:pt-20 md:pt-24 lg:pt-28 min-h-[820px] dark:bg-background dark:text-foreground">
      <BannerBackground />
      <section className="relative z-10 mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 pb-16 pt-12 sm:gap-10 sm:px-6 sm:pb-20 sm:pt-16 lg:flex-row lg:items-center lg:gap-16 lg:px-8 lg:pt-24">
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
                    {...("download" in item && item.download && { download: true })}
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
