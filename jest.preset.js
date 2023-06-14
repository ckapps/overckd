const nxPreset = require('@nx/jest/preset').default;

module.exports = {
  ...nxPreset,
  moduleNameMapper: {
    // '@ckapp/rxjs-snafu/(.*)': '<rootDir>/src/$1',
    // '@ckapp/rxjs-snafu/(.*)': '@ckapp/rxjs-snafu/lib/cjs/$1',
  },
};
