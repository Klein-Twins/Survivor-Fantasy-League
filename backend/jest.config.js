module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'], // Match all test files in the tests folder
  moduleFileExtensions: ['ts', 'js'],
  setupFilesAfterEnv: ['./tests/setupTests.ts'], // Setup file for initializing tests
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
};
