import { Config, Context, Effect, Layer, Schema } from 'effect';
import { ConfigFile, ConfigFileSection } from './config-file';
import { ElectronPaths } from './electron-paths';

const AppConfigSchema = Schema.Struct({
  /** The app directory */
  dir: Schema.optionalKey(Schema.String),
});

/** The `app` section of the config; its paths are absolute. */
export class AppConfig extends Context.Service<
  AppConfig,
  {
    /** The app directory (see `AppDirectory`), by default Electron's `userData` */
    readonly dir: string;
  }
>()('@overckd/desktop/AppConfig') {
  static readonly layer = Layer.effect(
    AppConfig,
    Effect.gen(function* () {
      const { resolve } = yield* ConfigFile;
      const { userData } = yield* ElectronPaths;
      const { dir } = yield* Config.schema(
        AppConfigSchema,
        ConfigFileSection.App,
      ).pipe(Config.withDefault<typeof AppConfigSchema.Type>({}));

      return AppConfig.of({ dir: dir === undefined ? userData : resolve(dir) });
    }),
  );
}
