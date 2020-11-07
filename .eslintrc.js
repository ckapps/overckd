module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  /**
   * Putting these in the root .eslintignore doesn't work
   * because the eslint script is started for relative
   */
  ignorePatterns: [
    // Distribution / output folder
    'packages/*/dist',
    // Generated files
    '**/*.d.ts',
    '**/*.js',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
  ],
  parser: '@typescript-eslint/parser',
};
