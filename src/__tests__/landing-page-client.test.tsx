/**
 * Unit tests for LandingPageClient
 *
 * Tests the hero section content, social buttons, and responsive avatar.
 */

import { render, screen } from "@testing-library/react";
import LandingPageClient from "@/app/frontend/home/landing-page-client";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

// Suppress framer-motion animations so tests aren't timing-dependent
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
    animate: jest.fn(),
  };
});

// next/image → plain <img> so jsdom doesn't complain
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, fill: _fill, priority: _priority, sizes: _sizes, quality: _quality, loading: _loading, ...rest }: { src: string; alt: string; [key: string]: unknown }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...rest} />;
  },
}));

// HeroUI Button → simple anchor/button passthrough (strips unknown DOM props)
jest.mock("@heroui/button", () => ({
  Button: ({
    children,
    as: Tag = "button",
    href,
    // Strip props that aren't valid HTML attributes to avoid React DOM warnings
    startContent: _startContent,
    endContent: _endContent,
    fullWidth: _fullWidth,
    variant: _variant,
    radius: _radius,
    isLoading: _isLoading,
    isDisabled: _isDisabled,
    disableRipple: _disableRipple,
    ...rest
  }: {
    children?: React.ReactNode;
    as?: React.ElementType;
    href?: string;
    [key: string]: unknown;
  }) => {
    return <Tag href={href} {...rest}>{children}</Tag>;
  },
}));

// BannerBackground → empty div
jest.mock("@/app/frontend/banner-background", () => ({
  BannerBackground: () => <div data-testid="banner-background" />,
}));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const renderWithUrl = (resumeUrl: string | null) =>
  render(<LandingPageClient resumeUrl={resumeUrl} />);

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("LandingPageClient", () => {
  describe("Hero heading & intro text", () => {
    it("renders the name introduction text", () => {
      renderWithUrl(null);
      expect(
        screen.getByText(/Hello, I'm Krennt Craven/i)
      ).toBeInTheDocument();
    });

    it("renders the main h1 heading", () => {
      renderWithUrl(null);
      expect(
        screen.getByRole("heading", { level: 1 })
      ).toHaveTextContent(/Software Engineer Focused on Reliable Web and Mobile Solutions/i);
    });

    it("renders the tagline paragraph", () => {
      renderWithUrl(null);
      expect(
        screen.getByText(/I turn ideas into scalable, real-world applications/i)
      ).toBeInTheDocument();
    });
  });

  describe("Avatar image", () => {
    it("renders the profile picture with an accessible alt text", () => {
      renderWithUrl(null);
      expect(screen.getByAltText("Avatar")).toBeInTheDocument();
    });
  });

  describe("Social / action buttons", () => {
    it("renders the GitHub button", () => {
      renderWithUrl(null);
      expect(screen.getByText("GitHub")).toBeInTheDocument();
    });

    it("renders the LinkedIn button", () => {
      renderWithUrl(null);
      expect(screen.getByText("LinkedIn")).toBeInTheDocument();
    });

    it("renders the Gmail button", () => {
      renderWithUrl(null);
      expect(screen.getByText("Gmail")).toBeInTheDocument();
    });

    it("renders the Resume button", () => {
      renderWithUrl(null);
      expect(screen.getByText("Resume")).toBeInTheDocument();
    });

    it("does NOT render the Facebook button (filtered out)", () => {
      renderWithUrl(null);
      expect(screen.queryByText("Facebook")).not.toBeInTheDocument();
    });
  });

  describe("Resume URL prop", () => {
    it("uses the provided Contentful resume URL for the Resume button href", () => {
      renderWithUrl("https://cdn.contentful.com/my-resume.pdf");
      const resumeLink = screen.getByText("Resume").closest("a");
      expect(resumeLink).toHaveAttribute(
        "href",
        "https://cdn.contentful.com/my-resume.pdf"
      );
    });

    it("falls back to /Master-Resume.pdf when resumeUrl is null", () => {
      renderWithUrl(null);
      const resumeLink = screen.getByText("Resume").closest("a");
      expect(resumeLink).toHaveAttribute("href", "/Master-Resume.pdf");
    });
  });
});
