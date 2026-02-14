"use client";

import { animate, motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import Logo from "../../Logo.svg";
import { useContactModal } from "../contact-modal/contact-modal-context";
import { usePageTransition } from "../page-transition/page-transition";

// Socials and navigation links
import { socials } from "../home/socials-link";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/#projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/#contact", label: "Contact me" },
];

// Footer with wave animation on scroll using GSAP and ScrollTrigger
export default function Footer() {
  const pathRef = useRef<SVGPathElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const isSnappingRef = useRef(false);
  const pathname = usePathname();
  const { startTransition } = usePageTransition();
  const { open: openContactModal } = useContactModal();

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
    gsap.registerPlugin(ScrollTrigger);

    const down = "M0-0.3C0-0.3,464,156,1139,156S2278-0.3,2278-0.3V683H0V-0.3z";
    const center = "M0-0.3C0-0.3,464,0,1139,0s1139-0.3,1139-0.3V683H0V-0.3z";

    if (pathRef.current) {
      pathRef.current.setAttribute("d", down);
    }

    const timer = setTimeout(() => {
      let waveTween: gsap.core.Tween | null = null;
      let waveTicker: gsap.TickerCallback | null = null;

      const playAnimation = () => {
        if (!pathRef.current || !svgRef.current) return;

        gsap.set(pathRef.current, { attr: { d: down } });

        if (waveTween) waveTween.kill();
        if (waveTicker) gsap.ticker.remove(waveTicker);

        const wave = { amp: 1 };
        const maxAmp = 48;
        const freq = 6;

        waveTicker = (time) => {
          if (!pathRef.current) return;

          const a = wave.amp * maxAmp;
          const t = time * freq;

          const y1 = Math.sin(t) * a;
          const y2 = Math.sin(t + Math.PI / 2) * a * 0.85;
          const y3 = Math.sin(t + Math.PI) * a;

          pathRef.current.setAttribute(
            "d",
            `M0-0.3C0-0.3,464,${y1},1139,${y2}S2278,${y3},2278-0.3V683H0V-0.3z`,
          );
        };

        gsap.ticker.add(waveTicker);

        waveTween = gsap.to(wave, {
          amp: 0,
          duration: 1.4,
          ease: "expo.out",
          onComplete: () => {
            if (waveTicker) gsap.ticker.remove(waveTicker);
            pathRef.current?.setAttribute("d", center);
          },
        });
      };

      ScrollTrigger.create({
        trigger: footerRef.current,
        start: "top bottom",
        onEnter: playAnimation,
        onEnterBack: playAnimation,
      });

      ScrollTrigger.refresh();
    }, 500);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  useEffect(() => {
    const isHome = pathname === "/";
    const isAbout = pathname === "/about";
    const isCaseStudy = pathname.includes("/casestudy");
    if (!isHome && !isAbout && !isCaseStudy) return;

    const handleWheel = (event: WheelEvent) => {
      if (isSnappingRef.current) return;

      const footerEl = footerRef.current;
      if (!footerEl) return;

      let anchorId: string | null = null;
      if (isHome) {
        anchorId = "projects";
      } else if (isAbout) {
        anchorId = "technologies";
      } else if (isCaseStudy) {
        // For case study, use the LAST section so user can scroll through all content before snapping
        const caseStudySectionIds = [
          "challenges-learnings-case-study",
          "impact-outcome-case-study",
          "technical-case-study",
          "solution-case-study",
          "problem-case-study",
          "case-study-content",
        ];
        anchorId =
          caseStudySectionIds.find((id) => document.getElementById(id)) ?? null;
      }

      if (!anchorId) return;
      const anchorSection = document.getElementById(anchorId);
      if (!anchorSection) return;

      const footerTop = footerEl.getBoundingClientRect().top + window.scrollY;
      const anchorTop =
        anchorSection.getBoundingClientRect().top + window.scrollY;
      const anchorBottom = anchorTop + anchorSection.offsetHeight;

      const currentY = window.scrollY;
      const delta = event.deltaY;
      const threshold = isCaseStudy ? 80 : 40;

      if (isAbout || isCaseStudy) {
        // For about and case study pages: only snap when truly at the bottom of anchor section
        const isNearBottom =
          currentY >= anchorBottom - window.innerHeight - threshold;

        // Scroll down: only snap if at bottom of anchor section
        if (delta > 0 && isNearBottom && currentY < footerTop - threshold) {
          event.preventDefault();
          smoothScrollTo(footerTop);
          return;
        }

        // Scroll up from footer back to anchor section
        if (delta < 0 && currentY >= footerTop - threshold) {
          event.preventDefault();
          smoothScrollTo(anchorTop);
        }
      } else {
        // Home page: only snap to footer when user has scrolled to bottom of projects section
        // (so they can scroll through all featured projects on mobile)
        const isNearBottomOfProjects =
          currentY >= anchorBottom - window.innerHeight - threshold;

        if (
          delta > 0 &&
          isNearBottomOfProjects &&
          currentY < footerTop - threshold
        ) {
          event.preventDefault();
          smoothScrollTo(footerTop);
          return;
        }

        // Scroll up from footer back to projects section
        if (delta < 0 && currentY >= footerTop - threshold) {
          event.preventDefault();
          smoothScrollTo(anchorTop);
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <footer ref={footerRef} className="relative w-full mt-auto min-h-[60px]">
      <svg
        ref={svgRef}
        preserveAspectRatio="none"
        viewBox="0 0 2278 683"
        className="w-full h-[60px] block"
      >
        <path
          ref={pathRef}
          fill="rgb(15,15,15)"
          d="M0-0.3C0-0.3,464,156,1139,156S2278-0.3,2278-0.3V683H0V-0.3z"
        />
      </svg>

      <div className="bg-[#0f0f0f] text-white px-6 py-8">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col gap-4"
            >
              <Link href="/" className="w-fit">
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-12 h-12 flex items-center justify-center"
                >
                  <Image
                    src={Logo}
                    alt="KC Logo"
                    width={48}
                    height={48}
                    className="brightness-0 invert select-none"
                    priority
                  />
                </motion.div>
              </Link>

              <p className="text-white/70 max-w-[280px] leading-relaxed text-sm">
                Crafting digital experiences with passion and precision.
              </p>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
              <nav className="flex flex-col gap-3">
                {navLinks.map((link) => {
                  const [path, hash] = link.href.split("#");
                  const linkPath = path || "/";
                  const hashId = hash || null;
                  const isCurrentPage = pathname === linkPath;

                  return (
                  <motion.div key={link.href} whileHover={{ x: 4 }}>
                    <Link
                      href={link.href}
                      onClick={(e) => {
                        e.preventDefault();
                        if (link.href === "/#contact") {
                          openContactModal();
                          return;
                        }
                        if (isCurrentPage) {
                          if (hashId) {
                            const el = document.getElementById(hashId);
                            el?.scrollIntoView({ behavior: "smooth" });
                          } else {
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }
                        } else {
                          startTransition(link.href);
                        }
                      }}
                      className="flex items-center gap-2 text-white/70 hover:text-white transition"
                    >
                      <span className="opacity-0 group-hover:opacity-100">
                        →
                      </span>
                      {link.label}
                    </Link>
                  </motion.div>
                  );
                })}
              </nav>
            </motion.div>

            {/* Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-lg font-semibold mb-6">Get In Touch</h3>
              <div className="flex flex-col gap-4 text-white/70 text-sm">
                <a
                  href="tel:+639272930207"
                  className="hover:text-white transition flex items-center gap-1.5"
                >
                  <svg
                    className="footer-icon footer-icon-size"
                    fill="none"
                    style={{ width: "20px", height: "20px" }}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  +63 927-293-0207
                </a>
                <a
                  href="mailto:krenntc@gmail.com"
                  className="hover:text-white transition inline-flex items-center gap-2"
                >
                  <svg
                    className="footer-icon"
                    style={{ width: "20px", height: "20px" }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  KrenntC@gmail.com
                </a>

                <div className="inline-flex items-center gap-2 text-white/70">
                  <svg
                    className="footer-icon"
                    style={{ width: "20px", height: "20px" }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>Manila, Philippines</span>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="h-px my-10 bg-linear-to-r from-transparent via-white/20 to-transparent" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <p className="text-white/60 text-sm">
              © 2026 Krennt Craven. All rights reserved.
            </p>

            <div className="flex gap-4">
              {socials
                .filter((social) =>
                  ["Facebook", "LinkedIn"].includes(social.label),
                )
                .map((social) => (
                  <motion.a
                    key={social.href}
                    href={social.href}
                    target="_blank"
                    whileHover={{ y: -4, scale: 1.1 }}
                    className="w-11 h-11 flex items-center justify-center rounded-xl bg-white/10 border border-white/10 text-white/80 hover:text-white hover:bg-white/20 transition"
                  >
                    {social.icon}
                  </motion.a>
                ))}
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
