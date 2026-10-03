import { ConfigProvider, Effect, Layer } from 'effect';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { ConfigFile } from '../common/config-file';
import { RepositoriesConfig } from './repositories.config';

const configFile = Layer.succeed(
  ConfigFile,
  ConfigFile.of({
    file: '/srv/overckd/backend.config.yaml',
    resolve: path => resolve('/srv/overckd', path),
  }),
);

/** The `repositories` section of a config with the given content */
const repositoriesConfig = (config: unknown) =>
  RepositoriesConfig.useSync(repositories => repositories).pipe(
    Effect.provide(RepositoriesConfig.layer),
    Effect.provide([
      configFile,
      ConfigProvider.layer(ConfigProvider.fromUnknown(config)),
    ]),
  );

describe('RepositoriesConfig', () => {
  it('takes memory repositories without a repositories section', async () => {
    expect(await Effect.runPromise(repositoriesConfig({}))).toEqual({
      type: 'memory',
    });
  });

  it('reads the repositories section', async () => {
    expect(
      await Effect.runPromise(
        repositoriesConfig({ repositories: { type: 'memory' } }),
      ),
    ).toEqual({ type: 'memory' });
  });

  it('resolves relative seeds against the config file', async () => {
    expect(
      await Effect.runPromise(
        repositoriesConfig({
          repositories: {
            type: 'memory',
            recipes: { seed: { files: './app/recipes/*.recipe.yaml' } },
            collections: { seed: { files: './app/overckd.collections.yaml' } },
          },
        }),
      ),
    ).toEqual({
      type: 'memory',
      recipes: { seed: { files: '/srv/overckd/app/recipes/*.recipe.yaml' } },
      collections: {
        seed: { files: '/srv/overckd/app/overckd.collections.yaml' },
      },
    });
  });

  it('keeps an absolute seed', async () => {
    expect(
      await Effect.runPromise(
        repositoriesConfig({
          repositories: {
            type: 'memory',
            recipes: { seed: { files: '/data/app/recipes/*.recipe.yaml' } },
          },
        }),
      ),
    ).toEqual({
      type: 'memory',
      recipes: { seed: { files: '/data/app/recipes/*.recipe.yaml' } },
    });
  });

  it('takes a repository without a seed', async () => {
    expect(
      await Effect.runPromise(
        repositoriesConfig({
          repositories: { type: 'memory', collections: {} },
        }),
      ),
    ).toEqual({ type: 'memory', collections: {} });
  });

  it('resolves the paths of file repositories against the config file', async () => {
    expect(
      await Effect.runPromise(
        repositoriesConfig({
          repositories: {
            type: 'filesystem',
            recipes: { dir: './app/recipes' },
            collections: { file: '/data/app/overckd.collections.yaml' },
          },
        }),
      ),
    ).toEqual({
      type: 'filesystem',
      recipes: { dir: '/srv/overckd/app/recipes' },
      collections: { file: '/data/app/overckd.collections.yaml' },
    });
  });

  it('rejects file repositories without a recipe dir, naming its key', async () => {
    const error = await Effect.runPromise(
      Effect.flip(
        repositoriesConfig({
          repositories: {
            type: 'filesystem',
            recipes: {},
            collections: { file: './app/overckd.collections.yaml' },
          },
        }),
      ),
    );

    expect(error._tag).toBe('ConfigError');
    expect(error.message).toContain('["repositories"]["recipes"]["dir"]');
  });

  it('rejects an unknown type, naming its key', async () => {
    const error = await Effect.runPromise(
      Effect.flip(repositoriesConfig({ repositories: { type: 'database' } })),
    );

    expect(error._tag).toBe('ConfigError');
    expect(error.message).toContain('["repositories"]["type"]');
  });
});
