import { ConfigProvider, Effect, Layer } from 'effect';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { ConfigFile } from '../common/config-file';
import { MediaConfig, mediaUrl } from './media.config';

const configFile = Layer.succeed(
  ConfigFile,
  ConfigFile.of({
    file: '/srv/overckd/backend.config.yaml',
    resolve: path => resolve('/srv/overckd', path),
  }),
);

/** The `media` section of a config with the given content */
const mediaConfig = (config: unknown) =>
  MediaConfig.useSync(media => media).pipe(
    Effect.provide(MediaConfig.layer),
    Effect.provide([
      configFile,
      ConfigProvider.layer(ConfigProvider.fromUnknown(config)),
    ]),
  );

const origin = 'http://localhost:3000';

/** The `media` section of a config with `filesystem` media */
const filesystemConfig = (media: object) =>
  mediaConfig({ media: { type: 'filesystem', origin, ...media } });

describe('MediaConfig', () => {
  it('has no media without a media section', async () => {
    expect(await Effect.runPromise(mediaConfig({}))).toEqual({
      type: 'none',
    });
  });

  it('reads the media section', async () => {
    expect(
      await Effect.runPromise(mediaConfig({ media: { type: 'none' } })),
    ).toEqual({ type: 'none' });
  });

  it('resolves a relative dir against the config file', async () => {
    expect(
      await Effect.runPromise(filesystemConfig({ dir: './app/images' })),
    ).toEqual({
      type: 'filesystem',
      dir: '/srv/overckd/app/images',
      path: '/media',
      origin,
    });
  });

  it('keeps an absolute dir', async () => {
    expect(
      await Effect.runPromise(filesystemConfig({ dir: '/data/images' })),
    ).toEqual({
      type: 'filesystem',
      dir: '/data/images',
      path: '/media',
      origin,
    });
  });

  it('takes the default for an empty path, as for an empty variable', async () => {
    expect(
      await Effect.runPromise(
        filesystemConfig({ dir: '/data/images', path: '' }),
      ),
    ).toMatchObject({ path: '/media' });
  });

  it('reads a path', async () => {
    expect(
      await Effect.runPromise(
        filesystemConfig({ dir: '/data/images', path: '/images' }),
      ),
    ).toMatchObject({ path: '/images' });
  });

  it.each(['media', '/media/', '/', '/media//images'])(
    'rejects the path %j, naming its key',
    async path => {
      const error = await Effect.runPromise(
        Effect.flip(filesystemConfig({ dir: '/data/images', path })),
      );

      expect(error._tag).toBe('ConfigError');
      expect(error.message).toContain('["media"]["path"]');
    },
  );

  it.each([
    'https://cdn.example.com',
    'http://192.168.1.10:3000',
    'overckd://app',
  ])('reads the origin %j', async origin => {
    expect(
      await Effect.runPromise(
        filesystemConfig({ dir: '/data/images', origin }),
      ),
    ).toMatchObject({ origin });
  });

  it.each([
    'localhost:3000',
    'http://localhost:3000/',
    'https://example.org/overckd',
    'http://localhost:3000?x=1',
    'not a url',
  ])('rejects the origin %j, naming its key', async origin => {
    const error = await Effect.runPromise(
      Effect.flip(filesystemConfig({ dir: '/data/images', origin })),
    );

    expect(error._tag).toBe('ConfigError');
    expect(error.message).toContain('["media"]["origin"]');
  });

  it('rejects filesystem media without an origin, naming its key', async () => {
    const error = await Effect.runPromise(
      Effect.flip(
        mediaConfig({ media: { type: 'filesystem', dir: '/data/images' } }),
      ),
    );

    expect(error._tag).toBe('ConfigError');
    expect(error.message).toContain('["media"]["origin"]');
  });

  it('rejects filesystem media without a dir, naming its key', async () => {
    const error = await Effect.runPromise(
      Effect.flip(mediaConfig({ media: { type: 'filesystem', origin } })),
    );

    expect(error._tag).toBe('ConfigError');
    expect(error.message).toContain('["media"]["dir"]');
  });

  it('rejects an unknown type, naming its key', async () => {
    const error = await Effect.runPromise(
      Effect.flip(mediaConfig({ media: { type: 's3' } })),
    );

    expect(error._tag).toBe('ConfigError');
    expect(error.message).toContain('["media"]["type"]');
  });
});

describe('mediaUrl', () => {
  it('is the origin followed by the path', () => {
    expect(
      mediaUrl({
        type: 'filesystem',
        dir: '/data/images',
        path: '/images',
        origin,
      }),
    ).toBe('http://localhost:3000/images');
  });

  it('is none without media', () => {
    expect(mediaUrl({ type: 'none' })).toBeUndefined();
  });
});
