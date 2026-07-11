"use client";

import { MotionConfig, animate, motion, useTransform } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { EASE, FOCUS_RING } from "../project-ui";
import { BannerBackground } from "../banner-background";
import { useContactModal } from "../contact-modal/contact-modal-context";
import { useMouseParallax } from "../use-mouse-parallax";
import { getSocials } from "./socials-link";

/* ------------------------------------------------------------------ */
/* Motion presets — staggered hero entrance                           */
/* ------------------------------------------------------------------ */
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.12 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

// Developer-inspired glass terminal card ("deploy --prod" element).
function TerminalCard() {
  return (
    <div
      className="w-52 overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/95 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.7)] backdrop-blur-xl xl:w-60"
      aria-hidden
    >
      <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-2 text-[11px] font-medium text-neutral-500">
          ~/krennt-craven
        </span>
      </div>
      <div className="space-y-1.5 px-4 py-4 font-mono text-[12px] leading-relaxed">
        <p className="text-neutral-400">
          <span className="text-[#a29bfe]">$</span> deploy --prod
        </p>
        <p className="text-neutral-300">
          <span className="text-[#28c840]">✔</span> build{" "}
          <span className="text-neutral-500">ready in 4.2s</span>
        </p>
        <p className="text-neutral-300">
          <span className="text-[#28c840]">✔</span> tests{" "}
          <span className="text-neutral-500">128 passed</span>
        </p>
        <p className="text-neutral-300">
          <span className="text-[#28c840]">✔</span> cloud infra{" "}
          <span className="text-neutral-500">provisioned</span>
        </p>
        <p className="flex items-center gap-1 text-neutral-100">
          <span className="text-[#a29bfe]">▲</span> live at scale
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
            className="ml-0.5 inline-block h-3.5 w-1.5 bg-[#6c5ce7]"
          />
        </p>
      </div>
    </div>
  );
}

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>
  );
}

