import { app } from 'electron';
import * as path from 'path';

import { AppPaths } from './app-paths.types';

/**
 * The default paths
 */
export const defaultAppPathsConfig: AppPaths = {
  app: app.getPath('userData'),
  appRoot: path.resolve(__dirname, '../../..'),
  cache: app.getPath('sessionData'),
  logs: app.getPath('logs'),
  temp: app.getPath('temp'),
};
