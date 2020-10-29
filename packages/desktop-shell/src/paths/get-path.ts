import * as path from 'path';

import { PathId } from './path-id.enum';
import { getPaths } from './paths';

/**
 * Returns the fully resolved path for the given `pathId`.
 *
 * @param pathId
 */
export function getPath(pathId: PathId) {
  const paths = getPaths();

  switch (pathId) {
    case PathId.Recipes:
      return path.resolve(paths.app, 'recipes');
    case PathId.Images:
      return path.resolve(paths.app, 'images');
    default:
      return undefined;
  }
}
