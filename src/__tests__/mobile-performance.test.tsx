/**
 * Mobile & Performance Optimisation – Unit Tests
 *
 * Covers mobile-specific guards and performance shortcuts:
 *
 *  1. BannerBackground – touch / reduced-motion detection skips mouse tracking
 *  2. PageTransitionProvider – deadline safety-net prevents stuck overlay
 *  3. About page – mobile paragraph variant on narrow viewport
 *  4. About page – mobile uses native scrolling (no touch snapping)
 *  5. About page – resize debounce adds / removes listener
 *  6. LandingPageClient – wheel listener registered with { passive: false }
 *  7. LandingPageClient – wheel listener cleaned up on unmount
 *  8. LandingPageClient – wheel snap chain never skips a section
 */

import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";

// ---------------------------------------------------------------------------
// Global matchMedia mock — jsdom doesn't provide window.matchMedia
// ---------------------------------------------------------------------------

let _coarsePointer = false;
let _reducedMotion = false;

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: query.includes("pointer: coarse")
      ? _coarsePointer
      : query.includes("reduced-motion")
        ? _reducedMotion
        : false,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }),
});

// ---------------------------------------------------------------------------
// Static module mocks — hoisted by Jest, no dynamic import needed
// ---------------------------------------------------------------------------

// framer-motion: strip animation props, forward onAnimationComplete via global
jest.mock("framer-motion", () => {
  const MOTION_PROPS = new Set([
    "initial", "animate", "exit", "variants", "transition",
    "whileHover", "whileTap", "whileFocus", "whileDrag", "whileInView",
    "layout", "layoutId", "onAnimationStart", "onAnimationComplete",
    "drag", "dragConstraints",
  ]);
  /* eslint-disable @typescript-eslint/no-require-imports */
  const ReactInternal = require("react");
  return {
    __esModule: true,
    MotionConfig: ({ children }: { children?: React.ReactNode }) => children,
    AnimatePresence: ({ children }: { children?: React.ReactNode }) => children,
    motion: new Proxy(
      {},
      {
        get: (_: object, tag: string) =>
          ({
            children,
            onAnimationComplete,
            ...rest
          }: Record<string, unknown> & {
            children?: React.ReactNode;
            onAnimationComplete?: () => void;
          }) => {
            const clean = Object.fromEntries(
              Object.entries(rest).filter(([k]) => !MOTION_PROPS.has(k))
            );
            if (onAnimationComplete) {
              clean["data-on-animation-complete"] = "true";
              (global as Record<string, unknown>).__lastOnAnimationComplete =
                onAnimationComplete;
            }
            return ReactInternal.createElement(tag, clean, children);
          },
      }
    ),
    animate: jest.fn().mockReturnValue({ stop: jest.fn() }),
    useMotionValue: jest.fn(() => ({ set: jest.fn(), get: jest.fn(() => 0.5) })),
    useSpring: jest.fn((v: unknown) => v),
    useTransform: jest.fn(() => ({ get: jest.fn() })),
    useMotionValueEvent: jest.fn(),
    useScroll: jest.fn(() => ({ scrollY: { get: jest.fn() } })),
  };
});

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    fill: _f,
    priority: _p,
    sizes: _s,
    quality: _q,
    loading: _l,
    ...rest
  }: {
    src: string;
    alt: string;
    [key: string]: unknown;
  }) => {
    /* eslint-disable @typescript-eslint/no-require-imports */
    const R = require("react");
    return R.createElement("img", { src, alt, ...rest });
  },
}));

// next/navigation: mockPush is module-level so it can be cleared per test
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => "/",
}));

