// ========================================================
// There is some weird problem with `yargs`
// related to their typings or to `yargs-parser`
// which leads to an error when trying to build this module
// Once this is resolved, we can use `npm i @types/yargs -D`
// to install the types again and remove the @ts-ignore.

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import yargs = require('yargs/yargs');
// ========================================================

import { DEFAULT_CONFIG_FILE_NAME } from './config/defaults';

/**
 * CLI arguments for the overckd app
 */
interface OverckdArgs {
  dev: boolean;
  config?: string;
  /**
   * DEV-OPTION
   * If this option is set, load the main window content from an URL
   */
  fromUrl: boolean;
}

export function parseArgs(processArgs: string[]): OverckdArgs {
  return yargs(processArgs).options({
    dev: {
      type: 'boolean',
      default: false,
      describe: 'Opens dev tools in the renderer process',
    },
    fromUrl: {
      hidden: true,
      type: 'boolean',
      default: false,
      describe: 'Load contents for renderer process from localhost:4200',
    },
    config: {
      type: 'string',
      describe: `Path to the overckd configuration file or folder containing ${DEFAULT_CONFIG_FILE_NAME}`,
    },
  }).argv as OverckdArgs;
}
