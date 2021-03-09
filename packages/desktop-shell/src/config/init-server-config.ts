import { ServerConfig } from '@overckd/server';

import { AppConfigFile } from './app-config.types';

/**
 * Initializes the server configuration from YAML file and defaults
 *
 * @param yaml
 * @param defaults
 */
export function initServerConfig(
  yaml: AppConfigFile,
  defaults: ServerConfig,
): ServerConfig {
  const { server = {} } = yaml;

  const { paths: serverPaths = {} } = server;

  return {
    ...defaults,
    ...server,
    paths: {
      ...defaults.paths,
      ...serverPaths,
    },
  };
}
