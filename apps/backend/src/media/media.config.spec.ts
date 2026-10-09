import { ConfigProvider, Effect, Layer } from 'effect';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { ConfigFile } from '../common/config-file';
import { MediaConfig } from './media.config';

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
      await Effect.runPromise(
        mediaConfig({ media: { type: 'filesystem', dir: './app/images' } }),
      ),
    ).toEqual({
      type: 'filesystem',
      dir: '/srv/overckd/app/images',
      path: '/media',
    });
  });

  it('keeps an absolute dir', async () => {
    expect(
      await Effect.runPromise(
        mediaConfig({ media: { type: 'filesystem', dir: '/data/images' } }),
      ),
    ).toEqual({ type: 'filesystem', dir: '/data/images', path: '/media' });
  });

  it('takes the default for an empty path, as for an empty variable', async () => {
    expect(
      await Effect.runPromise(
        mediaConfig({
          media: { type: 'filesystem', dir: '/data/images', path: '' },
        }),
      ),
    ).toEqual({ type: 'filesystem', dir: '/data/images', path: '/media' });
  });

  it('reads a path', async () => {
    expect(
      await Effect.runPromise(
        mediaConfig({
          media: { type: 'filesystem', dir: '/data/images', path: '/images' },
        }),
      ),
    ).toEqual({ type: 'filesystem', dir: '/data/images', path: '/images' });
  });

  it.each(['media', '/media/', '/', '/media//images'])(
    'rejects the path %j, naming its key',
    async path => {
      const error = await Effect.runPromise(
        Effect.flip(
          mediaConfig({
            media: { type: 'filesystem', dir: '/data/images', path },
          }),
        ),
      );

      expect(error._tag).toBe('ConfigError');
      expect(error.message).toContain('["media"]["path"]');
    },
  );

  it('rejects filesystem media without a dir, naming its key', async () => {
    const error = await Effect.runPromise(
      Effect.flip(mediaConfig({ media: { type: 'filesystem' } })),
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
