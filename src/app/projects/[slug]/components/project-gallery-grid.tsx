"use client";

/**
 * ProjectGalleryGrid — the interactive layer of the gallery: a clickable
 * thumbnail grid that opens an accessible lightbox modal for each screenshot.
 *
 * Rendered as a Client Component inside the (Server) ProjectGallery so the
 * static scaffolding stays on the server. The modal is portaled to
 * document.body so the section's motion transforms don't trap the fixed
 * overlay. Keyboard: Esc closes, ←/→ navigate. Body scroll locks while open
 * and focus returns to the originating thumbnail on close.
 */
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { GalleryImage } from "../../../backend/types";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  EASE,
  FOCUS_RING,
} from "../../../frontend/project-ui";

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 6l12 12M18 6L6 18"
      />
    </svg>
  );
}

function ExpandIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
      />
    </svg>
  );
}

export function ProjectGalleryGrid({ images }: { images: GalleryImage[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const triggersRef = useRef<Array<HTMLButtonElement | null>>([]);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);

  const open = index !== null;
  const multiple = images.length > 1;

  const close = useCallback(() => {
    setIndex((i) => {
      if (i !== null) triggersRef.current[i]?.focus();
      return null;
    });
  }, []);

  const prev = useCallback(() => {
    setIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length));
  }, [images.length]);

  const next = useCallback(() => {
    setIndex((i) => (i === null ? i : (i + 1) % images.length));
  }, [images.length]);

  // Keyboard controls + body scroll lock while the lightbox is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft" && multiple) prev();
      else if (e.key === "ArrowRight" && multiple) next();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, multiple, close, prev, next]);

  // Move focus into the dialog when it opens.
  useEffect(() => {
    if (open) closeRef.current?.focus();
  }, [open]);

  const current = index !== null ? images[index] : null;

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {images.map((image, i) => (
          <figure
            key={i}
            className="group overflow-hidden rounded-2xl border border-neutral-200/70 bg-neutral-50 shadow-[0_10px_40px_-28px_rgba(15,23,42,0.35)]"
          >
            <button
              type="button"
              ref={(el) => {
                triggersRef.current[i] = el;
              }}
              onClick={() => setIndex(i)}
              aria-label={`View screenshot: ${image.alt ?? image.caption ?? `image ${i + 1}`}`}
              className={`relative block aspect-video w-full cursor-zoom-in overflow-hidden ${FOCUS_RING}`}
            >
              <Image
                src={image.url}
                alt={image.alt ?? image.caption ?? "Project screenshot"}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                loading="lazy"
                quality={85}
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
              <span
                aria-hidden
                className="absolute inset-0 flex items-center justify-center bg-neutral-950/0 opacity-0 transition-all duration-300 group-hover:bg-neutral-950/25 group-hover:opacity-100"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-neutral-800 shadow-lg backdrop-blur">
                  <ExpandIcon className="h-5 w-5" />
                </span>
              </span>
            </button>
            {image.caption && (
              <figcaption className="px-4 py-3 text-sm leading-relaxed text-neutral-500">
                {image.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && current && (
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-label={current.alt ?? current.caption ?? "Screenshot"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: EASE }}
                onClick={close}
                className="fixed inset-0 z-100 flex flex-col bg-neutral-950/90 backdrop-blur-xl"
              >
                {/* Accent wash so the overlay reads as designed, not just dark */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(108,92,231,0.18),transparent_60%)]"
                />

                {/* Top bar — counter + close */}
                <div className="relative z-10 flex shrink-0 items-center justify-between gap-4 px-4 py-4 sm:px-6">
                  {multiple ? (
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tabular-nums text-white/80 ring-1 ring-inset ring-white/15 backdrop-blur">
                      {(index ?? 0) + 1} / {images.length}
                    </span>
                  ) : (
                    <span />
                  )}
                  <button
                    ref={closeRef}
                    type="button"
                    onClick={close}
                    aria-label="Close"
                    className={`flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-inset ring-white/15 backdrop-blur transition hover:bg-white/20 hover:ring-white/25 active:scale-95 ${FOCUS_RING} focus-visible:ring-offset-neutral-950`}
                  >
                    <CloseIcon className="h-5 w-5" />
                  </button>
                </div>

                {/* Stage */}
                <div className="relative z-10 flex min-h-0 flex-1 items-center gap-2 px-3 pb-2 sm:gap-4 sm:px-6">
                  {multiple && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        prev();
                      }}
                      aria-label="Previous screenshot"
                      className={`hidden h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-inset ring-white/15 backdrop-blur transition hover:bg-white/20 active:scale-95 sm:flex ${FOCUS_RING} focus-visible:ring-offset-neutral-950`}
                    >
                      <ArrowLeftIcon className="h-5 w-5" />
                    </button>
                  )}

                  <motion.figure
                    key={index}
                    initial={{ opacity: 0, scale: 0.97, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.28, ease: EASE }}
                    onClick={(e) => e.stopPropagation()}
                    className="mx-auto flex h-full min-h-0 w-full max-w-6xl flex-col"
                  >
                    <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl bg-neutral-900/60 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)] ring-1 ring-inset ring-white/10">
                      <Image
                        src={current.url}
                        alt={
                          current.alt ?? current.caption ?? "Project screenshot"
                        }
                        fill
                        sizes="(max-width: 1152px) 100vw, 1152px"
                        quality={92}
                        className="object-contain"
                      />
                    </div>
                    {current.caption && (
                      <figcaption className="mx-auto mt-4 max-w-3xl shrink-0 text-center text-sm leading-relaxed text-neutral-300 sm:text-base">
                        {current.caption}
                      </figcaption>
                    )}
                  </motion.figure>

                  {multiple && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        next();
                      }}
                      aria-label="Next screenshot"
                      className={`hidden h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-inset ring-white/15 backdrop-blur transition hover:bg-white/20 active:scale-95 sm:flex ${FOCUS_RING} focus-visible:ring-offset-neutral-950`}
                    >
                      <ArrowRightIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>

                {/* Thumbnail rail */}
                {multiple && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="relative z-10 shrink-0 px-4 pb-4 pt-2 sm:px-6 sm:pb-6"
                  >
                    <ul className="mx-auto flex max-w-4xl items-center justify-start gap-2 overflow-x-auto pb-1 sm:justify-center">
                      {images.map((img, i) => (
                        <li key={i} className="shrink-0">
                          <button
                            type="button"
                            onClick={() => setIndex(i)}
                            aria-label={`Go to screenshot ${i + 1}`}
                            aria-current={i === index}
                            className={`relative block h-12 w-20 overflow-hidden rounded-lg ring-1 transition sm:h-14 sm:w-24 ${
                              i === index
                                ? "opacity-100 ring-2 ring-[#a29bfe]"
                                : "opacity-50 ring-white/10 hover:opacity-90"
                            } ${FOCUS_RING} focus-visible:ring-offset-neutral-950`}
                          >
                            <Image
                              src={img.url}
                              alt=""
                              fill
                              sizes="96px"
                              quality={45}
                              className="object-cover"
                            />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
