const jestConfigFactory = require('../../jest.config.factory');

module.exports = jestConfigFactory.createJestConfig({
  displayName: 'yaml-parser',
  moduleNameMapper: {
    // '^@app/(.*)$': '<rootDir>/src/app/$1',
  },
});
