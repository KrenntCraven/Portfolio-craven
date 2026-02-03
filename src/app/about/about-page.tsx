"use client";
import { motion } from "framer-motion";
import Image from "next/image";

import ExperiencePage from "./experience-page";

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

export default function About() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-white text-neutral-900 pt-16 sm:pt-20 md:pt-24 lg:pt-28">
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,0,0,0.05),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(0,0,0,0.03),transparent_28%)]" />
        <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-black/5 via-transparent to-transparent" />
        <div className="absolute inset-x-12 sm:inset-x-24 bottom-[-12rem] h-72 rounded-[36px] bg-black/5 blur-3xl" />
      </div>

      <section className="relative mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 pb-16 pt-12 sm:gap-10 sm:px-6 sm:pb-20 sm:pt-16 lg:flex-row lg:items-start lg:gap-16 lg:px-8 lg:pt-24">
        {/* First Section - Left Column */}
        <motion.div
          {...fadeUp}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.1, duration: 0.7 }}
          className="w-full lg:flex-[1.5]"
        >
          <div className="w-full space-y-8">
            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center lg:text-left text-3xl font-semibold text-neutral-900 sm:text-4xl"
            >
              My Engineering Journey
            </motion.h2>

            <div className="space-y-6 text-base sm:text-lg text-neutral-700">
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="leading-relaxed text-justify"
              >
                I started with a foundation in Computer Engineering, where I
                developed strong problem-solving skills and an interest in
                building software that addresses real-world needs. Through
                internships and early professional experience,
              </motion.p>

              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="leading-relaxed text-justify"
              >
                I worked on both internal tools and user-facing applications,
                gaining hands-on experience across frontend, backend, and cloud
                technologies.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="leading-relaxed text-justify"
              >
                Today, I focus on building reliable, maintainable applications
                using modern frameworks, continuously improving through clean
                architecture and practical, scalable solutions.
              </motion.p>
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
              className="relative h-56 w-56 sm:h-64 sm:w-64 md:h-72 md:w-72"
            >
              <div className="relative h-full w-full overflow-hidden rounded-full border-4 border-white/50 shadow-2xl">
                <Image
                  src="/path-to-your-avatar.jpg"
                  alt="Your Name"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Logo Below Avatar */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="flex items-center justify-center -mt-4 sm:-mt-22"
              >
                <Image
                  src="/Logo-Avatar.svg"
                  alt="KC Logo"
                  width={140}
                  height={140}
                  className="drop-shadow-2xl"
                />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </section>
      <ExperiencePage />
    </main>
  );
}
