/**
 * Configuration file for `electron-forge`
 */
const path = require('path');

const fse = require('fs-extra');
const _rimraf = require('rimraf');
const png2ico = require('png-to-ico');
const _png2icns = require('png2icns');

// ========================================================
// Promisified functions
// ========================================================
const rimraf = (path, options = {}) =>
  new Promise((resolve, reject) => {
    _rimraf(path, options, error => {
      if (error) {
        return reject(error);
      }
      resolve();
    });
  });

const png2icns = opts =>
  new Promise((resolve, reject) => {
    try {
      _png2icns(opts, resolve);
    } catch (error) {
      reject(error);
    }
  });

// ========================================================
// Utility functions
// ========================================================
async function generateIcoFile(pathIn, pathOut) {
  const buf = await png2ico(pathIn);
  await fse.writeFile(pathOut, buf);
}

async function generateIcnsFile(pathIn, pathOut) {
  await png2icns({
    in: pathIn,
    out: pathOut,
    // sizes: [16, 32, 64, 128, 256, 512], // optional.
  });
}

/**
 * Converts the given `png` file to
 * - `ico` file for windows
 * - `icns` file for macos
 *
 * If the files already exist, they will be removed.
 *
 * @param {string} png Path to the png file
 * @param {string} outPath Path where the files should be stored
 */
async function generateAppIcons(png, outPath) {
  // Remove previously created files
  await rimraf(`${outPath}.@(ico|icns)`);

  // Now generate the icon files
  await Promise.all([
    generateIcoFile(png, `${outPath}.ico`),
    generateIcnsFile(png, `${outPath}.icns`),
  ]);
}


// ========================================================
// Shared resources
// ========================================================
/** ROOT path that points to the workspace */
const workspaceRoot = path.join(__dirname, '../..');

/** Assets directory */
const dirAssets = 'assets';
/** Path to the `.icns`/`.ico` file for the app icon */
const appIcon = `${dirAssets}/app-icon/app-icon`;

// ========================================================
// Final configurations
// ========================================================
module.exports = {
  hooks: {
    prePackage: async () => {
      await Promise.all([
        generateAppIcons(
          `${dirAssets}/app-icon/png/app-icon-1024.png`,
          appIcon,
        ),
      ]);
    },
  },
  packagerConfig: {
    // With lerna, the other packages are symlinked, so we need to deref them
    derefSymlinks: true,
    ignore: [
      /\.eslintrc\.js/,
      /\.gitignore/,
      /\.lintstagedrc\.js/,
      /forge\.config\.js/,
      /package-lock\.json/,
      /tsconfig\.json/,
      // Somehow it seems like the src folder is needed
      // /\/src/,
    ],
    icon: appIcon,
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
