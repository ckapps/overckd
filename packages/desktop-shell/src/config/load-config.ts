import * as path from 'path';
import * as fs from 'fs';
import { promisify } from 'util';
import * as log from 'electron-log';

import { YamlConfig } from './app-config.types';
import { config } from './config';

import { readConfigFile } from './read-config-file';
import { finalizeAppConfig } from './finalize-config';
import { DEFAULT_CONFIG_FILE_NAME } from './defaults';

const fsStat = promisify(fs.stat);
const logger = log.scope('config');

async function parseConfig(pathToConfigFile: string) {
  // Read and parse the configuration file
  logger.info(`loading configuration file from ${pathToConfigFile}`);
  let yaml: YamlConfig;

  try {
    yaml = await readConfigFile(pathToConfigFile);
    logger.info(`parsed config from file ${pathToConfigFile}`);
  } catch (e) {
    throw new Error('could not read config file');
  }

  // Finalize and return
  const finalConfig = finalizeAppConfig(yaml);
  logger.silly('final config', finalConfig);
  return finalConfig;
}

/**
 * Loads the configuration from the given file at `pathToConfigFile`.
 *
 * @param pathToConfigFile The path to the configuration file/directory
 */
export async function loadConfig(pathToConfigFile: string) {
  logger.silly('called: loadConfig');

  // If no path was provided, we return the default configuration
  if (!pathToConfigFile) {
    logger.debug('using default configuration');
    return config;
  }

  // Make sure that the file exists
  let actualFilename = pathToConfigFile;
  let stat: fs.Stats;
  try {
    stat = await fsStat(pathToConfigFile);
  } catch (error) {
    throw new Error(`no such file or path: ${pathToConfigFile}`);
  }

  // If the passed path is a directory, check for a file with the default file name
  if (stat.isDirectory()) {
    actualFilename = path.join(pathToConfigFile, DEFAULT_CONFIG_FILE_NAME);
    logger.debug(`passed path ${pathToConfigFile} is a directory`);
    logger.debug(`trying to load config from ${actualFilename}`);

    try {
      stat = await fsStat(actualFilename);
      // Throw an error if the file does not exist
      if (!stat.isFile()) {
        throw new Error('not a file');
      }
    } catch (error) {
      throw new Error(`file does not exist: ${actualFilename}`);
    }
  }

  return parseConfig(actualFilename);
}
