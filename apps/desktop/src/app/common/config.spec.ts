import {
  ConfigProvider,
  Effect,
  FileSystem,
  Layer,
  Option,
  Path,
  PlatformError,
} from 'effect';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AppConfig } from './app.config';
import { ConfigFileLive } from './config';
import { ConfigFileInvalid, findConfigFile } from './config-file';
import { ElectronPaths } from './electron-paths';

const userData = '/Users/me/Library/Application Support/overckd';

const electronPaths = Layer.succeed(
  ElectronPaths,
  ElectronPaths.of({ userData, logs: '/Users/me/Library/Logs/overckd' }),
);

/** A file system with the given files and directories */
const fileSystem = (
  files: Record<string, string>,
  directories: ReadonlyArray<string> = [],
) => {
  const notFound = (path: string) =>
    PlatformError.systemError({
      _tag: 'NotFound',
      module: 'FileSystem',
      method: 'stat',
      pathOrDescriptor: path,
    });
  return FileSystem.layerNoop({
    exists: path => Effect.succeed(path in files || directories.includes(path)),
    stat: path =>
      path in files || directories.includes(path)
        ? Effect.succeed({
            type: directories.includes(path) ? 'Directory' : 'File',
          } as FileSystem.File.Info)
        : Effect.fail(notFound(path)),
    readFileString: path =>
      path in files ? Effect.succeed(files[path]) : Effect.fail(notFound(path)),
  });
};

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('findConfigFile', () => {
  /** The config file found with the given environment and files */
  const find = (
    env: Record<string, string>,
    files: Record<string, string>,
    directories: ReadonlyArray<string> = [],
  ) =>
    Effect.runPromise(
      findConfigFile.pipe(
        Effect.provide([
          fileSystem(files, directories),
          Path.layer,
          electronPaths,
          ConfigProvider.layer(ConfigProvider.fromUnknown(env)),
        ]),
      ),
    );

  it('takes the file OVERCKD_CONFIG names', async () => {
    expect(
      await find(
        { OVERCKD_CONFIG: '/srv/overckd/my.config.yaml' },
        {
          '/srv/overckd/my.config.yaml': '',
        },
      ),
    ).toEqual(Option.some('/srv/overckd/my.config.yaml'));
  });

  it('takes overckd.config.yaml in the directory OVERCKD_CONFIG names', async () => {
    expect(
      await find({ OVERCKD_CONFIG: '/srv/overckd' }, {}, ['/srv/overckd']),
    ).toEqual(Option.some('/srv/overckd/overckd.config.yaml'));
  });

  it('fails when OVERCKD_CONFIG names nothing', async () => {
    const error = await Effect.runPromise(
      Effect.flip(
        findConfigFile.pipe(
          Effect.provide([
            fileSystem({}),
            Path.layer,
            electronPaths,
            ConfigProvider.layer(
              ConfigProvider.fromUnknown({ OVERCKD_CONFIG: '/nope' }),
            ),
          ]),
        ),
      ),
    );

    expect(error).toBeInstanceOf(ConfigFileInvalid);
    expect(error.message).toContain('/nope');
  });

  it('takes overckd.config.yaml in userData without OVERCKD_CONFIG', async () => {
    expect(await find({}, { [`${userData}/overckd.config.yaml`]: '' })).toEqual(
      Option.some(`${userData}/overckd.config.yaml`),
    );
  });

  it('finds no file without OVERCKD_CONFIG and a file in userData', async () => {
    expect(await find({}, {})).toEqual(Option.none());
  });
});

describe('AppConfig', () => {
  const file = '/srv/overckd/overckd.config.yaml';

  /** The `app` section, read through `ConfigFileLive` from `text` */
  const appConfig = (text: string | undefined) =>
    AppConfig.useSync(config => config).pipe(
      Effect.provide(AppConfig.layer),
      Effect.provide(
        ConfigFileLive(text === undefined ? Option.none() : Option.some(file)),
      ),
      Effect.provide([
        fileSystem(text === undefined ? {} : { [file]: text }),
        Path.layer,
        electronPaths,
      ]),
    );

  it('takes userData without a config file', async () => {
    expect(await Effect.runPromise(appConfig(undefined))).toEqual({
      dir: userData,
    });
  });

  it('takes userData without an app section', async () => {
    expect(await Effect.runPromise(appConfig('overckd: 1.0.0\n'))).toEqual({
      dir: userData,
    });
  });

  it('resolves the directory against the config file', async () => {
    expect(await Effect.runPromise(appConfig('app:\n  dir: ./app\n'))).toEqual({
      dir: '/srv/overckd/app',
    });
  });

  it('prefers a variable to the config file', async () => {
    vi.stubEnv('OVERCKD_APP_DIR', '/data/overckd');

    expect(await Effect.runPromise(appConfig('app:\n  dir: ./app\n'))).toEqual({
      dir: '/data/overckd',
    });
  });

  it.each([
    ['no YAML', 'app: [dir', 'is no valid YAML'],
    ['no mapping', '- ./app', 'Expected a mapping of sections'],
    ['an unknown section', 'server:\n  port: 3000', 'Unknown configuration'],
    ['an unknown key', 'app:\n  dri: ./app', 'Unknown configuration'],
  ])('rejects a config file with %s', async (_, text, message) => {
    const error = await Effect.runPromise(Effect.flip(appConfig(text)));

    expect(error).toBeInstanceOf(ConfigFileInvalid);
    expect(error.message).toContain(message);
  });
});
