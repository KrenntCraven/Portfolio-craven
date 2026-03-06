/**
 * Unit tests for the About page component
 *
 * Covers: main heading, about paragraphs, avatar image, logo,
 * and presence of the sub-section components.
 */

import { render, screen } from "@testing-library/react";
import About from "@/app/about/about-page";
import { aboutParagraphs, aboutMobileParagraphs } from "@/app/about/about-data";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const MOTION_PROPS = new Set([
  "initial", "animate", "exit", "variants", "transition",
  "whileHover", "whileTap", "whileFocus", "whileDrag", "whileInView",
  "layout", "layoutId", "onAnimationStart", "onAnimationComplete",
  "drag", "dragConstraints",
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
            const React = require("react");
            const clean = Object.fromEntries(
              Object.entries(rest).filter(([k]) => !MOTION_PROPS.has(k))
            );
            return React.createElement(tag, clean, children);
          },
      }
    ),
    animate: jest.fn().mockReturnValue({ stop: jest.fn() }),
  };
});

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, fill: _fill, priority: _priority, sizes: _sizes, quality: _quality, loading: _loading, ...rest }: { src: string; alt: string; [key: string]: unknown }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...rest} />
  ),
}));

jest.mock("@/app/frontend/banner-background", () => ({
  BannerBackground: () => <div data-testid="banner-background" />,
}));

// Mock sub-sections so tests stay focused on the About component itself
jest.mock("@/app/about/experience-page", () => ({
  __esModule: true,
  default: () => <section data-testid="experience-section">Experience</section>,
}));

jest.mock("@/app/about/certification-page", () => ({
  __esModule: true,
  default: () => <section data-testid="certification-section">Certifications</section>,
}));

jest.mock("@/app/about/techonologies-page", () => ({
  Technologies: () => <section data-testid="technologies-section">Technologies</section>,
}));

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("About page", () => {
  describe("Section heading", () => {
    it("renders the 'My Engineering Journey' heading", () => {
      render(<About />);
      expect(
        screen.getByRole("heading", { name: /My Engineering Journey/i })
      ).toBeInTheDocument();
    });
  });

  describe("About paragraphs", () => {
    it("renders at least one desktop about paragraph on initial load", () => {
      render(<About />);
      // jsdom defaults to a ~1024 px width, so desktop paragraphs are rendered
      const firstParagraph = aboutParagraphs[0];
      expect(screen.getByText(firstParagraph)).toBeInTheDocument();
    });

    it("renders all desktop about paragraphs", () => {
      render(<About />);
      for (const text of aboutParagraphs) {
        expect(screen.getByText(text)).toBeInTheDocument();
      }
    });

    it("has the correct number of about paragraphs", () => {
      render(<About />);
      // Each paragraph is a <p> inside the about section; match by content
      expect(aboutParagraphs.length).toBeGreaterThan(0);
      expect(aboutMobileParagraphs.length).toBeGreaterThan(0);
    });
  });

  describe("Avatar & logo images", () => {
    it("renders the profile picture with alt='Avatar'", () => {
      render(<About />);
      // There may be more than one Avatar img (about + landing share the same alt on this page)
      const avatars = screen.getAllByAltText("Avatar");
      expect(avatars.length).toBeGreaterThanOrEqual(1);
    });

    it("renders the KC logo with alt='KC Logo'", () => {
      render(<About />);
      expect(screen.getByAltText("KC Logo")).toBeInTheDocument();
    });
  });

  describe("Sub-section components", () => {
    it("renders the Experience section", () => {
      render(<About />);
      expect(screen.getByTestId("experience-section")).toBeInTheDocument();
    });

    it("renders the Certification section", () => {
      render(<About />);
      expect(screen.getByTestId("certification-section")).toBeInTheDocument();
    });

    it("renders the Technologies section", () => {
      render(<About />);
      expect(screen.getByTestId("technologies-section")).toBeInTheDocument();
    });
  });

  describe("Section id attributes", () => {
    it("has a section with id='about' for anchor navigation", () => {
      render(<About />);
      expect(document.querySelector("section#about")).not.toBeNull();
    });
  });
});
