"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { FormEvent, useEffect, useRef, useState } from "react";
import { ArrowRightIcon, EASE, FOCUS_RING } from "../project-ui";
import { getSocials } from "../home/socials-link";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* Staggered entrance for the form fields */
const fieldStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
};
const fieldItem = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

/* The real email + a couple of icon links for the footer */
const EMAIL = "krenntc@gmail.com";
const ICON_LINKS = getSocials().filter((s) =>
  ["GitHub", "LinkedIn"].includes(s.label),
);

function inputClasses(hasError: boolean) {
  return `w-full rounded-xl border bg-white/70 px-4 py-3 text-sm text-neutral-900 shadow-sm backdrop-blur transition-all duration-200 placeholder:text-neutral-400 focus:outline-none focus:bg-white focus:ring-2 sm:text-base ${
    hasError
      ? "border-red-300 bg-red-50/60 focus:border-red-400 focus:ring-red-200"
      : "border-black/10 hover:border-[#6c5ce7]/40 focus:border-[#6c5ce7] focus:ring-[#6c5ce7]/20"
  }`;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const closeTimerRef = useRef<number | null>(null);

  // Reset everything whenever the modal closes so reopening is always fresh
  // (and any pending auto-close timer is cancelled).
  useEffect(() => {
    if (isOpen) return;
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setIsSubmitted(false);
    setFormData({ name: "", email: "", message: "" });
    setErrors({ name: "", email: "", message: "" });
    setSubmitError("");
  }, [isOpen]);

  // Move focus into the dialog when it opens
  useEffect(() => {
    if (!isOpen) return;
    const id = window.setTimeout(() => nameInputRef.current?.focus(), 120);
    return () => window.clearTimeout(id);
  }, [isOpen]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside as any);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside as any);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const validateForm = () => {
    const newErrors = {
      name: "",
      email: "",
      message: "",
    };

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);
    return !newErrors.name && !newErrors.email && !newErrors.message;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong.");
      }

      setIsSubmitted(true);
      // Give the reader time to enjoy the message; they can also dismiss
      // early via outside click, Escape, or the close button.
      closeTimerRef.current = window.setTimeout(() => {
        onClose();
      }, 6000);
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Failed to send. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-100 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <div
            className="fixed inset-0 z-101 flex items-center justify-center overflow-y-auto p-3 sm:p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Contact Krennt Craven"
          >
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.97, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 12 }}
              transition={{ type: "spring", damping: 26, stiffness: 320 }}
              className="relative my-auto w-full max-w-lg overflow-hidden rounded-2xl border border-black/10 bg-white p-6 shadow-2xl shadow-black/20 sm:p-8"
            >
              {/* Thin accent line — the only decorative flourish */}
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-[#6c5ce7] to-[#a29bfe]"
              />

              {/* Close */}
              <button
                onClick={onClose}
                aria-label="Close contact form"
                className={`absolute right-3 top-3 rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 ${FOCUS_RING}`}
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <AnimatePresence mode="wait">
                {isSubmitted ? (
                  /* ---------- Success ---------- */
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: EASE }}
                    className="flex flex-col items-center py-8 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        delay: 0.05,
                        stiffness: 220,
                        damping: 16,
                      }}
                      className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-[#6c5ce7] to-[#a29bfe] text-white shadow-lg shadow-[#6c5ce7]/25"
                    >
                      <svg
                        className="h-7 w-7"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </motion.div>
                    <h3 className="text-lg font-bold tracking-tight text-neutral-900">
                      Delivered successfully.
                    </h3>
                    <p className="mt-1 text-sm italic text-[#6c5ce7]">
                      (Unlike some of my API integrations.)
                    </p>
                    <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-neutral-600">
                      Your note came straight to me. I&apos;ll read it and write
                      back.
                    </p>
                    <p className="mt-3 text-sm font-medium text-neutral-400">
                      — Krennt
                    </p>
                  </motion.div>
                ) : (
                  /* ---------- Form ---------- */
                  <motion.div
                    key="form"
                    variants={fieldStagger}
                    initial="hidden"
                    animate="show"
                  >
                    {/* Header — who you're actually reaching */}
                    <motion.div variants={fieldItem} className="mb-6 pr-8">
                      <div className="flex items-center gap-3">
                        <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-black/10">
                          <Image
                            src="/Picture.jpg"
                            alt="Krennt Craven"
                            fill
                            sizes="44px"
                            className="object-cover"
                          />
                        </span>
                        <span className="leading-tight">
                          <span className="block text-sm font-semibold text-neutral-900">
                            Krennt Craven
                          </span>
                          <span className="block text-xs text-neutral-500">
                            Full-stack &amp; cloud engineer
                          </span>
                        </span>
                      </div>
                      <h2 className="mt-5 text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
                        Let&apos;s talk.
                      </h2>
                      <p className="mt-2 text-sm leading-relaxed text-neutral-600 sm:text-base">
                        A product to build, a system to scale, or an infra
                        headache to untangle — send it over. It comes straight to
                        me, and I reply to everyone.
                      </p>
                    </motion.div>

                    <form onSubmit={handleSubmit} noValidate className="space-y-4">
                      {/* Name */}
                      <motion.div variants={fieldItem}>
                        <label
                          htmlFor="name"
                          className="mb-1.5 block text-sm font-medium text-neutral-700"
                        >
                          Name
                        </label>
                        <input
                          ref={nameInputRef}
                          type="text"
                          id="name"
                          name="name"
                          autoComplete="name"
                          value={formData.name}
                          onChange={handleChange}
                          aria-invalid={!!errors.name}
                          className={inputClasses(!!errors.name)}
                          placeholder="Your name"
                        />
                        <AnimatePresence>
                          {errors.name && (
                            <motion.p
                              initial={{ opacity: 0, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -4 }}
                              className="mt-1.5 text-xs text-red-600"
                            >
                              {errors.name}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </motion.div>

                      {/* Email */}
                      <motion.div variants={fieldItem}>
                        <label
                          htmlFor="email"
                          className="mb-1.5 block text-sm font-medium text-neutral-700"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          autoComplete="email"
                          inputMode="email"
                          value={formData.email}
                          onChange={handleChange}
                          aria-invalid={!!errors.email}
                          className={inputClasses(!!errors.email)}
                          placeholder="you@example.com"
                        />
                        <AnimatePresence>
                          {errors.email && (
                            <motion.p
                              initial={{ opacity: 0, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -4 }}
                              className="mt-1.5 text-xs text-red-600"
                            >
                              {errors.email}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </motion.div>

                      {/* Message */}
                      <motion.div variants={fieldItem}>
                        <label
                          htmlFor="message"
                          className="mb-1.5 block text-sm font-medium text-neutral-700"
                        >
                          Message
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          rows={4}
                          aria-invalid={!!errors.message}
                          className={`${inputClasses(!!errors.message)} resize-none`}
                          placeholder="What are you building, and where do I fit in?"
                        />
                        <AnimatePresence>
                          {errors.message && (
                            <motion.p
                              initial={{ opacity: 0, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -4 }}
                              className="mt-1.5 text-xs text-red-600"
                            >
                              {errors.message}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </motion.div>

                      {/* Submit error */}
                      <AnimatePresence>
                        {submitError && (
                          <motion.p
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600"
                          >
                            {submitError}
                          </motion.p>
                        )}
                      </AnimatePresence>

                      {/* Submit */}
                      <motion.div variants={fieldItem} className="pt-1">
                        <motion.button
                          type="submit"
                          disabled={isSubmitting}
                          whileHover={isSubmitting ? undefined : { y: -2 }}
                          whileTap={isSubmitting ? undefined : { scale: 0.99 }}
                          className={`group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_40px_-16px_rgba(0,0,0,0.55)] transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60 ${FOCUS_RING}`}
                        >
                          {isSubmitting ? (
                            <>
                              <svg
                                className="h-4 w-4 animate-spin"
                                viewBox="0 0 24 24"
                                fill="none"
                                aria-hidden
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                />
                                <path
                                  className="opacity-90"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                />
                              </svg>
                              Sending…
                            </>
                          ) : (
                            <>
                              Send message
                              <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                            </>
                          )}
                        </motion.button>
                      </motion.div>
                    </form>

                    {/* Direct line — a real address, not an anonymous form */}
                    <motion.div
                      variants={fieldItem}
                      className="mt-6 flex flex-col gap-3 border-t border-neutral-100 pt-5 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <a
                        href={`mailto:${EMAIL}`}
                        className={`inline-flex items-center gap-2 rounded text-sm font-medium text-neutral-600 transition-colors hover:text-[#6c5ce7] ${FOCUS_RING}`}
                      >
                        <svg
                          className="h-4 w-4 text-neutral-400"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden
                        >
                          <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h2V9.5l6 4 6-4V20h2a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm-2 3.5-6 4-6-4V6l6 4 6-4Z" />
                        </svg>
                        {EMAIL}
                      </a>
                      <div className="flex items-center gap-2">
                        {ICON_LINKS.map((link) => (
                          <motion.a
                            key={link.label}
                            href={link.href}
                            aria-label={link.label}
                            title={link.label}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex h-10 w-10 items-center justify-center rounded-lg border border-black/10 bg-white text-neutral-600 transition-colors hover:border-[#6c5ce7]/40 hover:bg-[#6c5ce7]/5 hover:text-[#6c5ce7] ${FOCUS_RING}`}
                          >
                            {link.icon}
                          </motion.a>
                        ))}
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
