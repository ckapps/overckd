import { stat } from '@ckapp/rxjs-node-fs';
import { LogLevel } from '@overckd/domain';
import * as path from 'path';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

import { LogScope, scoped } from '../logging';
import { logEnterExit } from '../core/electron/log-enter-exit';
import { tapElectronLog } from '../core/electron/tap-electron-log';
import { readAppConfigFile } from '../filesystem/read-app-config-file';
import { AppConfig } from './app-config.types';
import { config } from './config';
import { finalizeAppConfig } from './finalize-config';
import { DEFAULT_CONFIG_FILE_NAME } from './defaults';

const logger = scoped(LogScope.Config);

/**
 * @param pathToConfigFile Path where to look for the config file
 *
 * @returns
 * Observable that emits with the path to the configuration file
 */
function resolveConfigFilePath(pathToConfigFile: string): Observable<string> {
  return stat(pathToConfigFile).pipe(
    map(maybeDir => {
      if (!maybeDir.isDirectory()) {
        return pathToConfigFile;
      }

      // If the passed path is a directory, check for a file with the default file name
      const actualFilename = path.join(
        pathToConfigFile,
        DEFAULT_CONFIG_FILE_NAME,
      );

      logger.silly(
        `passed path ${pathToConfigFile} is a directory, searching for file with default name ${DEFAULT_CONFIG_FILE_NAME}`,
      );

      return actualFilename;
    }),
  );
}

/**
 * @param pathToConfigFile Optional path to the config file
 *
 * @returns
 * An observable that emits with the app configuration
 */
function chooseConfig(pathToConfigFile?: string): Observable<AppConfig> {
  // If no path was provided, we return the default configuration
  if (!pathToConfigFile) {
    return of(config).pipe(
      tapElectronLog({
        logger,
        level: LogLevel.Verbose,
        prefixes: ['Using default configuration'],
        withEmittedValues: true,
      }),
    );
  }

  return resolveConfigFilePath(pathToConfigFile).pipe(
    tapElectronLog({
      logger,
      level: LogLevel.Silly,
      prefixes: ['Loading app configuration from file'],
      withEmittedValues: true,
    }),
    mergeMap(actualFilename =>
      readAppConfigFile(actualFilename).pipe(
        map(finalizeAppConfig),
        logEnterExit('Parsing configuration file', {
          logger,
          level: LogLevel.Silly,
        }),
        catchError(e =>
          throwError(new Error(`could not read config file ${actualFilename}`)),
        ),
      ),
    ),
  );
}

/**
 * @param pathToConfigFile Optional path to the configuration file
 *
 * @returns
 * An observable that emits with the loaded app configuration
 */
export function loadConfig(pathToConfigFile?: string): Observable<AppConfig> {
  return chooseConfig(pathToConfigFile).pipe(
    logEnterExit('Loading app configuration', {
      logger,
      level: LogLevel.Verbose,
      withEmittedValues: true,
    }),
  );
}
