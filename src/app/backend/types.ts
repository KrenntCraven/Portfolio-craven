import type { Document } from "@contentful/rich-text-types";

export type ImpactStat = {
  value: string;
  label: string;
  description?: string;
};

export type ProjectStatus = "Completed" | "In Progress" | "Archived";

export type GalleryImage = {
  url: string;
  alt?: string;
  caption?: string;
};

export type Project = {
  id: string;
  title: string;
  slug: string;
  headline?: string;
  imageUrl?: string;
  coverPageUrl?: string;
  /** Optional editorial cover banner shown atop the detail-page hero. */
  bannerImage?: string;
  projectType?: string[];
  keyFeatures?: string[];
  role?: string;
  technologies?: string[];
  order?: number;
  githubLink?: string;
  siteLink?: string;
  /** Delivery status shown on the project detail page + cards. */
  status?: ProjectStatus;
  /** Human-readable timeline, e.g. "2025 – Present" or "3 months". */
  timeline?: string;
  /** Editorial overview paragraphs (plain text, supports **bold** / `code`). */
  overview?: string[];
  /** Optional screenshot gallery. */
  gallery?: GalleryImage[];
  caseStudy?: Document;
  problemCaseStudy?: Document;
  solutionCaseStudy?: Document;
  technicalCaseStudy?: Document;
  impactOutcomeCaseStudy?: Document;
  challengesLearningsCaseStudy?: Document;
  impactStats?: ImpactStat[];
};
