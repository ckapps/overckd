import { ConfigProvider, Effect, Layer, Option, Path } from 'effect';
import { ConfigFile, findConfigFile, readConfigFile } from './config-file';

export { ConfigFile, ConfigFileInvalid } from './config-file';

/**
 * The sources of the config for the given config `file`, highest priority
 * first: the environment (`OVERCKD_` + the key path in CONSTANT_CASE, e.g.
 * `OVERCKD_APP_DIR`), the config file. The defaults live in the sections.
 */
export const ConfigFileLive = (file: Option.Option<string>) =>
  Layer.mergeAll(
    ConfigProvider.layer(
      Effect.gen(function* () {
        // `nested` comes last, so the prefix isn't converted
        const env = ConfigProvider.fromEnv().pipe(
          ConfigProvider.constantCase,
          ConfigProvider.nested('OVERCKD'),
        );
        if (Option.isNone(file)) {
          return env;
        }
        const content = yield* readConfigFile(file.value);
        return env.pipe(
          ConfigProvider.orElse(ConfigProvider.fromUnknown(content)),
        );
      }),
    ),
    Layer.effect(
      ConfigFile,
      Effect.gen(function* () {
        const path = yield* Path.Path;
        const absolute = Option.map(file, f => path.resolve(f));
        return ConfigFile.of({
          file: absolute,
          resolve: p =>
            Option.match(absolute, {
              onNone: () => path.resolve(p),
              onSome: f => path.resolve(path.dirname(f), p),
            }),
        });
      }),
    ),
  );

/** The config of the config file the app finds (see `findConfigFile`) */
export const ConfigLive = Layer.unwrap(
  Effect.map(findConfigFile, ConfigFileLive),
);