// Stub heavy sub-components so About / LandingPageClient tests are isolated
jest.mock("@/app/about/experience-page", () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock("@/app/about/certification-page", () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock("@/app/about/techonologies-page", () => ({
  Technologies: () => null,
}));
jest.mock("@heroui/button", () => ({
  Button: ({
    children,
    as: Tag = "button",
    href,
    startContent: _sc,
    endContent: _ec,
    fullWidth: _fw,
    variant: _v,
    radius: _r,
    ...rest
  }: Record<string, unknown> & { children?: React.ReactNode }) => {
    /* eslint-disable @typescript-eslint/no-require-imports */
    const R = require("react");
    return R.createElement((Tag as string) ?? "button", { href, ...rest }, children as React.ReactNode);
  },
}));

// ---------------------------------------------------------------------------
// Static imports (must come after jest.mock declarations)
// ---------------------------------------------------------------------------

import { animate } from "framer-motion";
import { BannerBackground } from "@/app/frontend/banner-background";
import {
  PageTransitionProvider,
  usePageTransition,
} from "@/app/frontend/page-transition/page-transition";
import About from "@/app/about/about-page";
import LandingPageClient from "@/app/frontend/home/landing-page-client";
import { ContactModalProvider } from "@/app/frontend/contact-modal/contact-modal-context";

const LandingHero = () => (
  <ContactModalProvider>
    <LandingPageClient />
  </ContactModalProvider>
);

// ===========================================================================
// 1 — BannerBackground – touch / reduced-motion detection
// ===========================================================================
// The component uses useState(false) + useEffect to lazily detect touch/motion.
// On initial render skip=false so mousemove IS added, then after the effect
// fires and isTouch→true, skip becomes true and cleanup removes the listener.
// We verify the NET result by comparing add vs remove call counts.

describe("BannerBackground – touch / reduced-motion detection", () => {
  let addSpy: jest.SpyInstance;
  let removeSpy: jest.SpyInstance;

  beforeEach(() => {
    _coarsePointer = false;
    _reducedMotion = false;
    Object.defineProperty(navigator, "maxTouchPoints", { configurable: true, value: 0 });
    addSpy = jest.spyOn(window, "addEventListener");
    removeSpy = jest.spyOn(window, "removeEventListener");
  });

  afterEach(() => {
    addSpy.mockRestore();
    removeSpy.mockRestore();
  });

  it("does NOT attach mousemove listener (net) on a touch screen device", async () => {
    Object.defineProperty(navigator, "maxTouchPoints", { configurable: true, value: 5 });
    await act(async () => { render(<BannerBackground />); });
    const adds = addSpy.mock.calls.filter(([e]) => e === "mousemove").length;
    const removes = removeSpy.mock.calls.filter(([e]) => e === "mousemove").length;
    expect(adds).toBe(removes);
  });

  it("does NOT attach mousemove listener (net) when prefers-reduced-motion is active", async () => {
    _reducedMotion = true;
    await act(async () => { render(<BannerBackground />); });
    const adds = addSpy.mock.calls.filter(([e]) => e === "mousemove").length;
    const removes = removeSpy.mock.calls.filter(([e]) => e === "mousemove").length;
    expect(adds).toBe(removes);
  });

  it("attaches mousemove listener on a non-touch, no-reduced-motion device", async () => {
    await act(async () => { render(<BannerBackground />); });
    const adds = addSpy.mock.calls.filter(([e]) => e === "mousemove").length;
    const removes = removeSpy.mock.calls.filter(([e]) => e === "mousemove").length;
    expect(adds).toBeGreaterThan(removes);
  });

  it("removes mousemove listener on unmount", async () => {
    const { unmount } = render(<BannerBackground />);
    await act(async () => { unmount(); });
    const removes = removeSpy.mock.calls.filter(([e]) => e === "mousemove").length;
    expect(removes).toBeGreaterThan(0);
  });
});

function TransitionTest({ href }: { href: string }) {
  const { startTransition } = usePageTransition();
  return <button onClick={() => startTransition(href)}>go</button>;
}

describe("PageTransitionProvider – deadline safety-net (anti-stuck overlay)", () => {
  beforeEach(() => {
    _coarsePointer = false;
    _reducedMotion = false;
    Object.defineProperty(navigator, "maxTouchPoints", { configurable: true, value: 0 });
    mockPush.mockClear();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("forces router.push after the 900 ms cover deadline (no animation callback)", async () => {
    await act(async () => {
      render(<PageTransitionProvider><TransitionTest href="/about" /></PageTransitionProvider>);
    });
    await act(async () => { fireEvent.click(screen.getByText("go")); });
    expect(mockPush).not.toHaveBeenCalled();
    await act(async () => { jest.advanceTimersByTime(950); });
    expect(mockPush).toHaveBeenCalledWith("/about");
  });

  it("clears the overlay (phase to idle) after the 700 ms reveal deadline", async () => {
    const { container } = render(
      <PageTransitionProvider><TransitionTest href="/projects" /></PageTransitionProvider>
    );
    await act(async () => { fireEvent.click(screen.getByText("go")); });
    await act(async () => { jest.advanceTimersByTime(950); });
    await act(async () => { jest.advanceTimersByTime(750); });
    expect(container.querySelector("[aria-hidden='true']")).toBeNull();
  });

  it("does NOT call router.push more than once (guard ref prevents double-advance)", async () => {
    await act(async () => {
      render(<PageTransitionProvider><TransitionTest href="/about" /></PageTransitionProvider>);
    });
    await act(async () => { fireEvent.click(screen.getByText("go")); });
    const cb = (global as Record<string, unknown>).__lastOnAnimationComplete as (() => void) | undefined;
    if (cb) { await act(async () => { cb(); }); }
    await act(async () => { jest.advanceTimersByTime(950); });
    expect(mockPush.mock.calls.length).toBeLessThanOrEqual(1);
  });
});

describe("About page – mobile paragraph variant", () => {
  afterEach(() => {
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 1024 });
  });

  const firstParagraphMatcher =
    /I first learned to break down real problems instead of just writing code that compiles/;

  it("shows mobile paragraphs when viewport width is 375 px", async () => {
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 375 });
    await act(async () => { render(<About />); });
    expect(screen.getByText(firstParagraphMatcher)).toBeInTheDocument();
  });

  it("shows desktop paragraphs when viewport width is 1440 px", async () => {
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 1440 });
    await act(async () => { render(<About />); });
    expect(screen.getByText(firstParagraphMatcher)).toBeInTheDocument();
  });

  it("switches to mobile paragraphs when window resizes to 375 px", async () => {
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 1440 });
    await act(async () => { render(<About />); });
    expect(screen.getByText(firstParagraphMatcher)).toBeInTheDocument();
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 375 });
    await act(async () => { fireEvent(window, new Event("resize")); });
    expect(screen.getByText(firstParagraphMatcher)).toBeInTheDocument();
  });
});

