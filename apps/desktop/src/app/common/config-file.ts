import {
  Config,
  Context,
  Data,
  Effect,
  FileSystem,
  Option,
  Path,
  Schema,
} from 'effect';
import { Yaml } from 'effect/encoding';
import { ElectronPaths } from './electron-paths';

export enum ConfigFileSection {
  App = 'app',
}

/** The name of the config file */
export const configFileName = 'overckd.config.yaml';

/** The config file the app was started with, if any. */
export class ConfigFile extends Context.Service<
  ConfigFile,
  {
    /** The absolute path of the file; none, if the app runs on the defaults */
    readonly file: Option.Option<string>;
    /**
     * Resolves a path of the config against the file's directory, or the
     * working directory without a file
     */
    readonly resolve: (path: string) => string;
  }
>()('@overckd/desktop/ConfigFile') {}

export class ConfigFileInvalid extends Data.TaggedError('ConfigFileInvalid')<{
  readonly message: string;
}> {}

/**
 * Where the config file is: `OVERCKD_CONFIG`, a file or a directory with
 * `overckd.config.yaml`; without it, `overckd.config.yaml` in Electron's
 * `userData`, if it exists. None: the app runs on the defaults.
 */
export const findConfigFile = Effect.gen(function* () {
  const fs = yield* FileSystem.FileSystem;
  const path = yield* Path.Path;
  const fromEnv = yield* Config.option(Config.String('OVERCKD_CONFIG'));

  if (Option.isSome(fromEnv)) {
    const location = path.resolve(fromEnv.value);
    const info = yield* fs.stat(location).pipe(
      Effect.mapError(
        () =>
          new ConfigFileInvalid({
            message: `OVERCKD_CONFIG names no file: ${location}`,
          }),
      ),
    );
    return Option.some(
      info.type === 'Directory'
        ? path.join(location, configFileName)
        : location,
    );
  }

  const { userData } = yield* ElectronPaths;
  const inUserData = path.join(userData, configFileName);
  return (yield* fs.exists(inUserData))
    ? Option.some(inUserData)
    : Option.none<string>();
});

/** What a config file may contain: the sections, and the `overckd` header */
export const ConfigFileContent = Schema.Struct({
  overckd: Schema.optionalKey(Schema.String),
  [ConfigFileSection.App]: Schema.optionalKey(
    Schema.Struct({
      /** The app directory */
      dir: Schema.optionalKey(Schema.String),
    }).annotate({ messageUnexpectedKey: 'Unknown configuration' }),
  ),
}).annotate({ messageUnexpectedKey: 'Unknown configuration' });

/** Reads and checks the config `file` */
export const readConfigFile = Effect.fn('readConfigFile')(function* (
  file: string,
) {
  const fs = yield* FileSystem.FileSystem;
  const text = yield* fs.readFileString(file);
  const content = yield* Effect.try({
    try: () => Yaml.parse(text),
    catch: error =>
      new ConfigFileInvalid({
        message: `${file} is no valid YAML: ${error instanceof Error ? error.message : String(error)}`,
      }),
  });

  return yield* Schema.decodeUnknownEffect(
    Schema.NullOr(ConfigFileContent).annotate({
      message: 'Expected a mapping of sections',
    }),
    { errors: 'all', onExcessProperty: 'error' },
  )(content).pipe(
    Effect.mapError(
      error =>
        new ConfigFileInvalid({
          message: `${file} is invalid:\n${error.message}`,
        }),
    ),
  );
});
