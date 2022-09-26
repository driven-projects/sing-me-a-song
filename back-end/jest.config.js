/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  collectCoverage: true,
  coveragePathIgnorePatterns: [
    "node_modules",
    "test-config",
    "repositories",
    "middlewares",
    "routers",
    "database",
    "controllers",
    "schemas",

    "jestGlobalMocks.ts",
    "<rootDir>/src/services/testsService.ts",
    "<rootDir>/src/server.ts",
    "<rootDir>/src/utils",
    "<rootDir>/src/config",
    "<rootDir>/tests/factories",
  ],
};
