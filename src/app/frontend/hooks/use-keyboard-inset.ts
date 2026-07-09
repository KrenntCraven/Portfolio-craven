"use client";

import { useEffect, useState } from "react";

/**
 * Returns the number of pixels the on-screen keyboard currently occupies at the
 * bottom of the viewport — but only on small (mobile) screens, and only while
 * `active` is true.
 *
 * Bottom-anchored `position: fixed` sheets don't move when the mobile virtual
 * keyboard opens (CSS viewport units track browser chrome, not the keyboard),
 * so the input can end up hidden behind it. Callers apply this value as a
 * bottom offset (and shrink max-height) so the input stays visible while typing.
 *
 * Returns 0 on desktop, when there's no keyboard, or when the VisualViewport
 * API is unavailable — so desktop layout is never affected.
 */
export function useKeyboardInset(active: boolean): number {
  const [inset, setInset] = useState(0);

  useEffect(() => {
    if (!active || typeof window === "undefined") return;

    const vv = window.visualViewport;
    if (!vv) return;
    const mq = window.matchMedia("(max-width: 639px)");

    const update = () => {
      if (!mq.matches) {
        setInset(0);
        return;
      }
      // Space between the visual viewport's bottom edge and the layout
      // viewport's bottom edge — i.e. the keyboard (plus any offset).
      const kb = window.innerHeight - vv.height - vv.offsetTop;
      setInset(kb > 40 ? Math.round(kb) : 0);
    };

    update();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    mq.addEventListener("change", update);

    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
      mq.removeEventListener("change", update);
      setInset(0);
    };
  }, [active]);

  return inset;
}
