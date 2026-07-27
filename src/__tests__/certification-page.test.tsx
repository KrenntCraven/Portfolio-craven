/**
 * Unit tests for the Certification section.
 *
 * These guard a factual claim rather than styling: the section tells the reader
 * how many credentials are independently verifiable, and every card must use the
 * same template whether or not it has a public credential URL.
 */

import { render, screen } from "@testing-library/react";
import Certification from "@/app/about/certification-page";
import { certifications } from "@/app/about/certification-data";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const MOTION_PROPS = new Set([
  "initial", "animate", "exit", "variants", "transition",
  "whileHover", "whileTap", "whileFocus", "whileDrag", "whileInView",
  "layout", "layoutId", "onAnimationStart", "onAnimationComplete",
  "viewport", "drag", "dragConstraints",
]);
jest.mock("framer-motion", () => {
  const actual = jest.requireActual<typeof import("framer-motion")>("framer-motion");
  return {
    ...actual,
    motion: new Proxy(
      {},
      {
        get: (_target, tag: string) =>
          ({ children, ...rest }: Record<string, unknown> & { children?: React.ReactNode }) => {
            /* eslint-disable @typescript-eslint/no-require-imports */
            const React = require("react");
            const clean = Object.fromEntries(
              Object.entries(rest).filter(([k]) => !MOTION_PROPS.has(k))
            );
            return React.createElement(tag, clean, children);
          },
      }
    ),
  };
});

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, fill: _f, sizes: _s, ...rest }: { src: string; alt: string; [key: string]: unknown }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...rest} />
  ),
}));

jest.mock("@/app/frontend/banner-background", () => ({
  BannerBackground: () => <div data-testid="banner-background" />,
}));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const linked = certifications.filter((cert) => cert.link);
const unlinked = certifications.filter((cert) => !cert.link);

const summaryLine = () =>
  screen.getByText(
    (_content, element) =>
      element?.tagName === "P" &&
      /independently verifiable/.test(element.textContent ?? ""),
  ).textContent ?? "";

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("Certification section", () => {
  describe("Verifiable count", () => {
    it("counts only credentials that have a public URL", () => {
      render(<Certification />);
      expect(summaryLine()).toContain(`${linked.length} independently verifiable`);
    });

    it("still reports the full number of certifications held", () => {
      render(<Certification />);
      expect(summaryLine()).toContain(`${certifications.length} certifications`);
    });

    it("does not claim every certification is verifiable", () => {
      // The original bug: the count was certifications.length, so an unlinked
      // credential was advertised as checkable.
      if (unlinked.length === 0) return;
      render(<Certification />);
      expect(summaryLine()).not.toContain(
        `${certifications.length} independently verifiable`,
      );
    });
  });

  describe("Card template", () => {
    it("renders one outbound link per credential that has a URL", () => {
      render(<Certification />);
      const hrefs = screen
        .getAllByRole("link")
        .map((anchor) => anchor.getAttribute("href"));
      expect(hrefs).toHaveLength(linked.length);
      for (const cert of linked) {
        expect(hrefs).toContain(cert.link);
      }
    });

    it("opens credentials in a new tab safely", () => {
      render(<Certification />);
      for (const anchor of screen.getAllByRole("link")) {
        expect(anchor).toHaveAttribute("target", "_blank");
        expect(anchor).toHaveAttribute("rel", expect.stringContaining("noopener"));
      }
    });

    it("falls back to a verified label on credentials with no URL", () => {
      render(<Certification />);
      expect(screen.queryAllByText("Verified")).toHaveLength(unlinked.length);
    });

    it("renders a badge image and a heading for every certification", () => {
      render(<Certification />);
      expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(
        certifications.length,
      );
      for (const cert of certifications) {
        expect(screen.getByAltText(`${cert.title} badge`)).toBeInTheDocument();
      }
    });
  });
});
