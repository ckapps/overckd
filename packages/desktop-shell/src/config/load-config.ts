import { stat, readFile } from '@ckapp/rxjs-node-fs';
import * as log from 'electron-log';
import * as path from 'path';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { yamlDecode } from '@overckd/yaml-parser';
import { generalYamlFile } from '@overckd/yaml-parser/dist/file-codec';

import { AppConfig, YamlConfig } from './app-config.types';
import { config } from './config';
import { finalizeAppConfig } from './finalize-config';
import { DEFAULT_CONFIG_FILE_NAME } from './defaults';

const logger = log.scope('config');

function decodeConfig(pathToConfigFile: string) {
  return readFile(pathToConfigFile, { encoding: 'utf8' }).pipe(
    yamlDecode(generalYamlFile),
    tap(() => logger.debug(`parsed config from file ${pathToConfigFile}`)),
    map((yaml: YamlConfig) => ({
      ...yaml,
      // If the root is not set, we provide the enclosing folder of the file
      pathRoot: yaml.pathRoot || path.dirname(path.resolve(pathToConfigFile)),
    })),
    map(yaml => finalizeAppConfig(yaml)),
  );
}

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

      logger.debug(
        `passed path ${pathToConfigFile} is a directory, searching for file with default name ${DEFAULT_CONFIG_FILE_NAME}`,
      );

      return actualFilename;
    }),
  );
}

function chooseConfig(pathToConfigFile: string): Observable<AppConfig> {
  // If no path was provided, we return the default configuration
  if (!pathToConfigFile) {
    logger.debug('using default configuration');
    return of(config);
  }

  return resolveConfigFilePath(pathToConfigFile).pipe(
    tap(filename => logger.info(`loading configuration file from ${filename}`)),
    mergeMap(actualFilename =>
      decodeConfig(actualFilename).pipe(
        catchError(e =>
          throwError(new Error(`could not read config file ${actualFilename}`)),
        ),
      ),
    ),
  );
}

/**
 * @param pathToConfigFile Path to the configuration file
 *
 * @returns
 * An observable that emits with the loaded app configuration
 */
export function loadConfig(pathToConfigFile: string): Observable<AppConfig> {
  logger.silly('called: loadConfig');

  return chooseConfig(pathToConfigFile).pipe(
    tap(config => logger.debug('finalized app config', config)),
  );
}
