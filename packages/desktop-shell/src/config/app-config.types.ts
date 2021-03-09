import { ServerConfig, ServerConfigFile } from '@overckd/server';

import { AppPaths } from '../paths/config/app-paths.types';

/**
 * Represents the configuration for the application
 */
export interface AppConfig {
  /**
   * Paths relevent for the application
   */
  paths: AppPaths;
  /**
   * Configuration for the server used for serving the data
   */
  server: ServerConfig;
}

export interface DecodedAppConfigFile {
  /**
   * Root path
   */
  pathRoot: string;
  /**
   * Configure the paths of the app
   */
  paths?: Partial<AppPaths>;
  /**
   * Server configuration
   */
  server?: Partial<ServerConfigFile>;
}

/**
 * Structure of the YAML config file
 */
export type AppConfigFile = Partial<DecodedAppConfigFile>;
