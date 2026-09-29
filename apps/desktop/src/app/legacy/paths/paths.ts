import { AppPaths } from './config/app-paths.types';

// let _paths: AppPaths;

// export function setPaths(paths: AppPaths) {
//   _paths = paths;
// }

export function getPaths(): AppPaths {
  return require('../config/config').config.paths as AppPaths;
}
