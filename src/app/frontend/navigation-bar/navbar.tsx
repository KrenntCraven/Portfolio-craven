"use client";
import {
  AnimatePresence,
  MotionConfig,
  animate,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEvent } from "react";
import { useEffect, useState } from "react";
import { useContactModal } from "../contact-modal/contact-modal-context";
import { usePageTransition } from "../page-transition/page-transition";
import { ArrowRightIcon, EASE, Eyebrow, FOCUS_RING } from "../project-ui";

// Logo import
import Logo from "../../Logo.svg";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/#projects", label: "Featured" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
];

export default function NavigationBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<"home" | "featured">(
    "home",
  );
  const { open: openContactModal } = useContactModal();
  const { scrollY, scrollYProgress } = useScroll();
  const progressScaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  });
  const { startTransition } = usePageTransition();
  const pathname = usePathname();

  // Lock page scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 8);

    if (pathname === "/") {
      const projects = document.getElementById("projects");
      if (projects) {
        const projectsTop =
          projects.getBoundingClientRect().top + latest;
        setActiveSection(
          latest >= projectsTop - window.innerHeight * 0.4
            ? "featured"
            : "home",
        );
      }
    }
  });

  const isActive = (href: string) => {
    if (pathname === "/") {
      if (href === "/") return activeSection === "home";
      if (href === "/#projects") return activeSection === "featured";
      return false;
    }
    if (href === "/about") return pathname.startsWith("/about");
    if (href === "/projects") {
      return pathname === "/projects" || pathname.startsWith("/projects/");
    }
    return false;
  };

  const smoothScrollTo = (targetY: number) => {
    animate(window.scrollY, targetY, {
      duration: 0.8,
      ease: "easeInOut",
      onUpdate: (latest) => window.scrollTo(0, latest),
    });
  };

  const handleNavigate = (
    event: MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    const isHashLink = href.startsWith("/#") || href.startsWith("#");
    if (isHashLink) {
      setIsMenuOpen(false);
      const hash = href.split("#")[1];
      if (!hash) return;

      if (pathname === "/") {
        const target = document.getElementById(hash);
        if (target) {
          event.preventDefault();
          const top = target.getBoundingClientRect().top + window.scrollY - 96;
          smoothScrollTo(top);
          history.replaceState(null, "", `/#${hash}`);
        }
      } else {
        event.preventDefault();
        startTransition(`/#${hash}`);
      }
      return;
    }
    event.preventDefault();
    setIsMenuOpen(false);
    startTransition(href);
  };

  return (
    <MotionConfig reducedMotion="user">
      {/* Scroll progress indicator */}
      <motion.div
        aria-hidden
        style={{ scaleX: progressScaleX }}
        className="fixed left-0 top-0 z-60 h-0.5 w-full origin-left bg-linear-to-r from-[#6c5ce7] to-[#a29bfe]"
      />

      {/* Mobile scrim */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.button
            key="nav-scrim"
            type="button"
            aria-hidden
            tabIndex={-1}
            onClick={() => setIsMenuOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-neutral-950/25 backdrop-blur-sm md:hidden"
          />
        )}
      </AnimatePresence>

      <motion.nav
        aria-label="Primary"
        className={`fixed left-1/2 top-2 z-50 w-[95vw] max-w-5xl -translate-x-1/2 rounded-2xl border backdrop-blur-xl transition-[background-color,box-shadow,border-color] duration-300 sm:top-3 md:top-4 ${
          isScrolled
            ? "border-black/8 bg-white/90 shadow-[0_16px_44px_-12px_rgba(15,23,42,0.18)]"
            : "border-black/5 bg-white/70 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.1)]"
        }`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <div className="mx-auto w-full px-4 sm:px-5 md:px-6">
          <div
            className={`grid grid-cols-[auto_1fr_auto] items-center transition-[height] duration-300 ${
              isScrolled ? "h-14 md:h-16" : "h-16 md:h-18"
            }`}
          >
            {/* Logo */}
            <Link
              href="/"
              aria-label="Home"
              className={`group flex shrink-0 items-center rounded-xl ${FOCUS_RING}`}
              onClick={(event) => handleNavigate(event, "/")}
            >
              <motion.div
                className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg sm:h-10 sm:w-10 md:h-11 md:w-11"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 14 }}
              >
                <Image
                  src={Logo}
                  alt="KC Logo"
                  className="relative z-10 h-8 w-8 select-none object-contain sm:h-9 sm:w-9 md:h-10 md:w-10"
                  priority
                />
              </motion.div>
            </Link>

            {/* Links — desktop, centered in the bar */}
            <div className="hidden items-center justify-center gap-0.5 md:flex">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={(event) => handleNavigate(event, link.href)}
                    aria-current={active ? "page" : undefined}
                    className={`relative rounded-xl px-3.5 py-2 text-[13px] font-semibold uppercase tracking-[0.12em] transition-colors duration-200 ${FOCUS_RING} ${
                      active
                        ? "text-neutral-900"
                        : "text-neutral-500 hover:text-neutral-900"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-active-pill"
                        className="absolute inset-0 rounded-xl bg-[#6c5ce7]/6"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                    {active && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute inset-x-3.5 -bottom-px h-0.5 rounded-full bg-linear-to-r from-[#6c5ce7] to-[#a29bfe]"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 32,
                        }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right actions */}
            <div className="flex items-center justify-end gap-2">
              {/* Contact — desktop */}
              <motion.button
                type="button"
                onClick={() => openContactModal()}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                className={`group hidden shrink-0 items-center justify-center gap-1.5 rounded-xl bg-neutral-900 px-5 py-2.5 text-[13px] font-semibold uppercase tracking-[0.12em] text-white shadow-[0_12px_34px_-14px_rgba(15,23,42,0.6)] transition-colors hover:bg-neutral-800 md:inline-flex ${FOCUS_RING}`}
              >
                Contact
                <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </motion.button>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`relative z-50 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 bg-white/55 text-neutral-700 shadow-sm backdrop-blur transition-colors hover:border-[#6c5ce7]/40 hover:bg-[#6c5ce7]/5 hover:text-neutral-900 md:hidden ${FOCUS_RING}`}
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMenuOpen}
              >
                <motion.div
                  animate={isMenuOpen ? "open" : "closed"}
                  className="flex h-3.5 w-4 flex-col justify-between"
                >
                  <motion.span
                    className="h-0.5 w-full origin-center rounded-full bg-current"
                    variants={{
                      closed: { rotate: 0, y: 0 },
                      open: { rotate: 45, y: 6 },
                    }}
                    transition={{ duration: 0.28, ease: EASE }}
                  />
                  <motion.span
                    className="h-0.5 w-full rounded-full bg-current"
                    variants={{ closed: { opacity: 1 }, open: { opacity: 0 } }}
                    transition={{ duration: 0.2 }}
                  />
                  <motion.span
                    className="h-0.5 w-full origin-center rounded-full bg-current"
                    variants={{
                      closed: { rotate: 0, y: 0 },
                      open: { rotate: -45, y: -6 },
                    }}
                    transition={{ duration: 0.28, ease: EASE }}
                  />
                </motion.div>
              </button>
            </div>
          </div>

          {/* Mobile dropdown — expands from the nav pill */}
          <AnimatePresence initial={false}>
            {isMenuOpen && (
              <motion.div
                key="mobile-panel"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.32, ease: EASE }}
                className="overflow-hidden md:hidden"
              >
                <div className="border-t border-black/5 px-1 pb-4 pt-3">
                  <Eyebrow className="mb-3 px-2">Navigate</Eyebrow>
                  <ul className="flex flex-col gap-1">
                    {navLinks.map((link, index) => {
                      const active = isActive(link.href);
                      return (
                        <motion.li
                          key={link.href}
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.25,
                            delay: 0.06 + index * 0.05,
                            ease: EASE,
                          }}
                        >
                          <Link
                            href={link.href}
                            onClick={(event) => handleNavigate(event, link.href)}
                            aria-current={active ? "page" : undefined}
                            className={`group flex items-center justify-between rounded-xl px-3 py-3 text-[13px] font-semibold uppercase tracking-[0.12em] transition-colors duration-200 ${FOCUS_RING} ${
                              active
                                ? "bg-[#6c5ce7]/6 text-neutral-900"
                                : "text-neutral-500 hover:bg-neutral-900/4 hover:text-neutral-900"
                            }`}
                          >
                            <span className="flex items-center gap-3">
                              <span
                                aria-hidden
                                className={`h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-200 ${
                                  active
                                    ? "bg-[#6c5ce7]"
                                    : "bg-neutral-300 group-hover:bg-neutral-400"
                                }`}
                              />
                              {link.label}
                            </span>
                            <ArrowRightIcon
                              className={`h-4 w-4 shrink-0 transition-all duration-200 ${
                                active
                                  ? "text-[#6c5ce7]"
                                  : "text-neutral-300 group-hover:translate-x-0.5 group-hover:text-neutral-500"
                              }`}
                            />
                          </Link>
                        </motion.li>
                      );
                    })}
                  </ul>

                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.25,
                      delay: 0.06 + navLinks.length * 0.05,
                      ease: EASE,
                    }}
                    className="mt-3 px-1"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        openContactModal();
                      }}
                      className={`group inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-neutral-900 px-5 py-3 text-[13px] font-semibold uppercase tracking-[0.12em] text-white shadow-[0_12px_34px_-14px_rgba(15,23,42,0.6)] transition-colors hover:bg-neutral-800 ${FOCUS_RING}`}
                    >
                      Contact
                      <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </button>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>
    </MotionConfig>
  );
}
