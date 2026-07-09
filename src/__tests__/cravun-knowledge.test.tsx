/**
 * Unit tests for the Cravun knowledge-base builder.
 *
 * Verifies the compiled system prompt contains the core portfolio facts and
 * degrades gracefully when the live Contentful fetch fails.
 */

// server-only throws outside a React Server Component; stub it for jsdom.
jest.mock("server-only", () => ({}));

// Mock the live projects source so no Contentful/network access occurs.
jest.mock("@/app/backend/contentful_init", () => ({
  getFeaturedProjects: jest.fn(),
}));

import { buildCravunSystemPrompt } from "@/app/frontend/chatbot/cravun-knowledge";
import { getFeaturedProjects } from "@/app/backend/contentful_init";

const mockGetProjects = getFeaturedProjects as jest.MockedFunction<
  typeof getFeaturedProjects
>;

describe("Cravun knowledge base", () => {
  beforeEach(() => {
    mockGetProjects.mockReset();
  });

  it("compiles the core facts about Krennt into the system prompt", async () => {
    mockGetProjects.mockResolvedValue([
      {
        id: "1",
        title: "Vendo Vault",
        slug: "vendo-vault",
        headline: "Smart IoT vending platform",
        role: "Full-stack Engineer",
        technologies: ["Next.js", "AWS"],
        keyFeatures: ["QR payments"],
        impactStats: [{ value: "30%", label: "faster checkout" }],
        siteLink: "https://example.com",
        githubLink: "https://github.com/example",
      },
    ]);

    const prompt = await buildCravunSystemPrompt();

    // Persona
    expect(prompt).toContain("Cravun");
    // Domain guardrails / strict scope
    expect(prompt).toContain("STRICT SCOPE");
    expect(prompt).toMatch(/only using the CONTEXT/i);
    // Experience
    expect(prompt).toContain("Amdocs");
    // Certifications
    expect(prompt).toContain("AWS Certified Solutions Architect");
    // Education
    expect(prompt).toContain("Pamantasan ng Lungsod ng Maynila");
    // Contact
    expect(prompt).toContain("krenntc@gmail.com");
    // Live project pulled from Contentful mock
    expect(prompt).toContain("Vendo Vault");
    expect(prompt).toContain("/projects/vendo-vault");
  });

  it("falls back gracefully when the projects fetch fails", async () => {
    mockGetProjects.mockRejectedValue(new Error("Contentful down"));

    const prompt = await buildCravunSystemPrompt();

    // Static knowledge is still present…
    expect(prompt).toContain("Amdocs");
    // …and the projects section degrades to a safe message instead of throwing.
    expect(prompt).toContain("temporarily unavailable");
  });
});
