import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Points to the Next.js app root so Jest picks up next.config.ts and .env files
  dir: "./",
});

const config: Config = {
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testMatch: ["<rootDir>/src/__tests__/**/*.test.tsx"],
  collectCoverageFrom: [
    "src/app/frontend/home/landing-page-client.tsx",
    "src/app/frontend/home/featured-projects.tsx",
    "src/app/about/about-page.tsx",
  ],
};

export default createJestConfig(config);
