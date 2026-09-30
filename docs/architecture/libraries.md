# Libraries: layout, roles and dependency rules

Where code goes, what it may depend on, and how things are named. The dependency
rules on this page are enforced by `@nx/enforce-module-boundaries` in the root
[`eslint.config.mjs`](../../eslint.config.mjs); keep the two in sync.

## Layout

Libraries live under three roots, and **every path equals its import alias**
(`libs/@overckd/collection/application` is imported as
`@overckd/collection/application`):

| Root                 | Holds                                                                                           | Published                                             |
| -------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| `libs/@overckd/`     | the core: domain, ports and use cases, API contracts, adapters. Effect code that runs anywhere. | may be, e.g. `@overckd/domain`, `@overckd/codec-yaml` |
| `libs/@overckd-app/` | the app's building blocks: Angular data access, UI and pages; Electron-specific parts later     | never                                                 |
| `libs/@ckapp/`       | generic code that isn't about recipes: the Angular UI kit, the Angular–Effect bridge            | may be                                                |

Inside a root the principle is **things that change together stay together**:
one folder per feature, holding every role for that feature, and **one Nx lib
per role**, so that every boundary can be checked by lint. The core and the app
are separate roots because they change for different reasons: the core with
every capability, the app with every screen. Cross-feature libs sit directly
under their root.

```
libs/
├── @overckd/                       the core (Effect)
│   ├── domain/                     all models, ids, errors, pure functions (one lib)
│   ├── api-http/                   OverckdApi: adds every feature's HttpApiGroup
│   ├── codec-yaml/                 YAML files ↔ domain values (collections, recipes, tags, ingredients)
│   └── <feature>/                  collection, recipe, tag, ingredient, …
│       ├── application/            ports + *Local implementations
│       ├── api-http/               <Feature>Api (HttpApiGroup)
│       ├── adapter-http-server/    <Feature>HttpController
│       ├── adapter-http-client/    <Feature>QueriesHttp, <Feature>CommandsHttp
│       ├── adapter-fs/             <Feature>RepoFs (YAML files)
│       ├── adapter-rxdb/           <Feature>RepoRxdb (database)
│       └── adapter-memory/         <Feature>RepoMemory (tests, demos)
├── @overckd-app/                   the app's building blocks, never published
│   ├── ui/                         app-wide presentational components
│   ├── data-access/                stores that belong to no single feature (when needed)
│   ├── <feature>/
│   │   ├── data-access/            inject<Feature>Queries(), inject<Feature>Commands(), stores
│   │   ├── ui/                     presentational Angular components
│   │   └── feature-<name>/         routed pages
│   └── desktop/                    Electron-specific libs, once code outgrows apps/desktop
└── @ckapp/                         generic, not about recipes
    ├── angular/                    UI kit
    ├── angular-desktop/            desktop window chrome for Angular
    └── angular-effect/             provideEffectRuntime, injectQueries, injectCommands
apps/
├── backend/                        Node server             (composition root)
├── frontend/                       Angular app, also the desktop renderer (composition root)
└── desktop/                        Electron main process   (composition root)
```

Create a role lib when the first code for that role appears; a feature does not
need every role. The domain is deliberately a single lib because the models are
tightly linked (a recipe references ingredients, which reference tags, …).

