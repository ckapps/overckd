module.exports = {
  'src/**/*.ts': ['prettier --write'],
  '*.ts': ['eslint'],
  '*.{js,css}': 'prettier --write',
};
