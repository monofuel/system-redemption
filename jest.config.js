module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  name: 'unit',
  displayName: 'unit',
  collectCoverageFrom: ['src/**/*.ts'],
  // skip entrypoint files (hard to test if require.main === module)
  testPathIgnorePatterns: ['src/server.ts', 'src/client.ts'],
  // TODO remove test.ts and move to unit
  testMatch: ['<rootDir>/src/**/*.test.ts', '<rootDir>/src/**/*.test.unit.ts'],
};
