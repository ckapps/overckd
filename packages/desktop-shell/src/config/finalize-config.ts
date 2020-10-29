import { config } from './config';
import { initServerConfig } from './init-server-config';
import { loadPaths } from './load-paths';
import { YamlConfig } from './app-config.types';

/**
 * Finalize the configuration
 *
 * @param yaml Configuration loaded and parsed from YAML file
 */
export function finalizeAppConfig(yaml: YamlConfig) {
  // Initialize paths
  config.paths = loadPaths(yaml, config.paths);

  // Initialize server
  config.server = initServerConfig(yaml, config.server);

  return config;
}
