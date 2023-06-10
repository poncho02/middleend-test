module.exports = {
  testEnvironment: "node",
  testMatch: ["**/**/*.test.js"],
  coverageThreshold: {
    global: {
      lines: 97,
      branches: 83,
      functions: 94,
      statements: 97,
    },
  },
  passWithNoTests: true,
};
