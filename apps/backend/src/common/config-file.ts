import { Context, Data } from 'effect';

export enum ConfigFileSection {
  Server = 'server',
  Repositories = 'repositories',
}

/** The config file the backend was started with. */
export class ConfigFile extends Context.Service<
  ConfigFile,
  {
    /** The absolute path of the file */
    readonly file: string;
    /** Resolves a path of the config against the file's directory */
    readonly resolve: (path: string) => string;
  }
>()('@overckd/backend/ConfigFile') {}

export class ConfigFileInvalid extends Data.TaggedError('ConfigFileInvalid')<{
  readonly message: string;
}> {}
