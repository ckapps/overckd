/**
 * Configuration for the server
 */
export interface ServerConfig {
  /**
   * Port on which the server should serve
   */
  port: number;
}

/**
 * Represents the server section of a configuration file
 */
export interface ServerConfigFile {
  port?: number;
}

/**
 * Default configuration for server
 */
export const defaultServerConfig: ServerConfig = {
  port: 3000,
};