describe("About page – mobile uses native scrolling (no touch snapping)", () => {
  beforeEach(() => {
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 375 });
    Object.defineProperty(navigator, "maxTouchPoints", { configurable: true, value: 5 });
  });

  afterEach(() => {
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 1024 });
    Object.defineProperty(navigator, "maxTouchPoints", { configurable: true, value: 0 });
  });

  it("does NOT register touchstart/touchend listeners (native scroll only)", async () => {
    const addSpy = jest.spyOn(window, "addEventListener");
    await act(async () => { render(<About />); });
    const events = addSpy.mock.calls.map(([e]) => e);
    expect(events).not.toContain("touchstart");
    expect(events).not.toContain("touchend");
    addSpy.mockRestore();
  });

  it("registers resize listener", async () => {
    const addSpy = jest.spyOn(window, "addEventListener");
    await act(async () => { render(<About />); });
    expect(addSpy.mock.calls.map(([e]) => e)).toContain("resize");
    addSpy.mockRestore();
  });

  it("removes resize listener on unmount", async () => {
    const removeSpy = jest.spyOn(window, "removeEventListener");
    const { unmount } = render(<About />);
    await act(async () => { unmount(); });
    expect(removeSpy.mock.calls.map(([e]) => e)).toContain("resize");
    removeSpy.mockRestore();
  });
});

