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

/**
 * Whether `value` is an origin: scheme, host and port, without a path or a
 * trailing `/`. Unlike `URL.origin`, it accepts custom schemes
 * (`overckd://app`).
 */
const isOrigin = (value: string) => {
  try {
    const url = new URL(value);
    return url.host !== '' && value === `${url.protocol}//${url.host}`;
  } catch {
    return false;
  }
};

/** An origin such as `http://localhost:3000` */
export const MediaOrigin = Schema.String.check(
  Schema.makeFilter(isOrigin, {
    message: 'Expected an origin such as http://localhost:3000, without a path',
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
  /** Where clients reach the files: the backend, or a CDN or reverse proxy in front of it */
  origin: MediaOrigin.annotate({
    description:
      'Where clients reach the files: the backend, or a CDN or a reverse proxy in front of it that serves them under the same path',
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

/**
 * Where clients reach the media of `config`, `<origin><path>`, which the
 * recipes link their images under; none for `none`.
 */
export const mediaUrl = (config: FullMediaConfig): string | undefined =>
  Match.value(config).pipe(
    Match.discriminatorsExhaustive('type')({
      none: () => undefined,
      filesystem: ({ origin, path }) => `${origin}${path}`,
    }),
  );
