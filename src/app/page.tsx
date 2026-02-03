import LandingPage from "./frontend/home/landing-page";

import FeaturedProjectsWrapper from "./backend/featured_projectsClient";

export default function Home() {
  return (
    <>
      <LandingPage />
      <div id="projects">
        <FeaturedProjectsWrapper />
      </div>
    </>
  );
}
