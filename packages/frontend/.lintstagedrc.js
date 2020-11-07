module.exports = {
  'src/**/*.ts': ['prettier --write'],
  '*.ts': ['ng-lint-staged lint --fix --', 'git add'],
  '*.{js,css}': 'prettier --write',
};
