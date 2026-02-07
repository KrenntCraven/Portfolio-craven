"use client";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { MouseEvent } from "react";
import { useState } from "react";
import { usePageTransition } from "../page-transition/page-transition";

// Logo import
import Logo from "../../Logo.svg";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/#projects", label: "Projects" },
  { href: "/about", label: "About" },
];

export default function NavigationBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const { scrollY } = useScroll();
  const { startTransition } = usePageTransition();

  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ["rgba(255, 255, 255, 0.72)", "rgba(255, 255, 255, 0.92)"],
  );

  const boxShadow = useTransform(
    scrollY,
    [0, 100],
    ["0 2px 10px rgba(0, 0, 0, 0.08)", "0 12px 36px rgba(0, 0, 0, 0.12)"],
  );

  useMotionValueEvent(scrollY, "change", (latest) => {
    const isNearTop = latest <= 8;
    setIsHidden(!isNearTop);
  });

  const handleNavigate = (
    event: MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    const isHashLink = href.startsWith("/#") || href.startsWith("#");
    const shouldAnimateHash = href === "/#projects";
    if (isHashLink && !shouldAnimateHash) {
      setIsMenuOpen(false);
      return;
    }
    event.preventDefault();
    setIsMenuOpen(false);
    startTransition(href);
  };

  return (
    <>
      <motion.nav
        style={{ backgroundColor, boxShadow }}
        className="fixed top-4 left-1/2 z-50 w-[95vw] -translate-x-1/2 rounded-2xl border border-black/6 backdrop-blur-2xl transition-all duration-300 shadow-lg shadow-black/10"
        initial={{ y: -100 }}
        animate={{ y: isHidden ? -120 : 0 }}
        transition={{
          duration: isHidden ? 0.25 : 0.12,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo - Left Side */}
            <motion.div
              className="flex-shrink-0"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link
                href="/"
                className="group flex items-center"
                onClick={(event) => handleNavigate(event, "/")}
              >
                <motion.div
                  className="relative flex h-12 w-12 items-center justify-center overflow-hidden "
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-tr from-white/15 to-transparent"
                    animate={{ rotate: [0, 360] }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  <Image
                    src={Logo}
                    alt="KC Logo"
                    className="relative z-10 h-11 w-11 object-contain"
                    priority
                  />
                </motion.div>
              </Link>
            </motion.div>

            {/* Navigation Links - Middle (Desktop) */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -4, scale: 1.05, rotate: -0.4 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                >
                  <Link
                    href={link.href}
                    onClick={(event) => handleNavigate(event, link.href)}
                    className="group relative px-4 py-2 text-black/80 font-medium transition-all duration-300"
                    style={{
                      fontSize: "24px",
                      lineHeight: "normal",
                      letterSpacing: "0.4px",
                    }}
                  >
                    <span className="relative z-10 transition-colors duration-300 group-hover:text-black">
                      {link.label}
                    </span>
                    <motion.div
                      className="absolute inset-0 rounded-lg bg-gradient-to-r from-black/0 via-black/10 to-black/0 opacity-0"
                      whileHover={{ opacity: 1, scale: 1.05 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    />
                    <motion.div
                      className="absolute bottom-0 left-1/2 h-0.5 w-0 rounded-full bg-black/80 shadow-lg shadow-black/20"
                      initial={{ width: 0, x: "-50%" }}
                      whileHover={{
                        width: "100%",
                        scale: 1.05,
                        boxShadow: "0 0 18px rgba(0,0,0,0.25)",
                      }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Contact Button - Right Side (Desktop) */}
            <motion.div
              className="hidden md:block flex-shrink-0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <motion.div
                whileHover={{ scale: 1.07, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/#contact"
                  className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg border border-black/10 bg-black px-5 py-2.5 shadow-lg shadow-black/20 transition-all duration-300 hover:bg-white hover:border-black/30"
                  style={{
                    fontSize: "18px",
                    lineHeight: "normal",
                    letterSpacing: "0.4px",
                  }}
                >
                  <motion.span
                    className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-0"
                    initial={{ scale: 1 }}
                    whileHover={{ opacity: 1, scale: 1.1 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  />
                  <span
                    className="relative z-10 font-semibold text-white transition-colors duration-300 group-hover:text-black"
                    style={{
                      letterSpacing: "0.4px",
                    }}
                  >
                    Contact me
                  </span>
                </Link>
              </motion.div>
            </motion.div>

            {/* Mobile Menu Button */}
            <motion.div
              className="md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="relative z-50 p-2 text-black transition-colors hover:text-black focus:outline-none"
                aria-label="Toggle menu"
              >
                <motion.div
                  animate={isMenuOpen ? "open" : "closed"}
                  className="w-6 h-5 flex flex-col justify-between"
                >
                  <motion.span
                    className="w-full h-0.5 bg-current rounded-full"
                    variants={{
                      closed: { rotate: 0, y: 0 },
                      open: { rotate: 45, y: 9 },
                    }}
                    transition={{ duration: 0.3 }}
                  />
                  <motion.span
                    className="w-full h-0.5 bg-current rounded-full"
                    variants={{ closed: { opacity: 1 }, open: { opacity: 0 } }}
                    transition={{ duration: 0.3 }}
                  />
                  <motion.span
                    className="w-full h-0.5 bg-current rounded-full"
                    variants={{
                      closed: { rotate: 0, y: 0 },
                      open: { rotate: -45, y: -9 },
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              </button>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* Full Screen Mobile Menu */}
      <motion.div
        initial={false}
        animate={isMenuOpen ? "open" : "closed"}
        variants={{
          open: { opacity: 1, pointerEvents: "auto" },
          closed: { opacity: 0, pointerEvents: "none" },
        }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-40 md:hidden bg-white/95 backdrop-blur-xl"
      >
        <div className="flex h-full items-center justify-center px-6">
          <motion.div
            variants={{
              open: { opacity: 1, y: 0 },
              closed: { opacity: 0, y: 20 },
            }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="w-full max-w-md space-y-6"
          >
            {/* Navigation Links */}
            {navLinks.map((link, index) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, x: -20 }}
                animate={
                  isMenuOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }
                }
                transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
              >
                <Link
                  href={link.href}
                  onClick={(event) => handleNavigate(event, link.href)}
                  className="block rounded-2xl px-6 py-4 text-2xl font-semibold text-black text-center transition-all duration-200 hover:bg-black/5"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}

            {/* Contact Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={
                isMenuOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
              }
              transition={{ duration: 0.3, delay: 0.4 }}
              className="pt-4"
            >
              <Link
                href="/#contact"
                onClick={() => setIsMenuOpen(false)}
                className="relative block w-full overflow-hidden rounded-2xl border border-black/10 bg-black px-6 py-4 text-center text-lg text-white font-semibold shadow-lg shadow-black/20 transition-all duration-300 hover:bg-black/90"
              >
                <motion.span
                  className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-0"
                  initial={{ scale: 1 }}
                  whileHover={{ opacity: 1, scale: 1.1 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                />
                <motion.span
                  className="relative z-10 font-semibold text-white group-hover:text-black"
                  whileHover={{
                    letterSpacing: "0.6px",
                  }}
                  transition={{ duration: 0.25 }}
                >
                  Contact me
                </motion.span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}
