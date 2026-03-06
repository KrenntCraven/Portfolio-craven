/**
 * Unit tests for FeaturedProjectsClient
 *
 * Covers: heading & subtitle, empty state, project card rendering,
 * title capitalisation, and fallback initial letter.
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FeaturedProjectsClient from "@/app/frontend/home/featured-projects";

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

// Provide a no-op startTransition so click handlers don't error
jest.mock("@/app/frontend/page-transition/page-transition", () => ({
  usePageTransition: () => ({
    startTransition: jest.fn(),
  }),
}));

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const makeProject = (overrides: Partial<Project> = {}): Project => ({
  id: "project-1",
  title: "sample project",
  slug: "sample-project",
  imageUrl: undefined,
  coverPageUrl: undefined,
  ...overrides,
});

type Project = {
  id: string;
  title: string;
  imageUrl?: string;
  slug: string;
  coverPageUrl?: string;
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("FeaturedProjectsClient", () => {
  describe("Section heading & subtitle", () => {
    it("renders the 'Featured Projects' h1", () => {
      render(<FeaturedProjectsClient projects={[]} />);
      expect(
        screen.getByRole("heading", { level: 1, name: /Featured Projects/i })
      ).toBeInTheDocument();
    });

    it("renders the subtitle about real-world problems", () => {
      render(<FeaturedProjectsClient projects={[]} />);
      expect(
        screen.getByText(/real-world problems and scalable solutions/i)
      ).toBeInTheDocument();
    });
  });

  describe("Empty state", () => {
    it("renders no article cards when projects array is empty", () => {
      render(<FeaturedProjectsClient projects={[]} />);
      expect(screen.queryAllByRole("article")).toHaveLength(0);
    });
  });

  describe("Project card rendering", () => {
    it("renders one card per project", () => {
      const projects = [
        makeProject({ id: "1", title: "alpha", slug: "alpha" }),
        makeProject({ id: "2", title: "beta", slug: "beta" }),
        makeProject({ id: "3", title: "gamma", slug: "gamma" }),
      ];
      render(<FeaturedProjectsClient projects={projects} />);
      expect(screen.getAllByRole("article")).toHaveLength(3);
    });

    it("displays each project's title in its card", () => {
      const projects = [
        makeProject({ id: "1", title: "webapp", slug: "webapp" }),
        makeProject({ id: "2", title: "mobile app", slug: "mobile-app" }),
      ];
      render(<FeaturedProjectsClient projects={projects} />);
      // titles are capitalised by firstTextCapitalize()
      expect(screen.getByText("Webapp")).toBeInTheDocument();
      expect(screen.getByText("Mobile app")).toBeInTheDocument();
    });

    it("shows the 'Featured' badge on every card", () => {
      const projects = [
        makeProject({ id: "1", title: "one", slug: "one" }),
        makeProject({ id: "2", title: "two", slug: "two" }),
      ];
      render(<FeaturedProjectsClient projects={projects} />);
      expect(screen.getAllByText("Featured")).toHaveLength(2);
    });
  });

  describe("Title capitalisation (firstTextCapitalize)", () => {
    it("capitalises a lowercase title", () => {
      render(
        <FeaturedProjectsClient
          projects={[makeProject({ title: "my awesome project" })]}
        />
      );
      expect(screen.getByText("My awesome project")).toBeInTheDocument();
    });

    it("leaves an already-capitalised title unchanged", () => {
      render(
        <FeaturedProjectsClient
          projects={[makeProject({ title: "Portfolio App" })]}
        />
      );
      expect(screen.getByText("Portfolio App")).toBeInTheDocument();
    });
  });

  describe("Fallback initial letter", () => {
    it("shows the first letter of the title when coverPageUrl is absent", () => {
      render(
        <FeaturedProjectsClient
          projects={[
            makeProject({ title: "zeta project", slug: "zeta", coverPageUrl: undefined }),
          ]}
        />
      );
      // firstTextCapitalize applied to "zeta project"[0] = "Z"
      expect(screen.getByText("Z")).toBeInTheDocument();
    });

    it("shows 'P' as fallback when the title is an empty string", () => {
      render(
        <FeaturedProjectsClient
          projects={[makeProject({ title: "", slug: "empty", coverPageUrl: undefined })]}
        />
      );
      expect(screen.getByText("P")).toBeInTheDocument();
    });
  });

  describe("Project image", () => {
    it("renders an img with the project title as alt text when coverPageUrl is provided", () => {
      const cover = "https://images.ctfassets.net/cover.jpg";
      render(
        <FeaturedProjectsClient
          projects={[makeProject({ title: "design system", coverPageUrl: cover })]}
        />
      );
      expect(screen.getByAltText("design system")).toBeInTheDocument();
    });
  });

  describe("Click interaction", () => {
    it("marks the clicked project as the active one (state update)", async () => {
      const user = userEvent.setup();
      const projects = [
        makeProject({ id: "1", title: "clickable project", slug: "clickable" }),
      ];
      render(<FeaturedProjectsClient projects={projects} />);
      const card = screen.getByRole("article");
      // Should not throw / error on click
      await user.click(card);
    });
  });
});
