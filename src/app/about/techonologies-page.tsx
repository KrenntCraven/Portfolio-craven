"use client";

import {
  CloudIcon,
  CodeBracketIcon,
  ServerStackIcon,
  WindowIcon,
} from "@heroicons/react/24/solid";
import {
  ArrowPathIcon,
  CircleStackIcon,
  CommandLineIcon,
} from "@heroicons/react/24/outline";
import { motion, type Variants } from "framer-motion";
import { useState, type ComponentType, type JSX, type SVGProps } from "react";
import { FaAws, FaJava, FaMicrosoft } from "react-icons/fa";
import {
  SiCss,
  SiDocker,
  SiFirebase,
  SiFlutter,
  SiGithub,
  SiGooglecloud,
  SiHtml5,
  SiJavascript,
  SiNextdotjs,
  SiNodedotjs,
  SiPhp,
  SiPython,
  SiReact,
  SiSharp,
  SiSupabase,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";
import { EASE, fadeUpItem, inViewProps, sectionReveal } from "../frontend/project-ui";
import { ABOUT_CARD, SectionHeader, SectionShell } from "./about-ui";
import { TechCategory, technologies } from "./technologies-data";

type IconType = ComponentType<{ className?: string } & SVGProps<SVGSVGElement>>;

const TECH_ICONS: Record<string, IconType> = {
  TypeScript: SiTypescript,
  JavaScript: SiJavascript,
  Java: FaJava,
  Python: SiPython,
  SQL: CircleStackIcon,
  "C#": SiSharp,
  "Node.js": SiNodedotjs,
  "ASP.NET": FaMicrosoft,
  PHP: SiPhp,
  "REST APIs": CommandLineIcon,
  Firebase: SiFirebase,
  Supabase: SiSupabase,
  React: SiReact,
  "Next.js": SiNextdotjs,
  "React Native": SiReact,
  Flutter: SiFlutter,
  "Tailwind CSS": SiTailwindcss,
  HTML: SiHtml5,
  CSS: SiCss,
  "AWS (EC2, S3, Lambda, CloudWatch)": FaAws,
  "Google Cloud Platform": SiGooglecloud,
  "Microsoft Azure (Azure AD)": FaMicrosoft,
  Docker: SiDocker,
  "Git / GitHub": SiGithub,
  "CI/CD": ArrowPathIcon,
};

// Shortened chip labels; the full string stays available as a tooltip.
const TECH_LABELS: Record<string, string> = {
  "AWS (EC2, S3, Lambda, CloudWatch)": "AWS",
  "Google Cloud Platform": "Google Cloud",
  "Microsoft Azure (Azure AD)": "Azure",
  "Git / GitHub": "Git & GitHub",
};

const CATEGORY_ICONS: Record<string, IconType> = {
  Languages: CodeBracketIcon,
  Backend: ServerStackIcon,
  Frontend: WindowIcon,
  "Cloud & DevOps": CloudIcon,
};

const chipContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.035, delayChildren: 0.05 } },
};

const chipItem: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } },
};

function TechChip({ name }: { name: string }) {
  const Icon = TECH_ICONS[name];
  const label = TECH_LABELS[name] ?? name;

  return (
    <motion.li variants={chipItem}>
      <span
        title={name}
        className="group/chip inline-flex items-center gap-2 rounded-xl border border-neutral-200/90 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#6c5ce7]/40 hover:bg-[#6c5ce7]/5 hover:text-neutral-900 hover:shadow-[0_10px_24px_-16px_rgba(108,92,231,0.6)]"
      >
        {Icon && (
          <Icon className="h-4 w-4 shrink-0 text-neutral-400 transition-colors duration-200 group-hover/chip:text-[#6c5ce7]" />
        )}
        {label}
      </span>
    </motion.li>
  );
}

export const Technologies = (): JSX.Element => {
  const [spinningIndex, setSpinningIndex] = useState<number | null>(null);

  return (
    <div className="relative border-t border-neutral-100 bg-white pb-20">
      <SectionShell id="technologies">
        <SectionHeader
          eyebrow="Stack"
          title="Technologies & tools"
          subtitle="What's actually running under the projects and roles above."
        />

        <motion.div
          {...inViewProps}
          variants={sectionReveal}
          className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-2 lg:gap-6"
        >
          {technologies.map((category: TechCategory, index) => {
            const CategoryIcon = CATEGORY_ICONS[category.title] ?? CodeBracketIcon;

            return (
              <motion.article
                key={category.title}
                variants={fadeUpItem}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25 }}
                className={`group relative overflow-hidden ${ABOUT_CARD} p-6 sm:p-7 hover:border-[#6c5ce7]/30 hover:shadow-[0_28px_70px_-32px_rgba(108,92,231,0.35)]`}
              >
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-linear-to-r from-[#6c5ce7] to-[#a29bfe] transition-transform duration-300 ease-out group-hover:scale-x-100"
                />

                <div className="mb-5 flex items-center gap-3.5">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    animate={spinningIndex === index ? { rotate: 360 } : { rotate: 0 }}
                    transition={{ duration: 0.6, ease: EASE }}
                    onPointerDown={(event) => {
                      if (event.pointerType !== "touch") return;
                      setSpinningIndex(index);
                      window.setTimeout(() => setSpinningIndex(null), 650);
                    }}
                    className="flex h-11 w-11 items-center justify-center rounded-xl bg-neutral-900 text-white shadow-[0_12px_34px_-14px_rgba(15,23,42,0.6)]"
                  >
                    <CategoryIcon className="h-5 w-5" />
                  </motion.div>
                  <div className="flex flex-1 items-baseline justify-between">
                    <h3 className="text-lg font-bold tracking-tight text-neutral-900 sm:text-xl">
                      {category.title}
                    </h3>
                    <span className="text-xs font-semibold tabular-nums text-neutral-400">
                      {String(category.items.length).padStart(2, "0")}
                    </span>
                  </div>
                </div>

                <motion.ul
                  variants={chipContainer}
                  className="flex flex-wrap gap-2"
                >
                  {category.items.map((item) => (
                    <TechChip key={item} name={item} />
                  ))}
                </motion.ul>
              </motion.article>
            );
          })}
        </motion.div>
      </SectionShell>
    </div>
  );
};
