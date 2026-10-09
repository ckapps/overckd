import { ConfigProvider, Effect } from 'effect';
import { describe, expect, it } from 'vitest';
import { ServerConfig } from './server.config';

/** The `server` section of a config with the given content */
const serverConfig = (config: unknown) =>
  ServerConfig.useSync(server => server).pipe(
    Effect.provide(ServerConfig.layer),
    Effect.provide(ConfigProvider.layer(ConfigProvider.fromUnknown(config))),
  );

describe('ServerConfig', () => {
  it('takes the defaults without a server section', async () => {
    expect(await Effect.runPromise(serverConfig({}))).toEqual({
      port: 3000,
      apiVersion: 'next',
    });
  });

  it('reads the server section', async () => {
    expect(
      await Effect.runPromise(
        serverConfig({ server: { port: 4000, apiVersion: 'next' } }),
      ),
    ).toEqual({ port: 4000, apiVersion: 'next' });
  });

  it('takes the default for keys the section leaves out', async () => {
    expect(
      await Effect.runPromise(serverConfig({ server: { apiVersion: 'next' } })),
    ).toEqual({ port: 3000, apiVersion: 'next' });
  });

  it('rejects an invalid value, naming its key', async () => {
    const error = await Effect.runPromise(
      Effect.flip(serverConfig({ server: { apiVersion: 'v3' } })),
    );

    expect(error._tag).toBe('ConfigError');
    expect(error.message).toContain('["server"]["apiVersion"]');
  });

  it('rejects the legacy API, which is gone', async () => {
    const error = await Effect.runPromise(
      Effect.flip(serverConfig({ server: { apiVersion: 'legacy' } })),
    );

    expect(error.message).toContain('["server"]["apiVersion"]');
  });
});
