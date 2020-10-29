// eslint-disable-next-line no-undef
module.exports = {
  hooks: {
    'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS',
    // 'pre-commit': 'lint-staged',
  },
};
