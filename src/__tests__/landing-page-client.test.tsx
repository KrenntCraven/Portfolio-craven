/**
 * Unit tests for LandingPageClient
 *
 * Tests the hero section content, social buttons, and responsive avatar.
 */

import { render, screen } from "@testing-library/react";
import LandingPageClient from "@/app/frontend/home/landing-page-client";
import {
  getHeroCredentials,
  yearsOfExperience,
} from "@/app/frontend/home/hero-credentials";
import { certifications } from "@/app/about/certification-data";
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

const renderHero = (credentials?: string[]) =>
  render(
    <ContactModalProvider>
      <LandingPageClient credentials={credentials} />
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
    it("renders the 'View Spotlight' button", () => {
      renderHero();
      expect(
        screen.getByRole("button", { name: /View Spotlight/i })
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

  describe("Credential chips", () => {
    it("renders a chip per credential passed from the server", () => {
      renderHero(["2 years as a Software Engineer", "6 cloud certifications"]);
      const list = screen.getByRole("list", { name: /credentials/i });
      expect(list).toBeInTheDocument();
      expect(screen.getByText("2 years as a Software Engineer")).toBeInTheDocument();
      expect(screen.getByText("6 cloud certifications")).toBeInTheDocument();
    });

    it("omits the list entirely when there are no credentials", () => {
      renderHero([]);
      expect(
        screen.queryByRole("list", { name: /credentials/i }),
      ).not.toBeInTheDocument();
    });
  });
});

// ---------------------------------------------------------------------------
// Credential derivation — guards against a stale or overstated hero claim
// ---------------------------------------------------------------------------

describe("hero credentials", () => {
  // Amdocs (the first full-time engineering role) started August 2024.
  it.each([
    ["2025-08-15", 1, "one year in"],
    ["2026-07-27", 2, "1y11m rounds up inside the two-month window"],
    ["2026-08-01", 2, "exactly two years"],
    ["2027-02-15", 2, "2y6m must NOT round up to three"],
    ["2027-06-15", 3, "approaching three years"],
  ])("reports %s as %i years (%s)", (date, expected) => {
    expect(yearsOfExperience(new Date(`${date}T12:00:00`))).toBe(expected);
  });

  it("never counts the pre-Amdocs internships", () => {
    // The WTW internship ran Oct 2023 – Apr 2024; if it were counted, mid-2026
    // would read 3 rather than 2.
    expect(yearsOfExperience(new Date("2026-07-27T12:00:00"))).toBe(2);
  });

  it("pluralises the tenure chip", () => {
    expect(getHeroCredentials(new Date("2025-08-15T12:00:00"))[0]).toBe(
      "1 year as a Software Engineer",
    );
    expect(getHeroCredentials(new Date("2026-08-15T12:00:00"))[0]).toBe(
      "2 years as a Software Engineer",
    );
  });

  it("takes the certification count from the About data", () => {
    expect(getHeroCredentials()).toContain(
      `${certifications.length} cloud certifications`,
    );
  });
});
