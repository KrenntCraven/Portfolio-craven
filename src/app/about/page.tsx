import type { Metadata } from "next";
import AboutPage from "./about-page";
import {
  breadcrumbSchema,
  JsonLd,
  OG_LOCALE,
  OG_SITE_NAME,
  profilePageSchema,
} from "../seo";

// Page-specific copy: the meta description leads with concrete background
// (degree, employers) for search; OG/Twitter get their own tailored angles so
// no two surfaces duplicate the same string.
const ABOUT_META_DESCRIPTION =
  "Full-stack & cloud engineer with a Computer Engineering background from PLM. Experienced in building scalable applications, cloud solutions, and modern software systems across Amdocs, Willis Towers Watson, and GCash.";
const ABOUT_OG_DESCRIPTION =
  "Learn about Krennt Craven's background, software engineering experience, cloud expertise, and technical journey.";
const ABOUT_TWITTER_DESCRIPTION =
  "Full-stack & cloud engineer specializing in AWS, cloud technologies, and scalable software systems.";

export const metadata: Metadata = {
  // `absolute` bypasses the root "%s | Krennt Craven" template so the title
  // reads exactly "About — Krennt Craven".
  title: { absolute: "About — Krennt Craven" },
  description: ABOUT_META_DESCRIPTION,
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About — Krennt Craven",
    description: ABOUT_OG_DESCRIPTION,
    url: "/about",
    siteName: OG_SITE_NAME,
    locale: OG_LOCALE,
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "About — Krennt Craven",
    description: ABOUT_TWITTER_DESCRIPTION,
  },
};

export default function About() {
  return (
    <>
      <JsonLd
        schema={[
          profilePageSchema,
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ]),
        ]}
      />
      <AboutPage />
    </>
  );
}
