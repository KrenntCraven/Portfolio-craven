"use client";

import { Button } from "@heroui/button";
import { motion } from "framer-motion";
import { socials } from "./socials-link";

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-white text-neutral-900 pt-16 sm:pt-20 md:pt-24 lg:pt-28">
      {" "}
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,0,0,0.05),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(0,0,0,0.03),transparent_28%)]" />
        <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-black/5 via-transparent to-transparent" />
        <div className="absolute inset-x-12 sm:inset-x-24 bottom-[-12rem] h-72 rounded-[36px] bg-black/5 blur-3xl" />
      </div>
      <section className="relative mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 pb-16 pt-12 sm:gap-10 sm:px-6 sm:pb-20 sm:pt-16 lg:flex-row lg:items-center lg:gap-16 lg:px-8 lg:pt-24">
        {/* Avatar Card - Mobile First (appears first on mobile) */}
        <motion.div
          {...fadeUp}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.1, duration: 0.7 }}
          className="w-full max-w-sm lg:order-2 lg:flex-1"
        >
          <div className="relative mx-auto rounded-[28px] sm:rounded-[32px] border border-white/35 bg-white/40 p-5 sm:p-6 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.5)] sm:shadow-[0_25px_80px_-35px_rgba(0,0,0,0.55)] backdrop-blur-xl">
            <div className="absolute inset-0 rounded-[28px] sm:rounded-[32px] bg-[linear-gradient(120deg,rgba(255,255,255,0.12),transparent_45%),radial-gradient(circle_at_30%_20%,rgba(0,0,0,0.08),transparent_36%)]" />
            <div className="relative flex flex-col items-center gap-4 sm:gap-5">
              <div className="relative flex h-36 w-36 sm:h-44 sm:w-44 items-center justify-center overflow-hidden rounded-full border border-white/50 bg-gradient-to-br from-white via-[#f7f7f7] to-black/8 text-base sm:text-lg font-semibold text-neutral-800 shadow-inner ring-1 ring-white/50 shadow-[0_15px_50px_-30px_rgba(0,0,0,0.6)] sm:shadow-[0_20px_60px_-35px_rgba(0,0,0,0.65)]">
                Avatar
              </div>
              <div className="rounded-xl sm:rounded-2xl border border-black/10 bg-white/80 px-4 py-3 sm:px-5 sm:py-4 text-center text-xs sm:text-sm text-neutral-700 shadow-sm">
                Available for web, mobile, and platform work. I care about
                clarity, polish, and shipping on schedule.
              </div>
            </div>
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
            className="inline-flex items-center gap-2 rounded-full bg-black/5 px-3 py-1.5 sm:px-4 sm:py-2 text-[0.65rem] sm:text-xs font-semibold uppercase tracking-[0.2em] sm:tracking-[0.24em] text-neutral-700"
          >
            <span className="h-1 w-1 rounded-full bg-neutral-800" aria-hidden />
            <motion.span
              initial={{ maxWidth: "0ch" }}
              animate={{ maxWidth: "40ch" }}
              transition={{ duration: 1.6, ease: "easeInOut", delay: 0.1 }}
              className="overflow-hidden whitespace-nowrap border-r border-neutral-800/60 pr-1"
            >
              Hello, I&apos;m Krennt Craven
            </motion.span>
          </motion.div>

          <h1 className="text-[1.75rem] font-semibold leading-tight text-neutral-900 sm:text-[2.35rem] md:text-[2.6rem] lg:text-[2.75rem]">
            Software Engineer Focused on Reliable Web and Mobile Solutions.
          </h1>

          <p className="max-w-2xl text-base sm:text-lg md:text-xl text-neutral-700">
            I turn ideas into scalable, real-world applications.
          </p>

          <div className="grid w-full max-w-xl grid-cols-2 gap-2.5 sm:gap-3 sm:grid-cols-4">
            {socials.map((item) => (
              <Button
                as={motion.a}
                key={item.label}
                href={item.href}
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
                whileHover={{
                  y: -2,
                  scale: 1.02,
                  boxShadow: "0 18px 55px -26px rgba(0,0,0,0.55)",
                  backgroundColor: "rgba(255,255,255,0.78)",
                  borderColor: "rgba(0,0,0,0.25)",
                }}
                whileTap={{ scale: 0.97, y: 0 }}
                transition={{ type: "spring", stiffness: 280, damping: 18 }}
                className="inline-flex items-center justify-center gap-1.5 sm:gap-2 overflow-hidden rounded-lg sm:rounded-xl border border-black/15 bg-white/55 px-3 py-2 sm:px-5 sm:py-2.5 text-sm sm:text-base font-semibold text-neutral-900 shadow-[0_8px_30px_-14px_rgba(0,0,0,0.4)] sm:shadow-[0_10px_40px_-16px_rgba(0,0,0,0.45)] backdrop-blur-lg"
              >
                {item.label}
              </Button>
            ))}
          </div>
        </motion.div>
      </section>
    </main>
  );
}
