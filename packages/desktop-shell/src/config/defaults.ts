import { defaultServerConfig } from '@overckd/server';

import { defaultAppPathsConfig } from '../paths/config/app-paths.defaults';

import { AppConfig } from './app-config.types';

/**
 * The default name of the configuration file
 */
export const DEFAULT_CONFIG_FILE_NAME = 'overckd.config.yaml';

/**
 * The default configuration for app
 */
export const defaultConfig: AppConfig = {
  paths: defaultAppPathsConfig,
  server: defaultServerConfig,
};
