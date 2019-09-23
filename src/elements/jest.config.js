module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  collectCoverageFrom: ['src/**/*.ts'],
  name: 'client',
  displayName: 'client',
  moduleFileExtensions: ['js', 'ts', 'html', 'scss', 'css'],
  moduleNameMapper: {
    '^.+\\.(s*)css$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.[t|j]sx?$': 'babel-jest',
    '^.+\\.html$': '<rootDir>/src/test/utils/htmlLoader.js',
  },
  // transformIgnorePatterns: ['<rootDir>/node_modules/*'],
  // NOTE: if you don't set this correctly then when you reference
  // it later in a path string you'll get a confusing error message.
  // It says something like' Module <rootDir>/config/polyfills.js in
  // the setupFiles option was not found.'
  rootDir: './../../',

  testMatch: ['<rootDir>/src/elements/**/*.client.ts'],
};
