# overckd architecture

overckd manages recipes in a web app and in a desktop app. Both run the same
core: a hexagonal (ports & adapters) architecture built on
[Effect](https://effect.website) v4. These docs describe that architecture, the
rules that keep it intact, and step-by-step guides for common changes. They are
written for people and AI agents alike.

> **Target vs. current.** The docs describe the target architecture. Parts of
> the code predate it; [libraries](architecture/libraries.md#current-to-target-mapping)
> maps every project to its target place,
> and [legacy code](guides/work-with-legacy-code.md) explains how to treat the
> rest. New code follows the docs. Pages that describe code which doesn't exist
> yet say so in a **Status** note, together with what the code does today.

## I want to…

| …                                                            | Read                                                                                                      |
| ------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| know where code goes and what may import what                | [architecture/libraries.md](architecture/libraries.md)                                                    |
| understand ports, adapters and composition (worked example)  | [architecture/ports-and-adapters.md](architecture/ports-and-adapters.md)                                  |
| add a query or a command                                     | [guides/add-an-operation.md](guides/add-an-operation.md)                                                  |
| add a feature (e.g. ingredients)                             | [guides/add-a-feature.md](guides/add-a-feature.md)                                                        |
| add a storage adapter (files, rxdb, …)                       | [architecture/ports-and-adapters.md](architecture/ports-and-adapters.md#6-outbound-adapters-repositories) |
| change legacy code                                           | [guides/work-with-legacy-code.md](guides/work-with-legacy-code.md)                                        |
| write Effect code                                            | [architecture/effect.md](architecture/effect.md)                                                          |
| build Angular UI                                             | [architecture/frontend.md](architecture/frontend.md)                                                      |
| work on the Electron app                                     | [architecture/desktop.md](architecture/desktop.md)                                                        |
| write tests                                                  | [architecture/testing.md](architecture/testing.md)                                                        |
| know why something is built this way, or propose changing it | [decisions.md](decisions.md)                                                                              |

## Pillars

1. **Hexagonal.** The domain and the application know nothing about HTTP,
   Angular, Electron, files or databases. Those live in adapters that plug into
   ports.
2. **Effect.** Ports are Effect services, implementations are Layers, data is
   described with Effect Schema, and expected errors are typed.
3. **Functional.** Data is immutable, domain logic is pure functions, and
   effects run only at the edges (composition roots).
4. **One core, many deployments.** The web backend, the browser app, the
   desktop app and the tests compose the same libraries differently. Choosing an
   implementation is a one-line change in a composition root.

## The hexagon

Dependencies point inwards. The core (domain and application) depends on
nothing but `effect`.

```
apps (composition roots)       backend · frontend · desktop
      │ choose and wire implementations
      ▼
adapters                       HTTP handlers · HTTP client · fs · rxdb · memory · Angular UI (pages → data-access)
      │ implement or call ports
      ▼
application                    ports: CollectionQueries · CollectionCommands · CollectionRepo
                               use cases: CollectionQueriesLocal · CollectionCommandsLocal
      │ use
      ▼
domain                         models · ids · errors · pure functions · *Json codecs

contracts                      HTTP API (api-http) · YAML files (codec-yaml); depend on domain only
```

In the repository, the core (domain, ports and use cases, contracts, adapters)
lives in `libs/@overckd`, the app's Angular building blocks in
`libs/@overckd-app`, and generic helpers in `libs/@ckapp`; see
[libraries](architecture/libraries.md).

The key idea: **one port, several implementations**. The frontend and the
backend use the same inbound port and the same domain objects; only the
implementation differs.

```
                           CollectionQueries                (port, application lib)
                          ▲                 ▲
          implemented by  │                 │  implemented by
                          │                 │
      CollectionQueriesLocal               CollectionQueriesHttp
      server side: the use cases,          browser side: calls the server through
      uses the CollectionRepo port         the HttpApi contract
            │
            ▼
      CollectionRepoFs · CollectionRepoRxdb · CollectionRepoMemory
```

## How the deployments run

```
Web
  browser   page ─▶ data-access ─▶ CollectionQueriesHttp ── fetch /api/collections ──┐
  backend   NodeHttpServer ─▶ CollectionHttpController ─▶ CollectionQueriesLocal ◀───┘
                                                           └─▶ CollectionRepoRxdb

Desktop (one Electron app, no TCP port)
  renderer  page ─▶ data-access ─▶ CollectionQueriesHttp ── fetch overckd://app/api/collections ──┐
  main      protocol.handle('overckd') ─▶ CollectionHttpController ─▶ CollectionQueriesLocal ◀────┘
                                                                       └─▶ CollectionRepoFs

Tests
  any port with Layer.mock or CollectionRepoMemory; no network, no files
```

The renderer runs the unchanged web frontend; only its base URL differs. The
desktop main process serves the same API as the backend, with different
repositories. Details: [desktop](architecture/desktop.md),
[frontend](architecture/frontend.md).

## Glossary

| Term                      | Meaning                                                                                                                                                                                                                                                           |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Domain**                | Models (Effect Schema), branded ids, payloads, errors and pure functions in `libs/@overckd/domain`. No services, no effects.                                                                                                                                      |
| **Port**                  | A `Context.Service` tag with an explicit interface. **Inbound** ports (`<Feature>Queries`, `<Feature>Commands`) are what the outside world calls; **outbound** ports (`<Feature>Repo`) are what the application needs from the outside.                           |
| **Payload**               | The input of a `<Feature>Queries` or `<Feature>Commands` method: one `Schema.Struct` in the domain, named `<Feature><Method>Payload`. Not to be confused with `payload` in `HttpApi`, the request body.                                                           |
| **Implementation**        | A `Layer` that provides a port, named `<Port><Impl>`.                                                                                                                                                                                                             |
| **Local implementation**  | `*Local`: the use cases, built on outbound ports. Runs wherever its repositories can run; today in the backend and the desktop main process.                                                                                                                      |
| **Remote implementation** | `*Http`: the same inbound port, implemented by calling the server.                                                                                                                                                                                                |
| **Adapter**               | Connects a port to a technology. Driving adapters call ports (HTTP handlers, the Angular UI through data-access); driven adapters implement them (repositories, the HTTP client).                                                                                 |
| **Contract**              | A shared, public format: the HTTP API (`api-http`, used by the handlers and the client) and the YAML files (`codec-yaml`).                                                                                                                                        |
| **Composition root**      | An app: the only place that chooses implementations. Effects run only in the apps, the Angular bridge (`libs/@ckapp/angular-effect`) and tests.                                                                                                                   |
| **Data access**           | The Angular side of the ports (`libs/@overckd-app/<feature>/data-access`): `inject<Port>()` bindings derived from the ports (queries → resources, commands → promises) and NgRx stores for shared client state. Nx's name for this library type; not persistence. |
| **Legacy**                | Pre-architecture code (fp-ts, io-ts, rxjs, marblejs), tagged `type:legacy`. Frozen.                                                                                                                                                                               |

## Enforced rules

Every Nx project carries one `type:*` tag (its role) and one `platform:*` tag
(which runtime can execute it). `@nx/enforce-module-boundaries` in the root
[`eslint.config.mjs`](../eslint.config.mjs) checks every import against them and
bans technology imports where they don't belong (e.g. `effect/http-api` in the
application layer). Check with:

```sh
pnpm nx affected -t lint
```

## Code examples

The examples in these docs were typechecked against the installed versions
(Effect `4.0.0-rc.118`, Angular 21, Electron 35), and the tests shown in
[testing](architecture/testing.md) were run. For Effect APIs beyond these docs,
use `node_modules/effect/CLAUDE.md` and `node_modules/effect/ai-docs/src/`,
which match the installed version.
