import baseConfig from '../../../../eslint.config.mjs';

export default [
  ...baseConfig,
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    languageOptions: {
      parserOptions: {
        project: ['libs/@overckd/recipe/adapter-http-client/tsconfig.*?.json'],
      },
    },
  },
];
