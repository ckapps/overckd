import * as path from 'path';

import { AppPaths } from '../paths/config/app-paths.types';
import { YamlConfig } from './app-config.types';

/**
 * @param yaml The parsed yaml file
 * @param defaults The defaults
 */
export function loadPaths(yaml: YamlConfig, defaults: AppPaths) {
  const pathsFromConfig = yaml.paths;

  const fileRoot = path.resolve(yaml.pathRoot);

  return Object.entries(pathsFromConfig)
    .map<[string, string]>(([key, pathToFolder]) => [
      key,
      path.resolve(fileRoot, pathToFolder),
    ])
    .reduce(
      (acc, [key, absolutePath]) => ({ ...acc, [key]: absolutePath }),
      defaults,
    );
}
