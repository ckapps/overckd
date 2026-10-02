import { ConfigProvider, Effect } from 'effect';
import { describe, expect, it } from 'vitest';
import { RepositoriesConfig } from './repositories.config';

/** The `repositories` section of a config with the given content */
const repositoriesConfig = (config: unknown) =>
  RepositoriesConfig.useSync(repositories => repositories).pipe(
    Effect.provide(RepositoriesConfig.layer),
    Effect.provide(ConfigProvider.layer(ConfigProvider.fromUnknown(config))),
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

  it('rejects an unknown type, naming its key', async () => {
    const error = await Effect.runPromise(
      Effect.flip(repositoriesConfig({ repositories: { type: 'database' } })),
    );

    expect(error._tag).toBe('ConfigError');
    expect(error.message).toContain('["repositories"]["type"]');
  });
});
