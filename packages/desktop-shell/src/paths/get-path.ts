import * as path from 'path';

import { PathId } from './path-id.enum';
import { getPaths } from './paths';

/**
 * Returns the fully resolved path for the given `pathId`.
 *
 * @param pathId Named identifier for which the path should be returned
 *
 * @returns
 * Resolved path for the named special path
 */
export function getPath(pathId: PathId): string {
  const paths = getPaths();

  switch (pathId) {
    case PathId.Recipes:
      return path.resolve(paths.app, 'recipes');
    case PathId.Images:
      return path.resolve(paths.app, 'images');
    case PathId.AppAssets:
      return path.resolve(paths.appRoot, 'assets');
    default:
      return undefined;
  }
}
