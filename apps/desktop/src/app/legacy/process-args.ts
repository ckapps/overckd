// ========================================================
// There is some weird problem with `yargs`
// related to their typings or to `yargs-parser`
// which leads to an error when trying to build this module
// Once this is resolved, we can use `npm i @types/yargs -D`
// to install the types again and remove the @ts-ignore.
// ========================================================

/**
 * CLI arguments for the overckd app
 */
interface OverckdArgs {
  /** Whether the app is started in dev mode. */
  dev: boolean;
  /** Path to the configuration file. */
  config?: string;
  /**
   * DEV-OPTION
   * If this option is set, load the main window content from an URL
   */
  fromUrl: boolean;
}

export function parseArgs(processArgs: string[]): OverckdArgs {
  //

  const configFromEnv = process.env.OVERCKD_CONFIG;

  const args: OverckdArgs = {
    dev: true,
    fromUrl: false,
    config: configFromEnv || undefined,
  };

  return args;

  // return {
  //   dev: true,
  //   fromUrl: false,
  // };
  // return yargs(processArgs).options({
  //   dev: {
  //     type: 'boolean',
  //     default: false,
  //     describe: 'Opens dev tools in the renderer process',
  //   },
  //   fromUrl: {
  //     hidden: true,
  //     type: 'boolean',
  //     default: false,
  //     describe: 'Load contents for renderer process from localhost:4200',
  //   },
  //   config: {
  //     type: 'string',
  //     describe: `Path to the overckd configuration file or folder containing ${DEFAULT_CONFIG_FILE_NAME}`,
  //   },
  // }).argv as OverckdArgs;
}
