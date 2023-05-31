import * as path from 'path';
import { isString } from '@overckd/domain/dist/core/string/';

import { AppPaths } from '../paths/config/app-paths.types';
import { DecodedAppConfigFile } from './app-config.types';

/**
 * @param yaml The parsed yaml file
 * @param defaults The defaults
 */
export function loadPaths(
  yaml: DecodedAppConfigFile,
  defaults: AppPaths,
): AppPaths {
  const { paths: pathsFromConfig = {} } = yaml;

  const fileRoot = path.resolve(yaml.pathRoot);

  const entries = Object.entries(defaults) as unknown as [
    keyof AppPaths,
    string,
  ][];

  return entries
    .map(([key, defaultPath]) => {
      const providedPath = pathsFromConfig[key];

      const resolvedPath = isString(providedPath)
        ? path.resolve(fileRoot, providedPath)
        : defaultPath;

      return [key, resolvedPath];
    })
    .reduce(
      (acc, [key, absolutePath]) => ({ ...acc, [key]: absolutePath }),
      defaults,
    );
}
