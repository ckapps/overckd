/**
 * Array of node modules which should be transformed.
 */
const nodeModulesToTransform = ['@ckapp/rxjs-snafu'];

module.exports = {
  transform: {
    // '^.+\\.[tj]sx?$' to process js/ts with `ts-jest`
    // '^.+\\.m?[tj]sx?$' to process js/ts/mjs/mts with `ts-jest`
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
      },
    ],
  },
  transformIgnorePatterns: [
    `node_modules/(?!((${nodeModulesToTransform.join('|')})/)|(.*\\.mjs$))`,
  ],
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
