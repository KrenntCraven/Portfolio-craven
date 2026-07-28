/**
 * Unit tests for ProjectPageClient — the layout Contentful projects render in.
 *
 * These pages were ~100 words each, which Search Console reported as
 * "Discovered - currently not indexed". The template now renders `overview`
 * and `impactStats` so filling those fields in the CMS deepens the page, and
 * the overview must never fall back to the case-study intro, which would
 * publish the same paragraphs on both /projects/<slug> and its /casestudy.
 */

import { render, screen } from "@testing-library/react";
import type { Document } from "@contentful/rich-text-types";
import ProjectPageClient from "@/app/projects/[slug]/ProjectPageClient";
import type { Project } from "@/app/backend/types";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const MOTION_PROPS = new Set([
  "initial", "animate", "exit", "variants", "transition",
  "whileHover", "whileTap", "whileFocus", "whileDrag", "whileInView",
  "viewport", "layout", "layoutId", "onAnimationStart", "onAnimationComplete",
  "drag", "dragConstraints",
]);
jest.mock("framer-motion", () => {
  const actual = jest.requireActual<typeof import("framer-motion")>("framer-motion");
  return {
    ...actual,
    MotionConfig: ({ children }: { children?: React.ReactNode }) => children,
    motion: new Proxy(
      {},
      {
        get: (_target, tag: string) =>
          ({ children, ...rest }: Record<string, unknown> & { children?: React.ReactNode }) => {
            const React = require("react");
            const clean = Object.fromEntries(
              Object.entries(rest).filter(([k]) => !MOTION_PROPS.has(k)),
            );
            return React.createElement(tag, clean, children);
          },
      },
    ),
  };
});

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, fill: _fill, priority: _priority, ...rest }: { src: string; alt: string; [key: string]: unknown }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...rest} />
  ),
}));

jest.mock("@/app/frontend/banner-background", () => ({
  BannerBackground: () => <div data-testid="banner-background" />,
}));

jest.mock("@/app/frontend/featured[slug]_Design", () => ({
  FeaturedSlugDesign: () => <div data-testid="slug-design" />,
}));

jest.mock("@/app/frontend/page-transition/page-transition", () => ({
  usePageTransition: () => ({ startTransition: jest.fn() }),
}));

// The component resets scroll on mount; jsdom has no scrollTo.
window.scrollTo = jest.fn();

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const richText = (text: string): Document =>
  ({
    nodeType: "document",
    data: {},
    content: [
      {
        nodeType: "paragraph",
        data: {},
        content: [{ nodeType: "text", value: text, marks: [], data: {} }],
      },
    ],
  }) as unknown as Document;

const makeProject = (overrides: Partial<Project> = {}): Project => ({
  id: "1",
  title: "OneSync",
  slug: "onesync",
  headline: "A digital POS system.",
  ...overrides,
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("ProjectPageClient", () => {
  describe("Overview", () => {
    it("renders every overview paragraph from the CMS", () => {
      render(
        <ProjectPageClient
          project={makeProject({
            overview: ["First paragraph of context.", "Second paragraph."],
          })}
        />,
      );
      expect(screen.getByText("First paragraph of context.")).toBeInTheDocument();
      expect(screen.getByText("Second paragraph.")).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: "About this project" }),
      ).toBeInTheDocument();
    });

    it("renders **bold** spans inside a paragraph", () => {
      render(
        <ProjectPageClient
          project={makeProject({ overview: ["Built on **Flutter** end to end."] })}
        />,
      );
      const strong = screen.getByText("Flutter");
      expect(strong.tagName).toBe("STRONG");
    });

    it("stays out of the way when the field is empty", () => {
      render(<ProjectPageClient project={makeProject()} />);
      expect(
        screen.queryByRole("heading", { name: "About this project" }),
      ).not.toBeInTheDocument();
    });

    it("does not republish the case-study intro as the overview", () => {
      // Two URLs carrying the same paragraphs is the duplicate-content trap
      // this section exists to avoid.
      render(
        <ProjectPageClient
          project={makeProject({
            caseStudy: richText("Case study intro that belongs on /casestudy."),
          })}
        />,
      );
      expect(
        screen.queryByText("Case study intro that belongs on /casestudy."),
      ).not.toBeInTheDocument();
    });
  });

  describe("Quick metrics", () => {
    it("renders a card per impact stat", () => {
      render(
        <ProjectPageClient
          project={makeProject({
            impactStats: [
              { value: "1M+", label: "Customers", description: "On the platform" },
              { value: "20,000+", label: "Agents" },
            ],
          })}
        />,
      );
      expect(screen.getByText("1M+")).toBeInTheDocument();
      expect(screen.getByText("On the platform")).toBeInTheDocument();
      expect(screen.getByText("20,000+")).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: "Quick metrics" }),
      ).toBeInTheDocument();
    });

    it("stays out of the way when there are no stats", () => {
      render(<ProjectPageClient project={makeProject()} />);
      expect(
        screen.queryByRole("heading", { name: "Quick metrics" }),
      ).not.toBeInTheDocument();
    });
  });
});
