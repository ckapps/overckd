const baseConfig = require('../../jest.config.base');

module.exports = {
  transformIgnorePatterns: baseConfig.transformIgnorePatterns,
  collectCoverageFrom: [
    ...baseConfig.collectCoverageFrom,
    // We are not testing angular modules (...yet)
    '!**/*.module.ts',
  ],

  preset: 'jest-preset-angular',
  moduleNameMapper: {
    // '^@app/(.*)$': '<rootDir>/src/app/$1',
    // TODO(project): remove
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  globalSetup: 'jest-preset-angular/global-setup',
  setupFiles: ['jest-canvas-mock'],
  setupFilesAfterEnv: ['<rootDir>/src/setup-jest.ts'],
};
