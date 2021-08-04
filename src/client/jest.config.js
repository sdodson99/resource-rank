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
  },
  testEnvironment: 'jest-environment-jsdom',
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/templates/'],
  collectCoverageFrom: ['**/*.{js,jsx}'],
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.next/',
    '<rootDir>/coverage/',
    '<rootDir>/.storybook/',
    '<rootDir>/templates/',
    '.config.js',
    '.stories.js',
  ],
  coverageDirectory: '<rootDir>/coverage/',
  coverageThreshold: {
    global: {
      branches: 25,
      functions: 25,
      lines: 25,
      statements: 25,
    },
  },
};
