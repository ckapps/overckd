# Configuration

How an app reads its settings, shown on the backend. The code on this page was
typechecked against the installed Effect version, and the precedence and the
defaults were run.

## Sources and precedence

Each setting is looked up in four places, highest priority first:

| #   | Source              | Example                    |
| --- | ------------------- | -------------------------- |
| 1   | command-line flag   | `--port 4000`              |
| 2   | environment         | `OVERCKD_SERVER_PORT=4000` |
| 3   | config file         | `server: { port: 4000 }`   |
| 4   | default in the code | `3000`                     |

This is the order most tools use (Viper, Spring Boot, Docker). The details:

- **Per key, not per source.** A file that sets `server.apiVersion` and a
  variable that sets `server.port` combine.
- **Every key has an environment variable**: `OVERCKD_` and the key path in
  CONSTANT_CASE (`server.apiVersion` → `OVERCKD_SERVER_API_VERSION`). Only
  settings people change per run get a flag.
- **The config file** is YAML, and the required flag `--config` (`-c`) names
  it. Keys are camelCase.
- **Relative paths** in the config resolve against the directory of the config
  file, so a file and the data it points to can move together.
- **Invalid values stop the app at startup**, with the key path in the message
  (`Expected "legacy" | "next" at ["server"]["apiVersion"]`).

A config file uses only the keys it needs; everything else takes its default:

```yaml
# data/example-1/backend.config.yaml
server:
  port: 3000
  apiVersion: legacy
repositories:
  type: filesystem # or memory, with an optional seed directory
  dir: ./app
media: # optional; without it, the backend has no media
  type: filesystem
  dir: ./app/images
  path: /images # where the backend serves them; defaults to /media
  origin: http://localhost:3000 # where clients reach them
```

## Where things go

| What                                   | Where                                                        | Example                    |
| -------------------------------------- | ------------------------------------------------------------ | -------------------------- |
| the sources and their order            | `apps/<app>/src/common/config.ts`                            | `ConfigLive`, `ConfigFile` |
| a section: its schema and its service  | `apps/<app>/src/<section>/<section>.config.ts`               | `ServerConfig`             |
| the layers a section chooses or builds | `apps/<app>/src/<section>/<section>.ts`                      | `RepositoriesLive`         |
| what several sections share            | `apps/<app>/src/common/`                                     | `AppDirectory`             |
| flags, and wiring it all together      | `apps/<app>/src/cli.ts`                                      | `--port`                   |
| what an adapter needs to know          | a service in the adapter lib, named `<Implementation>Config` | `RecipeRepoFsConfig`       |

Each section has a folder of its own, and the file named after the folder plays
the part of an index file without being one: searching for `repositories`
finds it, and the app has no `index.ts` files.

