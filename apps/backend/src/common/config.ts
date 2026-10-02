import {
  ConfigProvider,
  Effect,
  FileSystem,
  Layer,
  Path,
  Schema,
  Struct,
} from 'effect';
import { Yaml } from 'effect/encoding';
import { FullRepositoriesConfig } from '../repositories/repositories.config';
import { ApiVersion, FullServerConfig } from '../server/server.config';
import {
  ConfigFile,
  ConfigFileInvalid,
  ConfigFileSection,
} from './config-file';

export { ConfigFile, ConfigFileInvalid } from './config-file';

const ServerConfigFileContent = FullServerConfig.mapFields(
  Struct.map(Schema.optional),
).annotate({
  messageUnexpectedKey: 'Unknown configuration',
});

export const ConfigFileContent = Schema.Struct({
  [ConfigFileSection.Server]: Schema.optionalKey(ServerConfigFileContent),
  [ConfigFileSection.Repositories]: Schema.optionalKey(FullRepositoriesConfig),
}).annotate({
  messageUnexpectedKey: 'Unknown configuration',
});

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

  const decode = Schema.decodeUnknownEffect(
    Schema.NullOr(ConfigFileContent).annotate({
      message: 'Expected a mapping of sections',
    }),
    { errors: 'all', onExcessProperty: 'error' },
  );

  return yield* decode(content).pipe(
    Effect.mapError(
      error =>
        new ConfigFileInvalid({
          message: `${file} is invalid:\n${error.message}`,
        }),
    ),
  );
});

export type ConfigFlags = Readonly<{
  [ConfigFileSection.Server]: {
    port?: number;
    apiVersion?: ApiVersion;
  };
}>;

type ConfigLayerOptions = {
  /** The config file (YAML) */
  readonly file: string;
  /** The values of the flags under their key paths; unsetf lags are `undefined` */
  readonly flags: ConfigFlags;
};

/**
 * The sources of the config, highest priority first: the flags, the
 * environment (`OVERCKD_` + the key path in CONSTANT_CASE, e.g.
 * `OVERCKD_SERVER_PORT`), the config file. The defaults live in the sections.
 */
export const ConfigLive = (options: ConfigLayerOptions) =>
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
