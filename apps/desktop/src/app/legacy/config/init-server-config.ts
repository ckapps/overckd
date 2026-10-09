import { AppConfigFile } from './app-config.types';
import { ServerConfig } from './server-config';

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

  return { ...defaults, ...server };
}
