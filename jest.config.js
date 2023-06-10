module.exports = {
  testEnvironment: "node",
  testMatch: ["**/**/*.test.js"],
  coverageThreshold: {
    global: {
      lines: 95,
      branches: 82,
      functions: 90,
      statements: 95,
    },
  },
  passWithNoTests: true,
};
