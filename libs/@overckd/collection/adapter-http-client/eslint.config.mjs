import baseConfig from '../../../../eslint.config.mjs';

export default [
  ...baseConfig,
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    languageOptions: {
      parserOptions: {
        project: [
          'libs/@overckd/collection/adapter-http-client/tsconfig.*?.json',
        ],
      },
    },
  },
];
