import baseConfig from '../../../eslint.config.mjs';

export default [
  ...baseConfig,
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    languageOptions: {
      parserOptions: {
        project: ['libs/@overckd/adapter-http-server-legacy/tsconfig.*?.json'],
      },
    },
  },
];
