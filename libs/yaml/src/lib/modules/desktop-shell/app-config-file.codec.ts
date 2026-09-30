import * as t from 'io-ts';

import { serverConfig } from '../server';
import { appPaths } from './app-paths.codec';

/**
 * Structure of the YAML config file
 */
export const appConfigFile = t.partial({
  /**
   * Root path
   */
  pathRoot: t.string,
  /**
   * Configuration for application paths
   */
  paths: t.partial(appPaths.props),
  /**
   * Configuration for application server
   */
  server: t.partial(serverConfig.props),
});

export type AppConfigFile = t.TypeOf<typeof appConfigFile>;
