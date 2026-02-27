import { getResumeUrl } from "@/app/backend/contentful_init";
import LandingPageClient from "./landing-page-client";

export default async function LandingPage() {
  const resumeUrl = await getResumeUrl();
  return <LandingPageClient resumeUrl={resumeUrl} />;
}
