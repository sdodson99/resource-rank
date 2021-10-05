module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: ['src/**/*.{js,jsx}'],
  coverageDirectory: '<rootDir>/coverage/',
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 75,
      lines: 75,
      statements: 75,
    },
  },
  setupFilesAfterEnv: ['<rootDir>/src/test-utils/setup/index.js'],
};
