import { app } from 'electron';

import { AppPaths } from './app-paths.types';

/**
 * The default paths
 */
export const defaultAppPathsConfig: AppPaths = {
  app: app.getPath('userData'),
  cache: app.getPath('cache'),
  logs: app.getPath('logs'),
  temp: app.getPath('temp'),
};
