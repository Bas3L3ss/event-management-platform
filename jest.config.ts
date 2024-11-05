import type { Config } from "jest";
import nextJest from "next/jest";

// Create a Next.js-specific Jest config
const createJestConfig = nextJest({
  // Path to the Next.js app
  dir: "./",
});

// Extend or customize the Jest configuration
const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    // Match the aliases set in your tsconfig.json
    "^@/components/(.*)$": "<rootDir>/src/components/$1",
    "^@/lib/(.*)$": "<rootDir>/src/lib/$1",
  },
  testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
};

// Export the config for Jest
export default createJestConfig(config);
