/**
 * Central SEO configuration and structured data (JSON-LD).
 *
 * The Person + WebSite schemas are the strongest signal we can give Google to
 * understand that this site is the official portfolio of Krennt Craven, which
 * directly helps a "Krennt Craven" brand search resolve here.
 */

export const SITE_URL = "https://krenntcraven.com";
export const AUTHOR_NAME = "Krennt Craven";
export const AUTHOR_IMAGE = `${SITE_URL}/Picture.jpg`;

/** Shared Open Graph identity so per-page OG blocks don't drop these when they
 * override the root metadata (Next.js shallow-merges `openGraph`). */
export const OG_SITE_NAME = "Krennt Craven";
export const OG_LOCALE = "en_US";

export const SITE_DESCRIPTION =
  "Krennt Craven is a full-stack and cloud engineer building scalable, cloud-native systems — from frontend to backend to AWS infrastructure. Explore his experience, featured projects, and case studies.";

export const AUTHOR_ROLES = [
  "Software Engineer",
  "Full-Stack Engineer",
  "Cloud Engineer",
];

export const AUTHOR_SAME_AS = [
  "https://github.com/KrenntCraven",
  "https://www.linkedin.com/in/krennt-craven/",
  "https://www.facebook.com/CravenKrennt/",
];

export const AUTHOR_KNOWS_ABOUT = [
  "Full-Stack Development",
  "Cloud Computing",
  "Amazon Web Services (AWS)",
  "React",
  "Next.js",
  "Node.js",
  "TypeScript",
  "Software Engineering",
  "DevOps",
  "System Design",
];

/** Stable @id so other schema nodes can reference the same Person entity. */
export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": PERSON_ID,
  name: AUTHOR_NAME,
  alternateName: "Krennt Craven Portfolio",
  url: SITE_URL,
  image: AUTHOR_IMAGE,
  jobTitle: "Software Engineer",
  description: SITE_DESCRIPTION,
  sameAs: AUTHOR_SAME_AS,
  knowsAbout: AUTHOR_KNOWS_ABOUT,
  worksFor: {
    "@type": "Organization",
    name: "Amdocs",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Pamantasan ng Lungsod ng Maynila",
  },
  nationality: {
    "@type": "Country",
    name: "Philippines",
  },
} as const;

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: SITE_URL,
  name: `${AUTHOR_NAME} — Portfolio`,
  description: SITE_DESCRIPTION,
  inLanguage: "en",
  publisher: { "@id": PERSON_ID },
  author: { "@id": PERSON_ID },
} as const;

/** ProfilePage schema for the About route, tied to the Person entity. */
export const profilePageSchema = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": `${SITE_URL}/about#profilepage`,
  url: `${SITE_URL}/about`,
  name: `About ${AUTHOR_NAME}`,
  description: `About ${AUTHOR_NAME} — his background, experience, technical skills, certifications, and education.`,
  mainEntity: { "@id": PERSON_ID },
  isPartOf: { "@id": WEBSITE_ID },
} as const;

/** CreativeWork schema for a portfolio project/case study, tied to the author. */
export function creativeWorkSchema(input: {
  title: string;
  description: string;
  path: string;
  image?: string;
  isCaseStudy?: boolean;
}) {
  return {
    "@context": "https://schema.org",
    "@type": input.isCaseStudy ? "Article" : "CreativeWork",
    name: input.title,
    headline: input.title,
    description: input.description,
    url: `${SITE_URL}${input.path}`,
    ...(input.image && { image: input.image }),
    author: { "@id": PERSON_ID },
    creator: { "@id": PERSON_ID },
    isPartOf: { "@id": WEBSITE_ID },
  } as const;
}

/** BreadcrumbList schema so Google can render breadcrumb rich results and
 * better understand the site hierarchy on nested (project/case-study) pages. */
export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  } as const;
}

/** Renders one or more schema objects as a JSON-LD script tag. */
export function JsonLd({ schema }: { schema: object | object[] }) {
  const data = Array.isArray(schema) ? schema : [schema];
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe here (no user input); this is the
      // standard way to embed JSON-LD in the App Router.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
