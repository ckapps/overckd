import {
  ConfigProvider,
  Context,
  Data,
  Effect,
  FileSystem,
  Layer,
  Path,
  Schema,
} from 'effect';
import { Yaml } from 'effect/encoding';

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

/** The config file is no YAML, or no mapping of sections. */
export class ConfigFileInvalid extends Data.TaggedError('ConfigFileInvalid')<{
  readonly message: string;
}> {}

/** What a config file may contain: sections by name, or nothing at all */
const isConfigFileContent = Schema.is(
  Schema.NullOr(Schema.Record(Schema.String, Schema.Unknown)),
);

const readConfigFile = Effect.fn('readConfigFile')(function* (file: string) {
  const fs = yield* FileSystem.FileSystem;
  const text = yield* fs.readFileString(file);
  const content = yield* Effect.try({
    try: () => Yaml.parse(text),
    catch: error =>
      new ConfigFileInvalid({
        message: `${file} is no valid YAML: ${error instanceof Error ? error.message : String(error)}`,
      }),
  });
  if (!isConfigFileContent(content)) {
    return yield* new ConfigFileInvalid({
      message: `${file} must contain a mapping of sections`,
    });
  }
  return content;
});

/**
 * The sources of the config, highest priority first: the flags, the
 * environment (`OVERCKD_` + the key path in CONSTANT_CASE, e.g.
 * `OVERCKD_SERVER_PORT`), the config file. The defaults live in the sections.
 * @param options.file The config file (YAML)
 * @param options.flags The values of the flags under their key paths; unset
 * flags are `undefined`
 */
export const ConfigLive = (options: {
  readonly file: string;
  readonly flags: object;
}) =>
  Layer.mergeAll(
    ConfigProvider.layer(
      Effect.gen(function* () {
        const file = yield* readConfigFile(options.file);
        return ConfigProvider.fromUnknown(options.flags).pipe(
          ConfigProvider.orElse(
            // `nested` comes last, so the prefix isn't converted
            ConfigProvider.fromEnv().pipe(
              ConfigProvider.constantCase,
              ConfigProvider.nested('OVERCKD'),
            ),
          ),
          ConfigProvider.orElse(ConfigProvider.fromUnknown(file)),
        );
      }),
    ),
    Layer.effect(
      ConfigFile,
      Effect.gen(function* () {
        const path = yield* Path.Path;
        const file = path.resolve(options.file);
        return ConfigFile.of({
          file,
          resolve: p => path.resolve(path.dirname(file), p),
        });
      }),
    ),
  );
