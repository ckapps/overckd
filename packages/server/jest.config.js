const jestConfigFactory = require('../../jest.config.factory');

module.exports = jestConfigFactory.createJestConfig({
  displayName: 'server',
  moduleNameMapper: {
    // '^@app/(.*)$': '<rootDir>/src/app/$1',
  },
});
