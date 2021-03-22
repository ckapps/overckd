import * as path from 'path';

import { PathId } from './path-id.enum';
import { getPaths } from './paths';

class GetPathError extends Error {
  name = 'desktop-shell.Get-Path-Error';

  constructor(
    message: string,
    /**
     * Path id
     */
    public pathId?: PathId,
  ) {
    super(`GetPathError(${pathId}): ${message}`);
  }
}

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
    case PathId.Ingredients:
      return path.resolve(paths.app, 'ingredients');
    case PathId.Recipes:
      return path.resolve(paths.app, 'recipes');
    case PathId.Tags:
      return path.resolve(paths.app, 'tags');
    case PathId.Images:
      return path.resolve(paths.app, 'images');
    case PathId.AppAssets:
      return path.resolve(paths.appRoot, 'assets');
    default:
      throw new GetPathError(`Unknown path id`);
  }
}

/**
 * Resolves a path starting from a defined root.
 *
 * @param start The root to start resolving from
 * @param segments Path segments
 *
 * @returns
 * Resolved path starting from `start` and using the given `segments`
 */
export function getPathFromSegments(start: PathId, segments: string[]): string {
  const root = getPath(start);
  if (!root) {
    throw new GetPathError(`Could not resolve root`);
  }

  return path.resolve(root, ...segments);
}