describe("LandingPageClient – wheel scroll performance guards", () => {
  it("registers wheel listener with { passive: false }", async () => {
    const addSpy = jest.spyOn(window, "addEventListener");
    await act(async () => { render(<LandingHero />); });
    const wheelCall = addSpy.mock.calls.find(([event]) => event === "wheel");
    expect(wheelCall).toBeDefined();
    expect(wheelCall?.[2]).toEqual({ passive: false });
    addSpy.mockRestore();
  });

  it("removes wheel listener on unmount (no memory leak)", async () => {
    const removeSpy = jest.spyOn(window, "removeEventListener");
    const { unmount } = render(<LandingHero />);
    await act(async () => { unmount(); });
    expect(removeSpy.mock.calls.map(([e]) => e)).toContain("wheel");
    removeSpy.mockRestore();
  });
});

// ===========================================================================
// 8 — LandingPageClient – wheel snap chain (hero → cloud → spotlight)
// ===========================================================================
// Geometry measured on a real 1440x900 render: the cloud section sits between
// the hero and the spotlight grid and is TALLER than the viewport. A snap that
// only knows about the spotlight grid flies straight past it in both
// directions, which is the regression these tests guard.

const CLOUD_TOP = 820;
const SPOTLIGHT_TOP = 1829;
const VIEWPORT = 900;
const PAGE_BOTTOM = 2831;

function setScrollY(y: number) {
  Object.defineProperty(window, "scrollY", { configurable: true, value: y });
}

function mountSnapSections() {
  for (const [id, top] of [
    ["cloud", CLOUD_TOP],
    ["spotlight", SPOTLIGHT_TOP],
  ] as const) {
    const el = document.createElement("div");
    el.id = id;
    el.getBoundingClientRect = () =>
      ({ top: top - window.scrollY }) as unknown as DOMRect;
    document.body.appendChild(el);
  }
}

function wheel(deltaY: number) {
  const event = new WheelEvent("wheel", { deltaY, cancelable: true });
  window.dispatchEvent(event);
  return event;
}

describe("LandingPageClient – wheel snap chain", () => {
  beforeEach(() => {
    _reducedMotion = false;
    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      value: VIEWPORT,
    });
    (animate as jest.Mock).mockClear();
    mountSnapSections();
  });

  afterEach(() => {
    document.getElementById("cloud")?.remove();
    document.getElementById("spotlight")?.remove();
    setScrollY(0);
  });

  /** Destination of the most recent snap animation. */
  const snapTarget = () => (animate as jest.Mock).mock.calls.at(-1)?.[1];

  it("snaps the hero to the section directly below it, not past it", async () => {
    setScrollY(0);
    await act(async () => { render(<LandingHero />); });
    await act(async () => { wheel(120); });
    expect(snapTarget()).toBe(CLOUD_TOP);
  });

  it("lets a section taller than the viewport scroll before snapping on", async () => {
    setScrollY(CLOUD_TOP);
    await act(async () => { render(<LandingHero />); });
    const event = wheel(120);
    expect(animate).not.toHaveBeenCalled();
    expect(event.defaultPrevented).toBe(false);
  });

  it("snaps onward once the end of the current section is in view", async () => {
    setScrollY(SPOTLIGHT_TOP - VIEWPORT);
    await act(async () => { render(<LandingHero />); });
    await act(async () => { wheel(120); });
    expect(snapTarget()).toBe(SPOTLIGHT_TOP);
  });

  it("does not yank to the top when scrolling up from deep in the page", async () => {
    setScrollY(PAGE_BOTTOM);
    await act(async () => { render(<LandingHero />); });
    const event = wheel(-120);
    expect(animate).not.toHaveBeenCalled();
    expect(event.defaultPrevented).toBe(false);
  });

  it("snaps up into the cloud section from the top of the spotlight grid", async () => {
    setScrollY(SPOTLIGHT_TOP);
    await act(async () => { render(<LandingHero />); });
    await act(async () => { wheel(-120); });
    expect(snapTarget()).toBe(CLOUD_TOP);
  });
});
