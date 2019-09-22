module.exports = {
  preset: 'jest-puppeteer',
  collectCoverageFrom: ['src/**/*.ts'],
  name: 'client',
  displayName: 'client',
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  // NOTE: if you don't set this correctly then when you reference
  // it later in a path string you'll get a confusing error message.
  // It says something like' Module <rootDir>/config/polyfills.js in
  // the setupFiles option was not found.'
  rootDir: './../../',

  testMatch: ['<rootDir>/src/elements/**/*.test.client.ts'],
};
