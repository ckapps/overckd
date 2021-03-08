const jestConfigFactory = require('../../jest.config.factory');

module.exports = jestConfigFactory.createJestConfig({
  displayName: 'domain-rx',
  moduleNameMapper: {
    // '^@app/(.*)$': '<rootDir>/src/app/$1',
  },
});
