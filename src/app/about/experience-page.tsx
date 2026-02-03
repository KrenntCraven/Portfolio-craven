"use client";
import { motion } from "framer-motion";

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const experiences = [
  {
    company: "Company Name",
    position: "Software Engineer",
    period: "2024 - Present",
    description: [
      "Developed and maintained scalable web applications using React and Next.js",
      "Collaborated with cross-functional teams to deliver high-quality products",
      "Implemented best practices for code quality and performance optimization",
    ],
  },
  {
    company: "Previous Company",
    position: "Junior Developer",
    period: "2021 - 2023",
    description: [
      "Built responsive user interfaces with modern frontend frameworks",
      "Worked on backend APIs using Node.js and Express",
      "Participated in code reviews and agile development processes",
    ],
  },
  {
    company: "Internship Company",
    position: "Software Engineering Intern",
    period: "2020 - 2021",
    description: [
      "Assisted in developing internal tools and automation scripts",
      "Learned industry best practices and software development lifecycle",
      "Contributed to documentation and testing processes",
    ],
  },
];

export default function ExperiencePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-white text-neutral-900 pt-16 sm:pt-20 md:pt-24 lg:pt-28">
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,0,0,0.05),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(0,0,0,0.03),transparent_28%)]" />
        <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-black/5 via-transparent to-transparent" />
        <div className="absolute inset-x-12 sm:inset-x-24 bottom-[-12rem] h-72 rounded-[36px] bg-black/5 blur-3xl" />
      </div>

      <section className="relative mx-auto max-w-6xl px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16 lg:px-8 lg:pt-24">
        {/* Page Title */}
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12 text-center text-4xl font-semibold text-neutral-900 sm:text-5xl lg:mb-16"
        >
          Work Experience
        </motion.h1>

        {/* Experience Timeline */}
        <div className="space-y-8 sm:space-y-12">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              {...fadeUp}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.2 + index * 0.1, duration: 0.7 }}
              className="relative"
            >
              {/* Timeline Line */}
              {index !== experiences.length - 1 && (
                <div className="absolute left-4 top-12 h-full w-0.5 bg-gradient-to-b from-black/20 to-transparent sm:left-6" />
              )}

              {/* Timeline Dot */}
              <div className="absolute left-2.5 top-6 h-3 w-3 rounded-full bg-black/80 ring-4 ring-white shadow-lg sm:left-4.5" />

              {/* Content */}
              <div className="ml-12 sm:ml-16">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="space-y-3 sm:space-y-4"
                >
                  {/* Company and Period */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <h2 className="text-2xl font-semibold text-neutral-900 sm:text-3xl">
                      {exp.company}
                    </h2>
                    <span className="text-sm font-medium text-neutral-600 sm:text-base">
                      {exp.period}
                    </span>
                  </div>

                  {/* Position */}
                  <h3 className="text-lg font-medium text-neutral-700 sm:text-xl">
                    {exp.position}
                  </h3>

                  {/* Description */}
                  <ul className="space-y-2 text-base text-neutral-700 sm:text-lg">
                    {exp.description.map((item, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: 0.4,
                          delay: 0.4 + index * 0.1 + i * 0.05,
                        }}
                        className="flex items-start gap-3 leading-relaxed"
                      >
                        <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-neutral-500" />
                        <span className="text-justify">{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}
