"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { memo, useEffect, useState } from "react";

function useIsTouch() {
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    setIsTouch(
      window.matchMedia("(pointer: coarse)").matches ||
        navigator.maxTouchPoints > 0,
    );
  }, []);
  return isTouch;
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);
  return reduced;
}

/**
 * Shared animated banner background.
 * On touch/mobile devices or when reduced-motion is preferred,
 * renders static orbs with no mouse tracking or animation cost.
 */
export const BannerBackground = memo(function BannerBackground() {
  const isTouch = useIsTouch();
  const reducedMotion = useReducedMotion();
  const skip = isTouch || reducedMotion;

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const spring = { damping: 28, stiffness: 120 };
  const x = useSpring(mouseX, spring);
  const y = useSpring(mouseY, spring);

  useEffect(() => {
    if (skip) return;
    const handleMove = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };
    const handleLeave = () => {
      mouseX.set(0.5);
      mouseY.set(0.5);
    };
    window.addEventListener("mousemove", handleMove);
    document.body.addEventListener("mouseleave", handleLeave);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      document.body.removeEventListener("mouseleave", handleLeave);
    };
  }, [skip, mouseX, mouseY]);

  const move = skip ? 0 : 48;
  const orb1X = useTransform(x, [0, 1], [-move * 0.8, move * 0.8]);
  const orb1Y = useTransform(y, [0, 1], [-move * 0.6, move * 0.6]);
  const orb2X = useTransform(x, [0, 1], [move * 0.5, -move * 0.5]);
  const orb2Y = useTransform(y, [0, 1], [move * 0.4, -move * 0.4]);
  const orb3X = useTransform(x, [0, 1], [-move * 0.4, move * 0.4]);
  const orb3Y = useTransform(y, [0, 1], [move * 0.5, -move * 0.5]);
  const orb4X = useTransform(x, [0, 1], [move * 0.6, -move * 0.6]);
  const orb4Y = useTransform(y, [0, 1], [-move * 0.3, move * 0.3]);
  const orb5X = useTransform(x, [0, 1], [-move * 0.3, move * 0.3]);
  const orb5Y = useTransform(y, [0, 1], [-move * 0.5, move * 0.5]);

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <div className="landing-banner-base absolute inset-0" />
      <div className="absolute inset-x-0 top-0 h-64 bg-linear-to-b from-black/10 via-transparent to-transparent dark:from-white/5" />

      {/* On mobile/touch: no blurred orbs — the CSS gradient is sufficient and
          blur compositing at 120Hz on ProMotion devices tanks GPU fill rate */}
      {skip ? null : (
        <>
          {/* Desktop: 5 mouse-tracked orbs, each on its own compositor layer */}
          <motion.div
            className="absolute left-[10%] top-[18%] h-[320px] w-[320px] rounded-full opacity-90 dark:opacity-85"
            style={{ x: orb1X, y: orb1Y, willChange: "transform" }}
          >
            <div className="landing-banner-orb-purple-1 h-full w-full rounded-full blur-3xl" />
          </motion.div>
          <motion.div
            className="absolute right-[5%] top-[25%] h-[280px] w-[280px] rounded-full opacity-85"
            style={{ x: orb2X, y: orb2Y, willChange: "transform" }}
          >
            <div className="landing-banner-orb-neutral h-full w-full rounded-full blur-3xl" />
          </motion.div>
          <motion.div
            className="absolute bottom-[20%] left-[15%] h-[240px] w-[240px] rounded-full opacity-90"
            style={{ x: orb3X, y: orb3Y, willChange: "transform" }}
          >
            <div className="landing-banner-orb-purple-2 h-full w-full rounded-full blur-3xl" />
          </motion.div>
          <motion.div
            className="absolute bottom-[15%] right-[12%] h-[360px] w-[360px] rounded-full opacity-80"
            style={{ x: orb4X, y: orb4Y, willChange: "transform" }}
          >
            <div className="landing-banner-orb-neutral-2 h-full w-full rounded-full blur-3xl" />
          </motion.div>
          <motion.div
            className="absolute left-1/2 top-1/2 h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-80"
            style={{ x: orb5X, y: orb5Y, willChange: "transform" }}
          >
            <div className="landing-banner-orb-purple-3 h-full w-full rounded-full blur-2xl" />
          </motion.div>
        </>
      )}

      <div className="absolute inset-x-12 sm:inset-x-24 -bottom-48 h-72 rounded-[36px] bg-black/5 blur-3xl dark:bg-white/5" />
    </div>
  );
});
