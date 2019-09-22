module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverageFrom: ['src/**/*.ts'],
  // skip entrypoint files (hard to test if require.main === module)
  testPathIgnorePatterns: ['src/server.ts', 'src/client.ts'],
};
