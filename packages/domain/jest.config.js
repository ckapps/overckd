const jestConfigFactory = require('../../jest.config.factory');

module.exports = jestConfigFactory.createJestConfig({
  displayName: 'domain',
  moduleNameMapper: {
    // '^@app/(.*)$': '<rootDir>/src/app/$1',
  },
});
