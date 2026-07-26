/**
 * Editorial rich-text rendering for the Project Details page.
 *
 * Server-safe (no "use client"): both the Contentful `Document` renderer and the
 * lightweight inline-markdown parser produce plain React elements. This is a
 * separate module from the Case Study page's renderer by design — the Case Study
 * page must remain untouched.
 */
import {
  documentToReactComponents,
  type Options,
} from "@contentful/rich-text-react-renderer";
import { MARKS, type Document } from "@contentful/rich-text-types";
import type { ReactNode } from "react";

/** Shared prose styling — Medium-style comfortable reading rhythm. */
export const PROSE_CLASS =
  "prose prose-neutral prose-lg max-w-none leading-[1.8] prose-headings:text-neutral-800 prose-headings:font-semibold prose-headings:tracking-tight prose-h2:text-2xl prose-h3:text-xl prose-p:text-neutral-600 prose-p:leading-[1.8] prose-p:text-lg prose-strong:text-neutral-900 prose-strong:font-semibold prose-a:text-[#6c5ce7] prose-a:font-medium prose-a:no-underline hover:prose-a:underline prose-code:rounded prose-code:bg-neutral-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-[0.9em] prose-code:font-medium prose-code:text-neutral-800 prose-code:before:content-[''] prose-code:after:content-['']";

const RICH_TEXT_OPTIONS: Options = {
  renderMark: {
    [MARKS.BOLD]: (text) => (
      <strong className="font-semibold text-neutral-900">{text}</strong>
    ),
    [MARKS.ITALIC]: (text) => <em className="italic">{text}</em>,
    [MARKS.UNDERLINE]: (text) => <u className="underline">{text}</u>,
    [MARKS.CODE]: (text) => (
      <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-[0.9em] font-medium text-neutral-800">
        {text}
      </code>
    ),
  },
  renderText: (text) =>
    text
      .split("\n")
      .flatMap((segment, i) => (i === 0 ? [segment] : [<br key={i} />, segment])),
};

export function renderRichText(doc: Document): ReactNode {
  return documentToReactComponents(doc, RICH_TEXT_OPTIONS);
}

type RichNode = { value?: string; content?: RichNode[] };

function extractPlainText(node: RichNode | undefined): string {
  if (!node) return "";
  if (typeof node.value === "string") return node.value;
  if (Array.isArray(node.content))
    return node.content.map(extractPlainText).join(" ");
  return "";
}

/** A short, one-sentence teaser derived from a rich-text document. */
export function richTextTeaser(doc: Document | undefined, max = 200): string {
  const text = extractPlainText(doc as unknown as RichNode)
    .replace(/\s+/g, " ")
    .trim();
  if (!text) return "";
  const end = text.search(/[.!?]\s/);
  let teaser = end > 60 && end < max ? text.slice(0, end + 1) : text;
  if (teaser.length > max) teaser = `${teaser.slice(0, max - 1).trimEnd()}…`;
  return teaser;
}

/**
 * Parses a plain string with inline `**bold**` and `` `code` `` markers into
 * React nodes. Used for locally-authored copy (overview paragraphs, features).
 */
export function parseInline(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-neutral-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          className="rounded bg-neutral-100 px-1.5 py-0.5 text-[0.9em] font-medium text-neutral-800"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return <span key={i}>{part}</span>;
  });
}
