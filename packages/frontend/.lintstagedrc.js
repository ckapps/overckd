module.exports = {
  'src/**/*.ts': ['prettier --write'],
  '*.ts': ['ng lint --fix'],
  '*.{js,css}': 'prettier --write',
};
