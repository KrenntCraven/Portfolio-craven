import type { Document } from "@contentful/rich-text-types";

export type Project = {
  id: string;
  title: string;
  slug: string;
  headline?: string;
  imageUrl?: string;
  coverPageUrl?: string;
  projectType?: string[];
  keyFeatures?: string[];
  role?: string;
  technologies?: string[];
  order?: number;
  githubLink?: string;
  siteLink?: string;
  caseStudy?: Document;
  problemCaseStudy?: Document;
  solutionCaseStudy?: Document;
  technicalCaseStudy?: Document;
  impactOutcomeCaseStudy?: Document;
  challengesLearningsCaseStudy?: Document;
};
