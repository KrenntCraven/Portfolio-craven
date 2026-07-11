import type { Metadata } from "next";
import AboutPage from "./about-page";
import {
  breadcrumbSchema,
  JsonLd,
  OG_LOCALE,
  OG_SITE_NAME,
  profilePageSchema,
} from "../seo";

// Self-contained, ~155-char description tailored to the About page: who he is,
// his experience, and what the page offers — no homepage copy duplicated.
const ABOUT_DESCRIPTION =
  "Meet Krennt Craven, a full-stack and cloud engineer. Explore his career journey, work experience, technical skills, certifications, and education.";

export const metadata: Metadata = {
  title: "About",
  description: ABOUT_DESCRIPTION,
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Krennt Craven",
    description: ABOUT_DESCRIPTION,
    url: "/about",
    siteName: OG_SITE_NAME,
    locale: OG_LOCALE,
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Krennt Craven",
    description: ABOUT_DESCRIPTION,
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
