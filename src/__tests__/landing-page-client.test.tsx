/**
 * Unit tests for LandingPageClient
 *
 * Tests the hero section content, social buttons, and responsive avatar.
 */

import { render, screen } from "@testing-library/react";
import LandingPageClient from "@/app/frontend/home/landing-page-client";
import { ContactModalProvider } from "@/app/frontend/contact-modal/contact-modal-context";

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

const renderHero = () =>
  render(
    <ContactModalProvider>
      <LandingPageClient />
    </ContactModalProvider>,
  );

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("LandingPageClient", () => {
  describe("Hero heading & intro text", () => {
    it("renders the availability eyebrow", () => {
      renderHero();
      expect(
        screen.getByText(/Full-Stack & Cloud Engineer/i)
      ).toBeInTheDocument();
    });

    it("renders the main h1 heading", () => {
      renderHero();
      expect(
        screen.getByRole("heading", { level: 1 })
      ).toHaveTextContent(/Hi, I'm Krennt Craven/i);
    });

    it("renders the tagline paragraph", () => {
      renderHero();
      expect(
        screen.getByText(/reliable from first commit to production/i)
      ).toBeInTheDocument();
    });
  });

  describe("Avatar image", () => {
    it("renders the profile picture with an accessible alt text", () => {
      renderHero();
      expect(screen.getByAltText("Krennt Craven")).toBeInTheDocument();
    });
  });

  describe("Primary CTAs", () => {
    it("renders the 'View Featured' button", () => {
      renderHero();
      expect(
        screen.getByRole("button", { name: /View Featured/i })
      ).toBeInTheDocument();
    });

    it("renders the 'Get in touch' button", () => {
      renderHero();
      expect(
        screen.getByRole("button", { name: /Get in touch/i })
      ).toBeInTheDocument();
    });
  });

  describe("Social icon links", () => {
    it("renders the GitHub, LinkedIn, Gmail, and Resume links", () => {
      renderHero();
      expect(screen.getByLabelText("GitHub")).toBeInTheDocument();
      expect(screen.getByLabelText("LinkedIn")).toBeInTheDocument();
      expect(screen.getByLabelText("Gmail")).toBeInTheDocument();
      expect(screen.getByLabelText("Resume")).toBeInTheDocument();
    });

    it("does NOT render the Facebook link (filtered out)", () => {
      renderHero();
      expect(screen.queryByLabelText("Facebook")).not.toBeInTheDocument();
    });

    it("points the Resume link to the self-hosted /resume.pdf", () => {
      renderHero();
      expect(screen.getByLabelText("Resume")).toHaveAttribute(
        "href",
        "/resume.pdf",
      );
    });
  });
});
