/**
 * Hero credential chips — the seniority line under the tagline.
 *
 * Both numbers are derived rather than written down: the tenure counts from the
 * Amdocs start date in `experiences-data`, and the certification count comes
 * from `certification-data`. Neither can quietly go stale as the About page
 * grows, and the values are resolved on the server (see `landing-page.tsx`) so
 * the date maths can never produce a hydration mismatch.
 */
import { certifications } from "../../about/certification-data";

/** Start of full-time software engineering work — Amdocs, August 2024. */
const CAREER_START = { year: 2024, month: 8 };

/** Anniversaries land a couple of months early so "1 year 11 months" reads as 2. */
const ROUND_UP_WINDOW_MONTHS = 2;

/**
 * Whole years of professional software engineering experience. Internships
 * before Amdocs are deliberately excluded — the About page lists them, and
 * counting them here would overstate the figure a reviewer can check.
 */
export function yearsOfExperience(now: Date = new Date()): number {
  const months =
    (now.getFullYear() - CAREER_START.year) * 12 +
    (now.getMonth() + 1 - CAREER_START.month);
  return Math.floor((months + ROUND_UP_WINDOW_MONTHS) / 12);
}

export function getHeroCredentials(now: Date = new Date()): string[] {
  const years = yearsOfExperience(now);
  return [
    `${years} ${years === 1 ? "year" : "years"} as a Software Engineer`,
    "AWS migration serving 1M+ customers",
    `${certifications.length} cloud certifications`,
  ];
}
