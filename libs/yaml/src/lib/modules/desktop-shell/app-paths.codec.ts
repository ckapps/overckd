import * as t from 'io-ts';

/**
 * Codec for application paths
 */
export const appPaths = t.type({
  /**
   * App path
   */
  app: t.string,
  /**
   * App root path
   */
  appRoot: t.string,
  /**
   * Cache directory
   */
  cache: t.string,
  /**
   * Logs directory
   */
  logs: t.string,
  /**
   * Temp directory
   */
  temp: t.string,
});

export const appPathsPartial = t.partial(appPaths.props);
