# Add a setting

Settings make an app configurable without code changes: a port, the API
version, which repositories to use, where images come from. The running
example is the backend; the concepts and the complete code are in
[configuration](../architecture/configuration.md).

> **Status:** target. Today the backend has one section, `server`; no setting
> chooses an implementation yet, and no adapter gets its settings from the
> config.

## 0. Decide what kind of setting it is

| The setting…                                      | Do                                                                                     |
| ------------------------------------------------- | -------------------------------------------------------------------------------------- |
| is a value in an existing section (`server.port`) | [1. Add a key](#1-add-a-key)                                                           |
| belongs to no section yet                         | [2. Add a section](#2-add-a-section)                                                   |
| chooses between implementations                   | [3. Let a setting choose an implementation](#3-let-a-setting-choose-an-implementation) |
| is what an adapter needs to know (a directory)    | [4. Give an adapter its settings](#4-give-an-adapter-its-settings)                     |
| is changed per run                                | additionally [5. Add a flag](#5-add-a-flag)                                            |

Settings are read in the apps only. If a library needs one, it declares a
service and the app provides it (4.).

## 1. Add a key

Add the key to the section's schema, with a default, and read it where it is
needed:

```ts
// apps/backend/src/server/server.config.ts
const ServerConfigSchema = Schema.Struct({
  port: Schema.Int.pipe(Schema.withDecodingDefaultKey(Effect.succeed(3000))),
  // …
});
```

```ts
const { port } = yield * ServerConfig;
```

- The default keeps every existing config file valid. Change a config file
  only when it should differ from the default.
- A path is resolved in the section with `ConfigFile.resolve`, so consumers
  get an absolute path.
- The key's environment variable comes for free:
  `OVERCKD_<SECTION>_<KEY>` in CONSTANT_CASE.

## 2. Add a section

A new top-level key of the config file:

1. Create the folder `apps/<app>/src/<section>/` with `<section>.config.ts`:
   the schema and the service `<Section>Config` and its `static layer`, as
   `ServerConfig` does
   ([sections](../architecture/configuration.md#sections)). Give the section
   a default as a whole with `Config.withDefault`.
2. Add `<Section>Config.layer` where the app provides its sections (next to
   `ServerConfig.layer` in `cli.ts`), before `ConfigLive`. The compiler reports
   a missing section: whatever reads it doesn't get its requirement. Layers
   built from the section go into `<section>.ts` next to it.
3. Test the section ([testing](../architecture/configuration.md#testing)):
   the defaults, a value from the file, an invalid value.

## 3. Let a setting choose an implementation

The section is a union on `type`, one member per implementation
([choosing an implementation](../architecture/configuration.md#choosing-an-implementation)).
To add an implementation, e.g. `database` repositories:

1. Add a member to the union, with the settings only it needs:
   `Schema.Struct({ type: Schema.Literal('database'), url: Schema.String })`.
   Keep the section's default on a member that needs no settings.
2. Add the case to the `Layer.unwrap` that picks the layers
   (`RepositoriesLive`). The match is exhaustive, so the app doesn't compile
   until every choice handles the new member.
3. Provide the new implementations there, with their settings
   ([4.](#4-give-an-adapter-its-settings)). Every feature needs its
   repository for every type: `RecipeRepo` and `CollectionRepo` for
   `database` too.
4. Test that the member decodes and that a missing setting is rejected.

## 4. Give an adapter its settings

An adapter never reads `Config`. It declares what it needs as a service in
its own lib, named `<Implementation>Config`:

```ts
// libs/@overckd/recipe/adapter-fs/src/lib/recipe-repo.fs.ts
export class RecipeRepoFsConfig extends Context.Service<RecipeRepoFsConfig, { readonly dir: string }>()('@overckd/recipe/adapter-fs/RecipeRepoFsConfig') {}
```

The adapter reads it with `yield* RecipeRepoFsConfig` when its layer is
built, and its tests provide it with `Layer.succeed`. The app provides it from
a section or from `AppDirectory`
([adapter settings](../architecture/configuration.md#adapter-settings)).

A new kind of file in the app directory (tags, ingredients) gets its path in
`AppDirectory`, the only place that knows the directory's layout. The adapter
still takes the path through its own `<Implementation>Config`.

## 5. Add a flag

Only for settings people change per run. In `apps/<app>/src/cli.ts`:

1. Declare the flag with `Flag.optional`, without a default and without
   `withFallbackConfig`: the default lives in the section, the environment
   comes from `ConfigLive`.
2. Name it after its key in kebab-case (`apiVersion` → `--api-version`).
3. Hand its value to `ConfigLive` under the key path:
   `flags: { server: { apiVersion: Option.getOrUndefined(apiVersion) } }`.
   A path flag resolves its value against the working directory first.

## 6. Verify

```sh
pnpm nx affected -t lint test typecheck
```

Then start the app with a config file that sets the new key, once more with
its environment variable, and check that the variable wins.
