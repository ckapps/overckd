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
}
