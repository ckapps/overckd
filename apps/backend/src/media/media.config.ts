import { Config, Context, Effect, Layer, Match, Schema } from 'effect';
import { ConfigFile, ConfigFileSection } from '../common/config-file';

export const NoMediaConfig = Schema.Struct({
  type: Schema.Literal('none'),
});
export type NoMediaConfig = Schema.Schema.Type<typeof NoMediaConfig>;

/** A URL path such as `/media`: one or more segments, no trailing `/` */
export const MediaPath = Schema.String.check(
  Schema.isPattern(/^(\/[^/]+)+$/, {
    message: 'Expected a path such as /media, without a trailing /',
  }),
);

export const FilesystemMediaConfig = Schema.Struct({
  type: Schema.Literal('filesystem'),
  /** The directory of the media files */
  dir: Schema.String.annotate({
    description:
      'The directory of the media files, relative to the config file',
  }),
  /** The URL path under which the backend serves the files */
  path: MediaPath.pipe(
    Schema.withDecodingDefaultKey(Effect.succeed('/media')),
  ).annotate({
    description: 'The URL path under which the backend serves the files',
  }),
});
export type FilesystemMediaConfig = Schema.Schema.Type<
  typeof FilesystemMediaConfig
>;

/** The media to serve: one member per implementation, on `type`. */
export const FullMediaConfig = Schema.Union([
  NoMediaConfig,
  FilesystemMediaConfig,
]).annotate({
  description: 'The media to serve',
});
export type FullMediaConfig = Schema.Schema.Type<typeof FullMediaConfig>;

/** The `media` configuration; its paths are absolute. */
export class MediaConfig extends Context.Service<
  MediaConfig,
  FullMediaConfig
>()('@overckd/backend/MediaConfig') {
  static readonly layer = Layer.effect(
    MediaConfig,
    Effect.gen(function* () {
      const { resolve } = yield* ConfigFile;
      const config = yield* Config.schema(
        FullMediaConfig,
        ConfigFileSection.Media,
      ).pipe(Config.withDefault<FullMediaConfig>({ type: 'none' }));

      return Match.value(config).pipe(
        Match.discriminatorsExhaustive('type')({
          none: (config): FullMediaConfig => config,
          filesystem: (config): FullMediaConfig => ({
            ...config,
            dir: resolve(config.dir),
          }),
        }),
      );
    }),
  );
}
