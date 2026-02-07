"use client";
import {
  CircleStackIcon,
  CodeBracketIcon,
  CommandLineIcon,
  CubeIcon,
} from "@heroicons/react/24/solid";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import type { JSX } from "react";
import { useEffect, useRef, useState } from "react";
import { TechCategory, technologies } from "./technologies-data";

const cardVariants = {
  initial: { opacity: 0, y: 30, scale: 0.95 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
};

const iconClassName =
  "h-6 w-6 min-h-6 min-w-6 sm:h-6 sm:w-6 text-white block shrink-0";

const renderIcon = (Icon: typeof CubeIcon): JSX.Element => (
  <Icon className={iconClassName} width={24} height={24} aria-hidden="true" />
);

const categoryIcons: Record<string, () => JSX.Element> = {
  Languages: () => renderIcon(CodeBracketIcon),
  Backend: () => renderIcon(CircleStackIcon),
  Frontend: () => renderIcon(CodeBracketIcon),
  "Cloud & DevOps": () => renderIcon(CommandLineIcon),
};

export const Technologies = (): JSX.Element => {
  const glowRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(cardsRef, { once: true, margin: "-100px" });
  const [spinningIndex, setSpinningIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!glowRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to(glowRef.current, {
        scale: 1.15,
        opacity: 0.7,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!titleRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        y: -30,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!cardsRef.current || !isInView) return;
    const cards = cardsRef.current.querySelectorAll(".tech-card");
    const ctx = gsap.context(() => {
      gsap.from(cards, {
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        clearProps: "all",
      });
    });
    return () => ctx.revert();
  }, [isInView]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-white via-neutral-50 to-white text-neutral-900 pt-16 sm:pt-20 md:pt-24 lg:pt-28">
      {/* Enhanced Background decorations */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(108,92,231,0.08),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(0,0,0,0.04),transparent_30%)]" />
        <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-neutral-900/5 via-transparent to-transparent" />
        <div
          ref={glowRef}
          className="absolute inset-x-12 sm:inset-x-24 bottom-[-14rem] h-80 rounded-[40px] bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-indigo-500/10 blur-3xl"
        />
      </div>

      <section className="relative mx-auto max-w-7xl px-4 pb-20 pt-12 sm:px-6 sm:pb-24 sm:pt-16 lg:px-8 lg:pt-24">
        <h1
          ref={titleRef}
          className="mb-12 text-center text-4xl font-semibold text-neutral-900 sm:text-5xl lg:mb-16"
        >
          Technologies & Tools
        </h1>

        <div ref={cardsRef} className="grid gap-6 sm:grid-cols-2 lg:gap-8">
          {technologies.map((category: TechCategory, index) => (
            <motion.div
              key={category.title}
              variants={cardVariants}
              initial="initial"
              animate="animate"
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.2 },
              }}
              transition={{ delay: 0.2 + index * 0.15, duration: 0.7 }}
              className="tech-card group relative overflow-hidden rounded-3xl border border-neutral-200/60 bg-white/70 p-8 shadow-xl backdrop-blur-md hover:shadow-2xl transition-shadow duration-300"
            >
              {/* Animated gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/0 via-purple-500/0 to-indigo-500/0 opacity-0 transition-opacity duration-500 group-hover:opacity-10" />

              {/* Card shine effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />

              <div className="relative flex items-center gap-4 mb-6">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  animate={
                    spinningIndex === index ? { rotate: 360 } : { rotate: 0 }
                  }
                  transition={{ duration: 0.6 }}
                  onPointerDown={(event) => {
                    if (event.pointerType !== "touch") return;
                    setSpinningIndex(index);
                    window.setTimeout(() => setSpinningIndex(null), 650);
                  }}
                  className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-neutral-800 to-neutral-900 text-white shadow-lg shadow-neutral-500/30"
                >
                  {(
                    categoryIcons[category.title] ||
                    (() => renderIcon(CubeIcon))
                  )()}
                </motion.div>
                <h2 className="text-2xl font-bold text-neutral-900">
                  {category.title}
                </h2>
              </div>

              <ul className="relative space-y-3 text-base text-neutral-700">
                {category.items.map((item, i) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.4 + index * 0.15 + i * 0.05,
                      duration: 0.4,
                    }}
                    className="flex items-start gap-3 leading-relaxed group/item"
                  >
                    <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-neutral-500 group-hover/item:scale-125 transition-transform duration-200" />

                    <span className="text-left sm:text-justify hyphens-none group-hover/item:text-neutral-900 transition-colors duration-200">
                      {item}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
};
