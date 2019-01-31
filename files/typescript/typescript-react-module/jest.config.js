module.exports = {
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: 'src/.*(/__tests__/.*|.test).tsx?$',
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup-tests.ts'],
};
