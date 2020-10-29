import { ServerConfig } from '@overckd/server';

import { YamlConfig } from './app-config.types';

/**
 * Initializes the server configuration from YAML file and defaults
 *
 * @param yaml
 * @param defaults
 */
export function initServerConfig(
  yaml: YamlConfig,
  defaults: ServerConfig,
): ServerConfig {
  const { server } = yaml;

  return {
    ...defaults,
    ...server,
  };
}
