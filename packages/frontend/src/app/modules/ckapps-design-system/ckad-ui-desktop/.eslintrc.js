module.exports = {
  extends: '../../../../../.eslintrc.js',
  overrides: [
    {
      files: ['*.ts'],
      excludedFiles: ['*.spec.ts'],
      rules: {
        '@angular-eslint/component-selector': [
          'error',
          {
            type: 'element',
            prefix: 'ckad-desktop',
            style: 'kebab-case',
          },
        ],
        '@angular-eslint/directive-selector': [
          'error',
          {
            type: 'attribute',
            prefix: 'ckad-desktop',
            style: 'camelCase',
          },
        ],
      },
    },
  ],
};
