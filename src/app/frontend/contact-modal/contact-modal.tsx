"use client";

import { AnimatePresence, motion } from "framer-motion";
import { FormEvent, useEffect, useRef, useState } from "react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
      setTimeout(() => {
        setFormData({ name: "", email: "", message: "" });
        setIsSubmitted(false);
        onClose();
      }, 2000);
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
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 300,
                duration: 0.4,
              }}
              className="relative w-full max-w-2xl max-h-[90vh] sm:max-h-[85vh] my-auto rounded-xl sm:rounded-2xl border border-black/10 bg-white/95 shadow-2xl shadow-black/20 backdrop-blur-xl flex flex-col overflow-hidden"
            >
              {/* Background decorations */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl sm:rounded-2xl">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,0,0,0.03),transparent_30%)]" />
                <div className="absolute inset-x-0 top-0 h-20 sm:h-32 bg-linear-to-b from-black/5 via-transparent to-transparent" />
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-2 right-2 sm:top-3 sm:right-3 z-30 p-2 sm:p-2.5 rounded-lg bg-white/90 backdrop-blur-sm border border-black/10 hover:bg-white hover:border-black/20 transition-all duration-200 shadow-sm hover:shadow-md"
                aria-label="Close modal"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Scrollable Content */}
              <div className="relative z-10 p-4 sm:p-6 lg:p-8 overflow-y-auto flex-1 min-h-0">
                {/* Header */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mb-4 sm:mb-6 pr-10 sm:pr-12"
                >
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
                    Contact me
                  </h2>
                  <p className="mt-1.5 sm:mt-2 text-sm sm:text-base text-neutral-600 leading-relaxed">
                    Drop a message and let's connect. collaboration, Drop a
                    message and let's connect.
                  </p>
                </motion.div>

                {/* Success Message */}
                <AnimatePresence>
                  {isSubmitted && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 sm:mt-6 rounded-lg sm:rounded-xl bg-green-50 border border-green-200 p-3 sm:p-4 text-center"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          delay: 0.1,
                          stiffness: 200,
                        }}
                        className="mx-auto mb-2 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-green-500"
                      >
                        <svg
                          className="h-5 w-5 sm:h-6 sm:w-6 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </motion.div>
                      <p className="text-xs sm:text-sm font-semibold text-green-800">
                        Message sent successfully!
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Form */}
                {!isSubmitted && (
                  <motion.form
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mt-4 sm:mt-6 space-y-4 sm:space-y-5"
                  >
                    {/* Name Field */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.25 }}
                    >
                      <label
                        htmlFor="name"
                        className="block text-xs sm:text-sm font-semibold text-neutral-800 mb-1.5 sm:mb-2"
                      >
                        Name:
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full rounded-lg sm:rounded-xl border ${
                          errors.name
                            ? "border-red-300 bg-red-50"
                            : "border-black/15 bg-white/80"
                        } px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-neutral-900 shadow-sm backdrop-blur transition-all duration-200 focus:border-black/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/10`}
                        placeholder="Your Name:"
                      />

                      {errors.name && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-1 text-xs sm:text-sm text-red-600"
                        >
                          {errors.name}
                        </motion.p>
                      )}
                    </motion.div>

                    {/* Email Field */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <label
                        htmlFor="email"
                        className="block text-xs sm:text-sm font-semibold text-neutral-800 mb-1.5 sm:mb-2"
                      >
                        Email:
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full rounded-lg sm:rounded-xl border ${
                          errors.email
                            ? "border-red-300 bg-red-50"
                            : "border-black/15 bg-white/80"
                        } px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-neutral-900 shadow-sm backdrop-blur transition-all duration-200 focus:border-black/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/10`}
                        placeholder="your.email@example.com"
                      />
                      {errors.email && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-1 text-xs sm:text-sm text-red-600"
                        >
                          {errors.email}
                        </motion.p>
                      )}
                    </motion.div>

                    {/* Message Field */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.35 }}
                    >
                      <label
                        htmlFor="message"
                        className="block text-xs sm:text-sm font-semibold text-neutral-800 mb-1.5 sm:mb-2"
                      >
                        Message:
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={4}
                        className={`w-full rounded-lg sm:rounded-xl border ${
                          errors.message
                            ? "border-red-300 bg-red-50"
                            : "border-black/15 bg-white/80"
                        } px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-neutral-900 shadow-sm backdrop-blur transition-all duration-200 focus:border-black/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/10 resize-none`}
                        placeholder="Tell me a bit about what you'd like to discuss.."
                      />
                      {errors.message && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-1 text-xs sm:text-sm text-red-600"
                        >
                          {errors.message}
                        </motion.p>
                      )}
                    </motion.div>

                    {/* Submit error */}
                    {submitError && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs sm:text-sm text-red-600 text-center"
                      >
                        {submitError}
                      </motion.p>
                    )}

                    {/* Buttons */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end sm:gap-4 pt-3 sm:pt-4"
                    >
                      <motion.button
                        type="button"
                        onClick={onClose}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full sm:w-auto rounded-lg sm:rounded-xl border border-black/15 bg-white/80 px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-neutral-800 shadow-sm backdrop-blur transition-all duration-200 hover:bg-white hover:border-black/25 hover:shadow-md"
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                        whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                        className="group relative w-full sm:w-auto overflow-hidden rounded-lg sm:rounded-xl border border-black/10 bg-neutral-800 px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-black/20 transition-all duration-300 hover:bg-white hover:border-black/30 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <motion.span
                          className="pointer-events-none absolute inset-0 bg-linear-to-r from-transparent via-white/15 to-transparent opacity-0"
                          initial={{ scale: 1 }}
                          whileHover={{ opacity: 1, scale: 1.1 }}
                          transition={{ duration: 0.4 }}
                        />
                        <span className="relative z-10 transition-colors duration-300 group-hover:text-neutral-800">
                          {isSubmitting ? "Sending..." : "Submit"}
                        </span>
                      </motion.button>
                    </motion.div>
                  </motion.form>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
