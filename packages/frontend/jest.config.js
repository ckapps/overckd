const baseConfig = require('../../jest.config.base');

module.exports = {
  ...baseConfig,
  collectCoverageFrom: [
    ...baseConfig.collectCoverageFrom,
    // We are not testing angular modules (...yet)
    '!**/*.module.ts',
  ],

  preset: 'jest-preset-angular',
  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/src/app/$1',
  },
  setupFiles: ['jest-canvas-mock'],
  setupFilesAfterEnv: ['<rootDir>/src/setup-jest.ts'],
};
