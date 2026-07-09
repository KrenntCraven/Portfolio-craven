import type { Metadata } from "next";
import AboutPage from "./about-page";
import { JsonLd, profilePageSchema, SITE_DESCRIPTION } from "../seo";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Krennt Craven — a full-stack and cloud engineer. His work experience, technical skills, certifications, and education. " +
    SITE_DESCRIPTION,
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Krennt Craven",
    description:
      "Krennt Craven's background, experience, technical skills, certifications, and education.",
    url: "/about",
    type: "profile",
  },
};

export default function About() {
  return (
    <>
      <JsonLd schema={profilePageSchema} />
      <AboutPage />
    </>
  );
}
