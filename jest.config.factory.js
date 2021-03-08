const baseConfig = require('./jest.config.base');

module.exports = {
  /**
   * Creates a jest configuration object
   * @param {*} options Options for jest
   * @returns
   */
  createJestConfig: options => {
    const { displayName, ...otherOptions } = options;

    return {
      // Use our base configuration
      ...baseConfig,

      // Provide some more default setup
      setupFiles: [],
      setupFilesAfterEnv: ['<rootDir>/test/setup-jest.ts'],

      // Now add the passed options
      ...otherOptions,
      // Add the display name
      displayName: `@overckd/${displayName}`,
    };
  },
};
