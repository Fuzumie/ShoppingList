module.exports = {
    testEnvironment: 'node',
    clearMocks: true,
    testMatch: ['**/tests/unit/**/*.test.js'],
    collectCoverage: true,
    collectCoverageFrom: ['./controllers/**/*.js'],
    coverageDirectory: 'coverage',
    setupFilesAfterEnv: ['./tests/setup/testSetup.js'],
    testPathIgnorePatterns: ["\\node_modules\\"], // Ignores node_modules
  };
  