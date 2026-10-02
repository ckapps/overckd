import { Effect, FileSystem, Layer, Path } from 'effect';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ServerConfig } from '../server/server.config';
import { ConfigFile, ConfigFlags, ConfigLive } from './config';

const file = '/srv/overckd/backend.config.yaml';

/** A file system with one file, `file` */
const fileSystem = (text: string) =>
  FileSystem.layerNoop({
    readFileString: path =>
      path === file ? Effect.succeed(text) : Effect.die(`unexpected ${path}`),
  });

/** `ConfigLive` on a config file with the given text */
const configLive = (text: string, flags: ConfigFlags = { server: {} }) =>
  ConfigLive({ file, flags }).pipe(
    Layer.provide([fileSystem(text), Path.layer]),
  );

/** The `server` section, read through `ConfigLive` */
const serverConfig = (text: string, flags: ConfigFlags = { server: {} }) =>
  ServerConfig.useSync(server => server).pipe(
    Effect.provide(ServerConfig.layer),
    Effect.provide(configLive(text, flags)),
  );

const yaml = `
server:
  port: 3001
  apiVersion: next
`;

describe('ConfigLive', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('reads the config file', async () => {
    expect(await Effect.runPromise(serverConfig(yaml))).toEqual({
      port: 3001,
      apiVersion: 'next',
    });
  });

  it('takes the defaults for an empty config file', async () => {
    expect(await Effect.runPromise(serverConfig(''))).toEqual({
      port: 3000,
      apiVersion: 'legacy',
    });
  });

  it('prefers a variable to the config file, key by key', async () => {
    vi.stubEnv('OVERCKD_SERVER_PORT', '4000');

    expect(await Effect.runPromise(serverConfig(yaml))).toEqual({
      port: 4000,
      apiVersion: 'next',
    });
  });

  it('prefers a flag to a variable', async () => {
    vi.stubEnv('OVERCKD_SERVER_PORT', '4000');
    vi.stubEnv('OVERCKD_SERVER_API_VERSION', 'next');

    expect(
      await Effect.runPromise(
        serverConfig(yaml, { server: { port: 5000, apiVersion: 'legacy' } }),
      ),
    ).toEqual({ port: 5000, apiVersion: 'legacy' });
  });

  it('leaves the keys of unset flags to the other sources', async () => {
    vi.stubEnv('OVERCKD_SERVER_PORT', '4000');

    expect(
      await Effect.runPromise(
        serverConfig(yaml, {
          server: { port: undefined, apiVersion: undefined },
        }),
      ),
    ).toEqual({ port: 4000, apiVersion: 'next' });
  });

  it.each([
    ['no YAML', 'server: [3000', 'is no valid YAML'],
    ['no mapping', '- 3000', 'Expected a mapping of sections'],
    ['an invalid value', 'server:\n  port: 1.5', 'Expected an integer'],
    ['an unknown section', 'sever:\n  port: 3001', 'Unknown configuration'],
    ['an unknown key', 'server:\n  prot: 3001', 'Unknown configuration'],
  ])('fails for a config file with %s', async (_, text, message) => {
    const error = await Effect.runPromise(Effect.flip(serverConfig(text)));

    expect(error._tag).toBe('ConfigFileInvalid');
    expect(error.message).toContain(file);
    expect(error.message).toContain(message);
  });

  it('resolves paths against the directory of the config file', async () => {
    const { resolve } = await Effect.runPromise(
      ConfigFile.useSync(configFile => configFile).pipe(
        Effect.provide(configLive(yaml)),
      ),
    );

    expect(resolve('./app')).toBe('/srv/overckd/app');
    expect(resolve('/data/app')).toBe('/data/app');
  });
});
