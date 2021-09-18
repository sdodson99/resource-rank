module.exports = {
  moduleNameMapper: {
    '.+\\.(css|styl|less|sass|scss)$': `identity-obj-proxy`,
    '.+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': `<rootDir>/__mocks__/file-mock.js`,
    '^@/components(.*)$': '<rootDir>/components/$1',
    '^@/hooks(.*)$': '<rootDir>/hooks/$1',
    '^@/graphql(.*)$': '<rootDir>/graphql/$1',
    '^@/services(.*)$': '<rootDir>/services/$1',
    '^@/styles(.*)$': '<rootDir>/styles/$1',
    '^@/configuration(.*)$': '<rootDir>/configuration/$1',
    '^@/errors(.*)$': '<rootDir>/errors/$1',
    '^@/validators(.*)$': '<rootDir>/validators/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/templates/',
    '<rootDir>/e2e/',
  ],
  collectCoverageFrom: ['**/*.{js,jsx}'],
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.next/',
    '<rootDir>/coverage/',
    '<rootDir>/.storybook/',
    '<rootDir>/templates/',
    '<rootDir>/e2e/',
    '<rootDir>/mocks/',
    '.config.js',
    '.stories.js',
  ],
  coverageDirectory: '<rootDir>/coverage/',
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  setupFilesAfterEnv: [
    '<rootDir>/test-utils/setup/intersection-observer-setup.js',
  ],
};