export default function LandingPageClient() {
  const isSnappingRef = useRef(false);
  const { open: openContact } = useContactModal();

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

  const scrollToProjects = () => {
    const el = document.getElementById("projects");
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    smoothScrollTo(top);
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

  const socials = getSocials().filter((s) => s.label !== "Facebook");

  // Mouse parallax – avatar 3D tilt + floating shapes (desktop only)
  const { x: mx, y: my, skip: skipParallax } = useMouseParallax();
  const tiltX = useTransform(my, [0, 1], [6, -6]);
  const tiltY = useTransform(mx, [0, 1], [-6, 6]);
  const avatarTx = useTransform(mx, [0, 1], [-8, 8]);
  const avatarTy = useTransform(my, [0, 1], [-6, 6]);

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative isolate min-h-[820px] overflow-hidden bg-white pt-16 text-neutral-900 dark:bg-background dark:text-foreground sm:pt-20 md:pt-24 lg:pt-28">
        <BannerBackground />

        {/* Subtle developer grid overlay */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-1"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(108,92,231,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(108,92,231,0.05) 1px, transparent 1px)",
            backgroundSize: "46px 46px",
            maskImage:
              "radial-gradient(ellipse 70% 55% at 50% 32%, #000 30%, transparent 76%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 70% 55% at 50% 32%, #000 30%, transparent 76%)",
          }}
        />

        <section
          aria-label="Introduction"
          className="relative z-10 mx-auto flex max-w-6xl flex-col items-center gap-10 px-4 pb-24 pt-10 sm:gap-12 sm:px-6 sm:pb-28 sm:pt-14 lg:flex-row lg:items-center lg:gap-16 lg:px-8 lg:pt-20"
        >
          {/* ---------- Content ---------- */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="order-2 w-full space-y-8 lg:order-1 lg:flex-1"
          >
            {/* Message group — identity, headline, copy */}
            <motion.div variants={item} className="space-y-6">
              <div className="inline-flex items-center gap-2.5 rounded-full border border-black/5 bg-black/4 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-neutral-700 sm:text-sm">
                <span className="relative flex h-2 w-2" aria-hidden>
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#6c5ce7]/60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#6c5ce7]" />
                </span>
                Full-Stack &amp; Cloud Engineer
              </div>

              <h1 className="text-4xl font-bold leading-[1.05] tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl">
                Hi, I&apos;m Krennt Craven
              </h1>

              <p className="max-w-xl text-lg leading-relaxed text-neutral-600 sm:text-xl">
                Full-stack engineer building{" "}
                <span className="font-semibold bg-linear-to-r from-[#6c5ce7] to-[#a29bfe] bg-clip-text text-transparent">
                  scalable, cloud-native systems
                </span>{" "}
                — reliable from first commit to production.
              </p>
            </motion.div>

            {/* Actions — CTAs grouped above social icons */}
            <motion.div variants={item} className="flex flex-col gap-5">
              <div className="flex flex-wrap items-center gap-3">
                <motion.button
                  type="button"
                  onClick={scrollToProjects}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className={`group inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_40px_-16px_rgba(0,0,0,0.55)] transition-colors hover:bg-neutral-800 sm:text-base ${FOCUS_RING}`}
                >
                  View Featured
                  <ChevronDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
                </motion.button>

                <motion.button
                  type="button"
                  onClick={openContact}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className={`inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white/60 px-6 py-3 text-sm font-semibold text-neutral-800 shadow-sm backdrop-blur transition-colors hover:border-[#6c5ce7]/40 hover:bg-[#6c5ce7]/5 hover:text-[#6c5ce7] sm:text-base ${FOCUS_RING}`}
                >
                  Get in touch
                </motion.button>
              </div>

              <div className="flex items-center gap-2.5">
                {socials.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    onClick={(event) => handleSocialClick(event, social.href)}
                    aria-label={social.label}
                    title={social.label}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    {...(social.external && {
                      target: "_blank",
                      rel: "noopener noreferrer",
                    })}
                    {...("download" in social &&
                      social.download && { download: social.download })}
                    className={`inline-flex h-11 w-11 items-center justify-center rounded-xl border border-black/10 bg-white/55 text-neutral-600 shadow-sm backdrop-blur transition-colors hover:border-[#6c5ce7]/40 hover:bg-[#6c5ce7]/5 hover:text-[#6c5ce7] ${FOCUS_RING}`}
                  >
                    <span className="h-5 w-5">{social.icon}</span>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* ---------- Visual ---------- */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
            className="order-1 w-full max-w-sm lg:order-2 lg:flex-1"
            style={skipParallax ? undefined : { perspective: 800 }}
          >
            <div className="relative mx-auto flex w-full max-w-md justify-center">
              <motion.div
                className="relative flex flex-col items-center"
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
                {/* Glow */}
                <div
                  aria-hidden
                  className="absolute left-1/2 top-1/2 -z-10 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6c5ce7]/10 blur-3xl"
                />

                {/* Avatar circle */}
                <motion.div
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4, ease: EASE }}
                  className="relative h-44 w-44 xs:h-52 xs:w-52 sm:h-60 sm:w-60 md:h-64 md:w-64 lg:h-72 lg:w-72"
                >
                  <div className="absolute inset-0 overflow-hidden rounded-full border-4 border-white/60 shadow-2xl">
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

                  {/* deploy-prod terminal — lower-right of the avatar (desktop) */}
                  <motion.div
                    aria-hidden
                    initial={{ opacity: 0, x: 24, y: 8, scale: 0.94 }}
                    animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                    transition={{ duration: 0.7, delay: 0.75, ease: EASE }}
                    className="absolute left-[60%] top-[82%] z-20 hidden -translate-y-1/2 lg:block"
                  >
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      whileHover={{ scale: 1.03 }}
                      className="group relative"
                    >
                      <div
                        aria-hidden
                        className="absolute -inset-3 -z-10 rounded-3xl bg-[#6c5ce7]/25 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
                      />
                      <TerminalCard />
                    </motion.div>
                  </motion.div>
                </motion.div>

                {/* Logo below avatar */}
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
            </div>
          </motion.div>
        </section>

        {/* Scroll to explore */}
        <motion.button
          type="button"
          onClick={scrollToProjects}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          aria-label="Scroll to projects"
          className={`absolute bottom-5 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-neutral-500 transition-colors hover:text-[#6c5ce7] sm:flex ${FOCUS_RING} rounded-lg`}
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em]">
            Scroll to explore
          </span>
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="flex h-9 w-5 items-start justify-center rounded-full border-2 border-current p-1"
          >
            <span className="h-1.5 w-1 rounded-full bg-current" />
          </motion.span>
        </motion.button>
      </div>
    </MotionConfig>
  );
}
