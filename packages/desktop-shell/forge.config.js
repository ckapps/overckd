/**
 * Configuration file for `electron-forge`
 */

module.exports = {
  packagerConfig: {
    // With lerna, the other packages are symlinked, so we need to deref them
    derefSymlinks: true,
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'desktop_shell',
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
};
