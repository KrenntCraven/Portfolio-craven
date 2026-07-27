import { getHeroCredentials } from "./hero-credentials";
import LandingPageClient from "./landing-page-client";

// Credentials are resolved here, on the server, so the tenure maths runs once
// per revalidation instead of drifting between server and client renders.
export default function LandingPage() {
  return <LandingPageClient credentials={getHeroCredentials()} />;
}
