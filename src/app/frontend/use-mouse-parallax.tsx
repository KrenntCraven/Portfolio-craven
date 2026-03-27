import {
  type MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/* Mouse-tracking hook – normalised 0-1 values, spring-smoothed       */
/* ------------------------------------------------------------------ */
export function useMouseParallax() {
  const [skip, setSkip] = useState(true);
  const skipRef = useRef(true);
  const rawX = useMotionValue(0.5);
  const rawY = useMotionValue(0.5);
  const sp = { damping: 30, stiffness: 90 };
  const x = useSpring(rawX, sp);
  const y = useSpring(rawY, sp);

  useEffect(() => {
    const mm =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function"
        ? window.matchMedia
        : null;
    const isTouch = mm
      ? mm("(pointer: coarse)").matches || navigator.maxTouchPoints > 0
      : true;
    const reduced = mm
      ? mm("(prefers-reduced-motion: reduce)").matches
      : false;
    if (isTouch || reduced) return;
    // Defer state update to avoid synchronous setState in effect body
    skipRef.current = false;
    queueMicrotask(() => setSkip(false));

    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX / window.innerWidth);
      rawY.set(e.clientY / window.innerHeight);
    };
    const onLeave = () => {
      rawX.set(0.5);
      rawY.set(0.5);
    };
    window.addEventListener("mousemove", onMove);
    document.body.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.body.removeEventListener("mouseleave", onLeave);
    };
  }, [rawX, rawY]);

  return { x, y, skip };
}

/* ------------------------------------------------------------------ */
/* Floating geometric shapes that drift with the cursor               */
/* ------------------------------------------------------------------ */
export type ShapeDef = {
  className: string;
  mx: number;
  my: number;
};

const DEFAULT_SHAPES: readonly ShapeDef[] = [
  { className: "left-[8%] top-[22%] h-2 w-2 rounded-full bg-[#6c5ce7]/25", mx: -18, my: -14 },
  { className: "right-[12%] top-[14%] h-5 w-5 rounded-full border-2 border-[#6c5ce7]/20", mx: 14, my: -10 },
  { className: "left-[4%] top-[55%] h-1.5 w-1.5 rounded-full bg-[#6c5ce7]/30", mx: -12, my: 10 },
  { className: "right-[6%] bottom-[28%] h-6 w-6 rounded-full border-2 border-neutral-800/10", mx: 20, my: 16 },
  { className: "left-[18%] bottom-[18%] h-3 w-3 rotate-45 bg-[#6c5ce7]/15 rounded-sm", mx: -10, my: 12 },
  { className: "right-[16%] top-[45%] h-px w-8 bg-[#6c5ce7]/20", mx: 16, my: -6 },
  { className: "left-[45%] top-[10%] h-3 w-px bg-[#6c5ce7]/20", mx: -6, my: -18 },
  { className: "left-[28%] bottom-[12%] h-2 w-2 rounded-full bg-neutral-800/8", mx: -8, my: 14 },
];

function FloatingShape({
  shape,
  x,
  y,
}: {
  shape: ShapeDef;
  x: MotionValue<number>;
  y: MotionValue<number>;
}) {
  const sx = useTransform(x, [0, 1], [-shape.mx, shape.mx]);
  const sy = useTransform(y, [0, 1], [-shape.my, shape.my]);
  return (
    <motion.div
      className={`pointer-events-none absolute ${shape.className}`}
      style={{ x: sx, y: sy, willChange: "transform" }}
      aria-hidden
    />
  );
}

export function FloatingShapes({
  x,
  y,
  shapes = DEFAULT_SHAPES,
}: {
  x: MotionValue<number>;
  y: MotionValue<number>;
  shapes?: readonly ShapeDef[];
}) {
  return (
    <>
      {shapes.map((shape, i) => (
        <FloatingShape key={i} shape={shape} x={x} y={y} />
      ))}
    </>
  );
}
