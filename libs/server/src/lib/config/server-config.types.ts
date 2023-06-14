/**
 * Configuration for the server
 */
export interface ServerConfig {
  /**
   * Port on which the server should serve.
   * Use `0` or remove the value to use a dynamic port
   */
  port: number;

  /**
   * Collection of server related paths
   */
  paths: {
    /**
     * Path where the images are
     */
    images: string;
  };
}

/**
 * Represents a server configuration file
 */
export interface ServerConfigFile {
  port?: number;
  paths?: {
    images?: string;
  };
}
