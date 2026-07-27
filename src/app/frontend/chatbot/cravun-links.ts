/**
 * Link policy for Cravun's Markdown replies.
 *
 * Kept in its own module (rather than inline in the chat component) so it can
 * be unit tested without pulling in `react-markdown`, which is ESM-only and
 * can't be parsed by Jest.
 */

/**
 * Whether a link in a Cravun reply should open in a new tab.
 *
 * External URLs and file downloads (notably the resume PDF) do, so following
 * one doesn't navigate away from an open conversation. In-site routes and
 * `mailto:` links are left alone.
 */
export function opensInNewTab(href?: string): boolean {
  if (!href) return false;
  return /^https?:\/\//i.test(href) || /\.pdf(?:[?#]|$)/i.test(href);
}
