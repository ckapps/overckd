# Add a feature

A feature (e.g. `ingredient`) has a folder in the core,
`libs/@overckd/<feature>/`, and one in the app, `libs/@overckd-app/<feature>/`,
each with one lib per role ([libraries](../architecture/libraries.md)). Create
only the roles you need now; add the others when their first code appears.

## 1. Domain

Add the models, ids, errors and `*Json` codecs to the domain lib (today
`libs/@overckd/domain-experimental`), following
[domain modeling](../architecture/effect.md#domain-modeling), and the payloads
and error types of the feature's queries and commands
([add an operation](add-an-operation.md#1-domain)).

## 2. Generate the libs

Use the Nx generators with a dry run first. The conventions: the directory is
`libs/<import path>`, the project name is the import path without `@` and with
`/` → `-`, and the tags come from the
[roles table](../architecture/libraries.md#roles). Tags are mandatory: a project
without them fails the module-boundary lint rule as soon as it imports another
workspace lib.

Core libs use `@nx/js:library` (the workspace defaults in `nx.json` already
select no bundler, vitest and a `project.json`):

```sh
pnpm nx g @nx/js:library --directory=libs/@overckd/ingredient/application \
  --name=overckd-ingredient-application --importPath=@overckd/ingredient/application \
  --tags=type:application,platform:any --no-interactive --dry-run
```

| Role in `libs/@overckd/<feature>/`                          | `--tags`                        |
| ----------------------------------------------------------- | ------------------------------- |
| `application`                                               | `type:application,platform:any` |
| `api-http`                                                  | `type:contract,platform:any`    |
| `adapter-*` (http-server, http-client, fs, rxdb, memory, …) | `type:adapter,platform:any`     |

An adapter is `platform:any` because Effect's platform services (`FileSystem`,
`HttpClient`, …) are provided by the app. Use `platform:node` only for an adapter
that must import a Node-only package.

App libs use `@nx/angular:library`. For `data-access`, skip the sample component
and module:

```sh
pnpm nx g @nx/angular:library --directory=libs/@overckd-app/ingredient/data-access \
  --name=overckd-app-ingredient-data-access --importPath=@overckd-app/ingredient/data-access \
  --tags=type:data-access,platform:browser --prefix=overckd \
  --standalone=false --skipModule --no-interactive --dry-run
```

| Role in `libs/@overckd-app/<feature>/` | `--tags`                            |
| -------------------------------------- | ----------------------------------- |
| `data-access`                          | `type:data-access,platform:browser` |
| `ui`                                   | `type:ui,platform:browser`          |
| `feature-<name>`                       | `type:feature,platform:browser`     |

A new `data-access` lib starts with one binding per port
([frontend](../architecture/frontend.md#data-access-bindings-and-stores)):

```ts
export const injectIngredientQueries = () => injectQueries(IngredientQueries);
export const injectIngredientCommands = () => injectCommands(IngredientCommands);
```

Check the dry-run output (files under the chosen directory, an `UPDATE` of
`tsconfig.base.json` for the import path), then run the command without
`--dry-run`. Afterwards:

- Replace the placeholder that `@nx/js:library` creates
  (`src/lib/<name>.ts` and its spec) with real code.
- Add a spec with the first code: a lib without spec files fails `nx test`.

## 3. Wire it into the composition roots

| What                                                                                                    | Where (target)                                        | Where (today)                       |
| ------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- | ----------------------------------- |
| add `<Feature>Api` to `OverckdApi`                                                                      | `libs/@overckd/api-http`                              | `libs/backend/overckd/adapter-rest` |
| add the feature's YAML file codec, if it has files                                                      | `libs/@overckd/codec-yaml`                            | `libs/yaml`                         |
| add the `<Feature>Repo` conformance suite                                                               | `libs/@overckd/testing`                               | same                                |
| add `<Feature>HttpController`, `<Feature>QueriesLocal`, `<Feature>CommandsLocal` to the app's `ApiLive` | `apps/backend`, `apps/desktop`                        | `apps/backend/src/app.http.ts`      |
| provide a `<Feature>Repo*`                                                                              | each server-side app (`apps/backend`, `apps/desktop`) | `apps/backend/src/main.ts`          |
| add `<Feature>QueriesHttp`, `<Feature>CommandsHttp` to the runtime layer                                | `apps/frontend/src/app/app.config.ts`                 | n/a yet                             |
| lazy-load the feature's routes                                                                          | `apps/frontend/src/app/app.routes.ts`                 | same                                |

## 4. Verify

```sh
pnpm nx affected -t lint test typecheck
```
