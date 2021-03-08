module.exports = {
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  preset: 'ts-jest/presets/default',
  coverageReporters: ['json', 'lcov', 'clover', 'text-summary', 'html'],
  moduleFileExtensions: ['ts', 'js'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    // exclude node modules
    '!**/node_modules/**',
    // Also, exclude all those index files that are just exporting other stuff
    '!**/index.ts',
  ],
};
