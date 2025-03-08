const nxPreset = require('@nx/jest/preset').default;
const path = require('path');

module.exports = {
  ...nxPreset,
  setupFilesAfterEnv: [path.resolve(__dirname, './tools/jest/setup.ts')],
  moduleNameMapper: {
    // '@ckapp/rxjs-snafu/(.*)': '<rootDir>/src/$1',
    // '@ckapp/rxjs-snafu/(.*)': '@ckapp/rxjs-snafu/lib/cjs/$1',
  },
};
