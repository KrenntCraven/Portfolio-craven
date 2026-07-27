/**
 * Unit tests for Cravun's link policy.
 *
 * Cravun is prompted to answer with Markdown links rather than bare paths
 * ("[view his resume](/resume.pdf)" instead of "…at /resume.pdf"), and the chat
 * bubble renders those as real anchors. These tests pin which of them open in a
 * new tab: anything that would otherwise navigate the visitor away from an open
 * conversation (external URLs, the resume PDF) should, while in-site routes and
 * mailto: links should not.
 */

import { opensInNewTab } from "@/app/frontend/chatbot/cravun-links";

describe("opensInNewTab", () => {
  it("opens the resume PDF in a new tab so the conversation isn't lost", () => {
    expect(opensInNewTab("/resume.pdf")).toBe(true);
  });

  it("opens external URLs in a new tab", () => {
    expect(opensInNewTab("https://www.credly.com/badges/abc")).toBe(true);
    expect(opensInNewTab("http://example.com")).toBe(true);
  });

  it("keeps in-site route links in the same tab", () => {
    expect(opensInNewTab("/projects")).toBe(false);
    expect(opensInNewTab("/about#experience")).toBe(false);
    expect(opensInNewTab("/projects/onesync")).toBe(false);
  });

  it("keeps mailto links in the same tab", () => {
    expect(opensInNewTab("mailto:krenntc@gmail.com")).toBe(false);
  });

  it("handles a PDF path carrying a query string or fragment", () => {
    expect(opensInNewTab("/resume.pdf?v=2")).toBe(true);
    expect(opensInNewTab("/resume.pdf#page=1")).toBe(true);
  });

  it("does not treat a route that merely contains 'pdf' as a file", () => {
    expect(opensInNewTab("/projects/pdf-renderer")).toBe(false);
  });

  it("is safe when a link has no href", () => {
    expect(opensInNewTab(undefined)).toBe(false);
    expect(opensInNewTab("")).toBe(false);
  });
});