Settings are read in apps only ([conventions](effect.md#configuration)).
Libraries never read `Config`: an adapter declares the settings it needs as a
service, and the app provides it ([adapter settings](#adapter-settings)).

## The sources

`ConfigLive` builds one `ConfigProvider` from the three sources and installs it
for the whole app. `ConfigProvider.orElse` asks the next source only for keys
the previous one doesn't have, which gives the per-key precedence.

```ts
// apps/backend/src/common/config.ts
import { ConfigProvider, Context, Effect, FileSystem, Layer, Path } from 'effect';
import { Yaml } from 'effect/encoding';

/** The config file the app was started with. */
export class ConfigFile extends Context.Service<
  ConfigFile,
  {
    /** The absolute path of the file */
    readonly file: string;
    /** Resolves a path of the config against the file's directory */
    readonly resolve: (path: string) => string;
  }
>()('@overckd/backend/ConfigFile') {}

/**
 * Where the config comes from, highest priority first: the flags, the
 * environment (`OVERCKD_` + the key path in CONSTANT_CASE), the config file.
 * The defaults live in the sections.
 */
export const ConfigLive = (options: { readonly file: string; readonly flags: object }) =>
  Layer.mergeAll(
    ConfigProvider.layer(
      Effect.gen(function* () {
        const fs = yield* FileSystem.FileSystem;
        const text = yield* fs.readFileString(options.file);
        const file = yield* Effect.try(() => Yaml.parse(text));
        return ConfigProvider.fromUnknown(options.flags).pipe(ConfigProvider.orElse(ConfigProvider.fromEnv().pipe(ConfigProvider.constantCase, ConfigProvider.nested('OVERCKD'))), ConfigProvider.orElse(ConfigProvider.fromUnknown(file)));
      }),
    ),
    Layer.effect(
      ConfigFile,
      Effect.gen(function* () {
        const path = yield* Path.Path;
        const file = path.resolve(options.file);
        return { file, resolve: p => path.resolve(path.dirname(file), p) };
      }),
    ),
  );
```

The order of `constantCase` and `nested` matters: `nested` comes last, so the
prefix is prepended to the converted path.

## Sections

Each top-level key of the config file is a **section**: a schema and a
service that holds its decoded value. The rest of the app reads settings only
through these services (`yield* ServerConfig`), never through `Config`.

```ts
// apps/backend/src/server/server.config.ts
import { Config, Context, Effect, Layer, Schema } from 'effect';

/** The versions of the HTTP API the backend can serve. */
export const ApiVersions = ['legacy', 'next'] as const;

const ServerConfigSchema = Schema.Struct({
  port: Schema.Int.pipe(Schema.withDecodingDefaultKey(Effect.succeed(3000))),
  apiVersion: Schema.Literals(ApiVersions).pipe(Schema.withDecodingDefaultKey(Effect.succeed('legacy' as const))),
});

/** The `server` section of the config. */
export class ServerConfig extends Context.Service<ServerConfig, typeof ServerConfigSchema.Type>()('@overckd/backend/ServerConfig') {
  static readonly layer = Layer.effect(
    ServerConfig,
    Config.schema(ServerConfigSchema, 'server').pipe(
      // Without a `server` section, every key takes its default
      Config.withDefault(Schema.decodeUnknownSync(ServerConfigSchema)({})),
    ),
  );
}
```

Rules for sections:

- One section per top-level key, named `<Section>Config`, with the key
  `'@overckd/<app>/<Section>Config'`. Its interface is the type of its schema.
- **Every setting has a default** (`Schema.withDecodingDefaultKey`), and the
  section has one as a whole (`Config.withDefault`). So code can add a setting
  before any config file mentions it. A setting without a sensible default
  (the directory of `filesystem` repositories) sits in a union member that is
  not the default.
- **Paths come out absolute.** The section resolves them with `ConfigFile`,
  so its consumers don't need to know where the file was.
- The layer is a static on the service. That is fine here: a section is an
  app-internal service with one implementation, not a port
  ([services and layers](effect.md#services-and-layers)). Tests provide a
  different value with `Layer.succeed(ServerConfig, …)`.
- A layer that needs a setting to be built reads its section with
  `Layer.unwrap`:

```ts
// apps/backend/src/server/server.ts
const ServerLive = Layer.unwrap(ServerConfig.useSync(({ port }) => NodeHttpServer.layer(createServer, { port })));
```

## Flags

The flags are parsed before the config file is known, so they don't read
config themselves: they are optional, have no default and no
`withFallbackConfig`, and the command hands their values to `ConfigLive` under
their key paths. An unset flag is `undefined` there, which `orElse` treats as
missing.

```ts
// apps/backend/src/cli.ts
const config = Flag.File('config', { mustExist: true }).pipe(Flag.withAlias('c'), Flag.withDescription('Config file (YAML)'));

const port = Flag.Int('port').pipe(Flag.withAlias('p'), Flag.withDescription('Port to run the server on'), Flag.optional);

export const command = Command.make('overckd', { config, port }, ({ config, port }) =>
  OverckdServerLive.pipe(
    Layer.provide([ServerLive, RepositoriesLive]),
    Layer.provide([ServerConfig.layer, RepositoriesConfig.layer]),
    Layer.provide(
      ConfigLive({
        file: config,
        flags: { server: { port: Option.getOrUndefined(port) } },
      }),
    ),
    Layer.launch,
  ),
);
```

Provide `ConfigLive` last. `Layer.provide` builds its argument for the layers
before it, so a section provided after `ConfigLive`, or inside a layer that
`ConfigLive` doesn't reach, reads only the environment. The compiler doesn't
catch this: the `ConfigProvider` is a reference with a default, not a
requirement. Provide each section once, here, rather than inside the layers
that read it.

Name a flag after its key in kebab-case (`apiVersion` → `--api-version`),
without the section when that stays clear. A flag that takes a path resolves it
against the working directory before handing it over, as people expect on a
command line.

## Choosing an implementation

When a setting chooses between implementations, its section is a union on
`type`, one member per implementation with the settings only that one needs:

```ts
// apps/backend/src/repositories/repositories.config.ts
const RepositoriesConfigSchema = Schema.Union([
  Schema.Struct({
    type: Schema.Literal('memory'),
    /** An app directory to fill the repositories from at startup */
    seed: Schema.optionalKey(Schema.String),
  }),
  Schema.Struct({
    type: Schema.Literal('filesystem'),
    /** The app directory */
    dir: Schema.String,
  }),
]);
type RepositoriesConfigType = typeof RepositoriesConfigSchema.Type;

/** The `repositories` section of the config; its paths are absolute. */
export class RepositoriesConfig extends Context.Service<RepositoriesConfig, RepositoriesConfigType>()('@overckd/backend/RepositoriesConfig') {
  static readonly layer = Layer.effect(
    RepositoriesConfig,
    Effect.gen(function* () {
      const { resolve } = yield* ConfigFile;
      const config = yield* Config.schema(RepositoriesConfigSchema, 'repositories').pipe(Config.withDefault<RepositoriesConfigType>({ type: 'memory' }));
      switch (config.type) {
        case 'memory':
          return config.seed === undefined ? config : { ...config, seed: resolve(config.seed) };
        case 'filesystem':
          return { ...config, dir: resolve(config.dir) };
      }
    }),
  );
}
```

The composition picks the layers with `Layer.unwrap`. The match is exhaustive,
so a new member doesn't compile until every choice handles it:

```ts
// apps/backend/src/repositories/repositories.ts
/** The repositories the `repositories` section asks for. */
export const RepositoriesLive = Layer.unwrap(
  Effect.gen(function* () {
    const config = yield* RepositoriesConfig;
    return Match.value(config).pipe(
      Match.discriminatorsExhaustive('type')({
        memory: () => Layer.mergeAll(CollectionRepoMemory(), RecipeRepoMemory()),
        filesystem: ({ dir }) => Layer.mergeAll(CollectionRepoFs, RecipeRepoFs).pipe(Layer.provide(FsConfigsLive), Layer.provide(AppDirectory.layer(dir))),
      }),
    );
  }),
);
```

`memory` with a `seed` reads the app directory once at startup, with the
readers the fs adapters use themselves, and keeps changes in memory.
`filesystem` reads the files on every call, so edits on disk show without a
restart.

## Adapter settings

An adapter that needs to know something (a directory, a file) declares it as a
service of its own, named `<Implementation>Config`, next to the adapter:

```ts
// libs/@overckd/recipe/adapter-fs/src/lib/recipe-repo.fs.ts
/** Configuration of `RecipeRepoFs`, provided by the app. */
export class RecipeRepoFsConfig extends Context.Service<
  RecipeRepoFsConfig,
  {
    /** The directory with the recipe files */
    readonly dir: string;
  }
>()('@overckd/recipe/adapter-fs/RecipeRepoFsConfig') {}
```

The adapter knows nothing about sections, keys or the config file. The app
provides the service from what its sections say, tests with
`Layer.succeed(RecipeRepoFsConfig, { dir })`.

Where the files of an app directory are (the layout of `data/example-1/app`) is
known in one place, the `AppDirectory` service. The fs adapters' settings are
derived from it:

```ts
// apps/backend/src/common/app-directory.ts
/** Where the files of an app directory are (see `data/example-1/app`). */
export class AppDirectory extends Context.Service<
  AppDirectory,
  {
    /** The directory of the `*.recipe.yaml` files */
    readonly recipes: string;
    /** `overckd.collections.yaml` */
    readonly collectionsFile: string;
    /** The directory of the recipe images */
    readonly images: string;
  }
>()('@overckd/backend/AppDirectory') {
  static readonly layer = (root: string) =>
    Layer.effect(
      AppDirectory,
      Effect.gen(function* () {
        const path = yield* Path.Path;
        return {
          recipes: path.join(root, 'recipes'),
          collectionsFile: path.join(root, 'overckd.collections.yaml'),
          images: path.join(root, 'images'),
        };
      }),
    );
}

// apps/backend/src/repositories/repositories.ts
const FsConfigsLive = Layer.mergeAll(
  Layer.effect(
    RecipeRepoFsConfig,
    AppDirectory.useSync(({ recipes }) => ({ dir: recipes })),
  ),
  Layer.effect(
    CollectionRepoFsConfig,
    AppDirectory.useSync(({ collectionsFile }) => ({ file: collectionsFile })),
  ),
);
```

## Testing

Test a section by providing a `ConfigProvider` made from a plain object; no
file and no environment are needed. Provide a `ConfigFile` too when the
section holds paths.

```ts
// apps/backend/src/server/server.config.spec.ts
const serverConfig = (config: unknown) => Effect.runPromise(ServerConfig.useSync(server => server).pipe(Effect.provide(ServerConfig.layer), Effect.provide(ConfigProvider.layer(ConfigProvider.fromUnknown(config)))));

it('takes the default for keys the file leaves out', async () => {
  expect(await serverConfig({ server: { apiVersion: 'next' } })).toEqual({ port: 3000, apiVersion: 'next' });
});
```

Test the order of the sources once, on `ConfigLive`: the file through
`FileSystem.layerNoop` with a `readFileString`, the environment with
`vi.stubEnv`. Code that only uses a section gets it with `Layer.succeed`.

## Checklist

- [ ] The setting has a default; no config file needs to change.
- [ ] It lives in a section, which hands out absolute paths.
- [ ] Code reads it through the section's service, never through `Config`.
- [ ] A choice between implementations is a union on `type`, matched
      exhaustively.
- [ ] Adapters get their settings as an `<Implementation>Config` service.
- [ ] A flag only for settings people change per run, without a default.
