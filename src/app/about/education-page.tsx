"use client";
import { motion } from "framer-motion";
import { educationItems } from "./education-data";

interface EducationItem {
  title: string;
  institution: string;
  period: string;
  details: string[];
}

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

export const Education = (): JSX.Element => {
  return (
    <main className="relative min-h-0 overflow-hidden bg-white text-neutral-900 pt-10 sm:pt-20 md:pt-10 lg:pt-2">
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,0,0,0.05),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(0,0,0,0.03),transparent_28%)]" />
        <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-black/5 via-transparent to-transparent" />
        <div className="absolute inset-x-12 sm:inset-x-24 bottom-[-12rem] h-72 rounded-[36px] bg-black/5 blur-3xl" />
      </div>
      <section className="relative mx-auto max-w-6xl px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16 lg:px-8 lg:pt-24">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12 text-center text-4xl font-semibold text-neutral-900 sm:text-5xl lg:mb-16"
        >
          Education
        </motion.h1>

        <div className="space-y-8 sm:space-y-12">
          {educationItems.map((item, index) => (
            <motion.div
              key={index}
              {...fadeUp}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.2 + index * 0.1, duration: 0.7 }}
              className="relative"
            >
              {index !== educationItems.length - 1 && (
                <div className="absolute left-4 top-12 h-full w-0.5 bg-gradient-to-b from-neutral-400 via-neutral-300 to-transparent sm:left-6" />
              )}
              <div className="absolute left-2.5 top-6 h-3 w-3 rounded-full bg-neutral-900 ring-4 ring-white shadow-lg sm:left-4.5" />

              <div className="ml-12 sm:ml-16">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="space-y-3 sm:space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <h2 className="text-2xl font-semibold text-neutral-900 sm:text-3xl">
                      {item.title}
                    </h2>
                    <span className="whitespace-nowrap text-base font-medium text-neutral-800 sm:text-base md:text-lg lg:text-xl">
                      {item.period}
                    </span>
                  </div>

                  <h3 className="text-lg font-medium text-neutral-700 sm:text-xl">
                    {item.institution}
                  </h3>

                  <ul className="space-y-2 text-base text-neutral-700 sm:text-lg">
                    {item.details.map((detail, i) => {
                      const labels = ["Relevant coursework:", "Grade:", "GWA:"];
                      const foundLabel = labels.find((l) =>
                        detail.startsWith(l),
                      );
                      const content = foundLabel
                        ? detail.slice(foundLabel.length).trim()
                        : detail;

                      return (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            duration: 0.4,
                            delay: 0.4 + index * 0.1 + i * 0.05,
                          }}
                          className="flex items-start gap-3 leading-[2.2] sm:leading-loose lg:leading-loose"
                        >
                          <span className="text-justify hyphens-auto sm:hyphens-auto md:hyphens-auto lg:hyphens-none">
                            {foundLabel ? (
                              <>
                                <strong className="font-semibold">
                                  {foundLabel.charAt(0).toUpperCase() +
                                    foundLabel.slice(1)}
                                </strong>{" "}
                                {content}
                              </>
                            ) : (
                              detail
                            )}
                          </span>
                        </motion.li>
                      );
                    })}
                  </ul>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
};