> **Status:** this is the target. Most libs still live elsewhere; see
> [Current to target mapping](#current-to-target-mapping).

## Roles

| Lib                                            | Tags                                                                                       | Contains                                                                                                                                                          | Must not contain                                                                                  |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `@overckd/domain`                              | `type:domain` `platform:any`                                                               | Schema models, branded ids, `TaggedError`s, command inputs, pure functions, canonical `*Json` codecs                                                              | services, effectful workflows, HTTP status codes, storage formats, framework code                 |
| `@overckd/api-http`                            | `type:contract` `platform:any`                                                             | `OverckdApi`, the root `HttpApi`                                                                                                                                  | anything else                                                                                     |
| `@overckd/codec-yaml`                          | `type:contract` `platform:any`                                                             | codecs between the YAML files (collections, recipes, tags, ingredients) and the domain models, including YAML parsing                                             | file I/O and paths, app config formats                                                            |
| `@overckd/<feature>/application`               | `type:application` `platform:any`                                                          | inbound ports `<Feature>Queries` / `<Feature>Commands`, outbound port `<Feature>Repo`, `*Local` implementations                                                   | schemas that cross the wire (→ domain), transport or storage code, providing its own dependencies |
| `@overckd/<feature>/api-http`                  | `type:contract` `platform:any`                                                             | the feature's `HttpApiGroup` (`<Feature>Api`) incl. status codes and OpenAPI annotations                                                                          | handler or client code                                                                            |
| `@overckd/<feature>/adapter-http-server`       | `type:adapter` `platform:any`                                                              | `<Feature>HttpController`: each endpoint calls one port method                                                                                                    | business logic, error remapping                                                                   |
| `@overckd/<feature>/adapter-http-client`       | `type:adapter` `platform:any`                                                              | `*Http` implementations of the inbound ports (via `HttpApiClient`)                                                                                                | base URLs or other config, business logic                                                         |
| `@overckd/<feature>/adapter-<tech>`            | `type:adapter` `platform:any` (`platform:node` only if it must import a Node-only package) | `<Feature>Repo<Tech>` implementations, their private format codecs (e.g. rxdb documents) and error mapping; YAML files via `@overckd/codec-yaml`                  | business logic                                                                                    |
| `@overckd-app/<feature>/data-access`           | `type:data-access` `platform:browser`                                                      | the Angular access to the ports: `inject<Port>()` bindings derived from them (queries → `ResourceRef`, commands → `Promise`), NgRx stores for shared client state | business logic, choosing implementations, components                                              |
| `@overckd-app/<feature>/ui`, `@overckd-app/ui` | `type:ui` `platform:browser`                                                               | presentational components (inputs/outputs, domain types)                                                                                                          | data-access, services, running effects                                                            |
| `@overckd-app/<feature>/feature-<name>`        | `type:feature` `platform:browser`                                                          | routed pages and smart components that use `data-access` and ui                                                                                                   | running effects                                                                                   |
| `@ckapp/angular-effect`                        | `type:util` `platform:browser`                                                             | `provideEffectRuntime`, `injectQueries`, `injectCommands`                                                                                                         | anything overckd-specific                                                                         |
| `apps/*`                                       | `type:app` + platform                                                                      | composition roots: choose adapters, provide the platform, run                                                                                                     | reusable code                                                                                     |

The `api-http` libs hold the HTTP contract; the name leaves room for contracts
over other transports. `codec-yaml` is a contract too: people edit these files
and other tools may read them, so the format lives in its own publishable lib
rather than inside `adapter-fs`. Tags exist for two more cases: `type:util` for small,
pure helpers (e.g. `libs/core`) and `type:legacy` for pre-architecture code
(see [legacy code](../guides/work-with-legacy-code.md)). Electron-specific libs
under `@overckd-app/desktop/` are tagged by their role like any other lib, with
`platform:node` for main-process code.

## Dependency rules

Each project has exactly one `type:*` tag and one `platform:*` tag, and both must
allow an import. The rules follow roles, not folders.

| `type:`         | may depend on                          |
| --------------- | -------------------------------------- |
| `domain`        | domain, util                           |
| `application`   | application, domain, util              |
| `contract`      | contract, domain, util                 |
| `adapter`       | application, contract, domain, util    |
| `data-access`   | data-access, application, domain, util |
| `ui`            | ui, domain, util                       |
| `feature`       | feature, data-access, ui, domain, util |
| `util`          | util                                   |
| `app`, `legacy` | anything                               |

Pages depend inwards only: a feature lib reaches a port through its
`data-access` lib, never through the application lib or an adapter. Data-access
libs may depend on each other, so stores can build on other features' data
access.

| `platform:` | may depend on | meaning                                                                      |
| ----------- | ------------- | ---------------------------------------------------------------------------- |
| `any`       | any           | plain TypeScript and `effect`; runs in Node, the browser, Electron and tests |
| `node`      | node, any     | needs Node APIs or Node-only packages: the backend, the desktop main process |
| `browser`   | browser, any  | needs a browser runtime: Angular code, the web app and the desktop renderer  |

The platform tag says where code **can** run, not where it **does**. Most libs are
`platform:any`, including the HTTP handlers and the file and rxdb adapters: they
use Effect's platform services (`FileSystem`, `Path`, `HttpClient`), and the app
provides the implementation. Which app uses which adapter is decided in the
composition roots, and Effect's types enforce it there: a root that provides
`CollectionRepoFs` but no `FileSystem` does not compile.

Nx cannot ban Node built-ins (`node:fs`, `path`, …), so `platform:any` code must
not import them; use the Effect services instead.

Banned npm imports (checked against the raw import specifier):

| Tag                                     | Banned                                                                                                                                     |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| every `type:` except `app` and `legacy` | `fp-ts*`, `io-ts*`, `@marblejs/*`                                                                                                          |
| `type:domain`, `type:application`       | additionally `effect/http*`, `effect/rpc*`, `effect/sql*`, `@effect/platform*`, `@effect/sql*`, `rxjs*`, `rxdb*`, `@angular/*`, `electron` |
| `type:contract`                         | additionally `@angular/*`, `rxjs*`, `rxdb*`, `electron`                                                                                    |
| `platform:any`                          | `@angular/*`, `electron`, `@effect/platform*`                                                                                              |
| `platform:node`                         | `@angular/*`, `@effect/platform-browser*`                                                                                                  |
| `platform:browser`                      | `electron`, `@effect/platform-node*`                                                                                                       |

When an import is rejected, move the code to the right lib rather than loosening
the rules. If a rule itself is wrong, change it in `eslint.config.mjs`, on this
page and in [decisions](../decisions.md) together.

Check with `pnpm nx affected -t lint` (or `pnpm nx run <project>:lint`).

## Naming

| What                      | Convention                                                    | Example                                                                               |
| ------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Lib path and import alias | identical: `libs/<alias>`                                     | `libs/@overckd/collection/application` ↔ `@overckd/collection/application`           |
| Nx project                | the alias without `@`, `/` → `-`                              | `overckd-collection-application`, `overckd-app-collection-ui`, `ckapp-angular-effect` |
| Inbound ports             | `<Feature>Queries` (reads), `<Feature>Commands` (changes)     | `CollectionQueries`                                                                   |
| Outbound port             | `<Feature>Repo`, one per aggregate                            | `CollectionRepo`                                                                      |
| Implementation            | `<Port><Impl>`; a function if it takes parameters             | `CollectionQueriesLocal`, `CollectionQueriesHttp`, `CollectionRepoFs({ file })`       |
| HTTP controller           | `<Feature>HttpController`                                     | `CollectionHttpController`                                                            |
| HTTP API group            | `<Feature>Api`; group id = feature name; prefix = plural path | `HttpApiGroup.make('collection')…prefix('/collections')`                              |
| Angular binding           | `inject<Port>()`                                              | `injectCollectionQueries()`                                                           |
| Service key               | `'@overckd/<feature>/<role>/<Name>'`                          | `'@overckd/collection/application/CollectionQueries'`                                 |
| Span name                 | `'<Port>.<method>'`                                           | `'CollectionQueries.findById'`                                                        |
| Error                     | `<Entity><Problem>`                                           | `CollectionNotFound`                                                                  |
| Create payload            | `<Entity>Draft`                                               | `CollectionDraft`                                                                     |
| Domain function           | `<verb><Entity>`                                              | `renameCollection`                                                                    |

File names inside a lib: port `collection-queries.ts`, implementations
`collection-queries.local.ts` / `collection-queries.http.ts`, repository
implementations `collection-repo.fs.ts`, HTTP API group `collection.api.ts`,
HTTP controller `collection.controller.ts`, Angular bindings `collection.bindings.ts`.
Tests sit next to the file as `*.spec.ts`. Every lib exports its public API from
`src/index.ts` only.

## Current to target mapping

All projects are tagged today; the paths and import aliases (`@_shared/…`,
`@_backend/…`) still follow the old layout.

| Project                                                                                 | Path today                          | Tags                              | Target                                                                                                                           |
| --------------------------------------------------------------------------------------- | ----------------------------------- | --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `overckd-domain-experimental`                                                           | `libs/@overckd/domain-experimental` | `type:domain` `platform:any`      | `libs/@overckd/domain` (`@overckd/domain`), once the legacy `libs/domain` is gone                                                |
| `backend-overckd-adapter-rest`                                                          | `libs/backend/overckd/adapter-rest` | `type:contract` `platform:any`    | `libs/@overckd/api-http`                                                                                                         |
| `backend-collection-adapter-rest`, `backend-recipe-adapter-rest`                        | `libs/backend/<f>/adapter-rest`     | `type:contract` `platform:any`    | `libs/@overckd/<f>/api-http`                                                                                                     |
| `backend-collection-infra-http`, `backend-recipe-infra-http`                            | `libs/backend/<f>/infra-http`       | `type:adapter` `platform:any`     | `libs/@overckd/<f>/adapter-http-server`                                                                                          |
| `collection-application`, `recipe-application`, `tag-application`                       | `libs/shared/<f>/application`       | `type:application` `platform:any` | `libs/@overckd/<f>/application`, with `*UseCase` split into Queries/Commands ports + `*Local`                                    |
| `collection-infra-rxdb`, `recipe-infra-rxdb`, `tag-infra-rxdb`, `ingredient-infra-rxdb` | `libs/shared/<f>/infra-rxdb`        | `type:legacy` `platform:any`      | `libs/@overckd/<f>/adapter-rxdb`, on the new domain                                                                              |
| `collection-ui`                                                                         | `libs/shared/collection/ui`         | `type:legacy` `platform:browser`  | `libs/@overckd-app/collection/ui`, on the new domain                                                                             |
| `ui`                                                                                    | `libs/shared/ui`                    | `type:ui` `platform:browser`      | `libs/@overckd-app/ui`                                                                                                           |
| `ckapp-angular`, `ckapp-angular-desktop`                                                | `libs/@ckapp/*`                     | `type:ui` `platform:browser`      | unchanged                                                                                                                        |
| `core`                                                                                  | `libs/core`                         | `type:util` `platform:any`        | delete with the legacy code that uses it (or move to `@ckapp`)                                                                   |
| `domain`                                                                                | `libs/domain`                       | `type:legacy` `platform:any`      | delete; replaced by the new domain                                                                                               |
| `yaml`                                                                                  | `libs/yaml`                         | `type:legacy` `platform:any`      | its domain file codecs move to `libs/@overckd/codec-yaml` (Effect Schema); its app config codecs move to the apps that read them |
| `domain-rx`, `server`                                                                   | `libs/domain-rx`, `libs/server`     | `type:legacy` `platform:node`     | delete                                                                                                                           |
| `backend`                                                                               | `apps/backend`                      | `type:app` `platform:node`        | wires handlers, `*Local` implementations and repositories (today in `src/app.http.ts`)                                           |
| `frontend`                                                                              | `apps/frontend`                     | `type:app` `platform:browser`     | data-access bindings + `provideEffectRuntime`                                                                                    |
| `desktop`                                                                               | `apps/desktop`                      | `type:app` `platform:node`        | wires the same API and serves it over `overckd://`                                                                               |
| `server-cli`                                                                            | `apps/server-cli`                   | `type:app` `platform:node`        | delete                                                                                                                           |

Libs that still use legacy types are tagged `type:legacy` until migrated; switch
the tag to the real role in the same change that removes the legacy imports.
The order of the migration is in [working with legacy code](../guides/work-with-legacy-code.md).
