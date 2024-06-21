/** @type {import('ts-jest').JestConfigWithTsJest} */

export default {
  preset: "ts-jest",
  testEnvironment: "node",
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/dist/",
    "/test/.*(\\.js|.ts)",
  ],
};
