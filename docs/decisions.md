# Decisions

Why the architecture is the way it is, and what was considered and rejected.
Read this before proposing a structural change. When a decision changes, update
its entry and move the old choice to **Rejected** with the reason.

All decisions below were made on 2026-09-30, unless an entry says otherwise.

## Hexagonal architecture on Effect

The domain and the application are platform-agnostic and depend only on
`effect`. Adapters plug into ports, and only the apps choose implementations.
The layering is enforced by Nx tags and `@nx/enforce-module-boundaries`.

- **Why:** the web app, the desktop app and the tests run the same core with
  different implementations.
- **Rejected:** keeping the legacy stack (Angular DI services, rxjs, marblejs):
  two DI systems, untyped errors, no shared core. A layered architecture
  without ports: implementations couldn't differ per deployment.

## Ports are services, implementations are layers

A port is a `Context.Service` declared by an explicit interface, with
`R = never` on its methods. Implementations are separate layers named
`<Port><Impl>`, never statics on the tag.

- **Why:** the browser and the server implement the same port differently, and
  the implementations live in other libs.
- **Rejected:** standalone use-case functions as the port (a function has one
  implementation; with HTTP-backed repositories in the browser, every command
  would run its orchestration twice, and callers would require the
  repositories). Exported accessor functions (extra code to keep in sync). A
  tag with `make` (its shape inferred from its only implementation).

## Queries and commands; one repository per aggregate

Each feature has `<Feature>Queries` (reads) and `<Feature>Commands` (changes
state). Outbound, one `<Feature>Repo` per aggregate, split only when an adapter
can't write.

- **Why:** it's clear where every operation goes, and read-only consumers need
  only the queries.
- **Rejected:** one port per feature; `Lookup`/`Editor` (clashes with UI names
  such as a recipe editor); `Lookup`/`Management` (attracts unrelated
  operations); one port per use case; read/write-split repositories.

## Errors: typed only when actionable

Ports declare only errors the user can act on. Adapters retry where sensible,
then turn infrastructure, transport and decoding failures into defects. HTTP
status codes are set in the contract, not on domain errors.

- **Why:** the local and the remote implementation of a port share one exact
  type. This matches Effect's own guidance. Tested: a status code set in the
  contract takes precedence over one annotated on the domain error.
- **Rejected:** one shared `Unavailable` error on every port method (noise, and
  every adapter must map every failure into it).

## Desktop serves the HTTP API over `overckd://`

The renderer runs the unchanged frontend with the `*Http` implementations. The
main process wires the same API (contract, handlers, local use cases) with its
own repositories and serves it via `protocol.handle` and
`HttpRouter.toWebHandler`.

- **Why:** the contract, handlers and use cases are fully reused; no TCP port,
  no IPC glue. Tested end to end in memory.
- **Rejected:** a localhost TCP port (any local process can call it; port
  management). Effect RPC over IPC (a second contract style). Use cases in the
  renderer with repositories over IPC (logic in the renderer, web and desktop
  wired differently).

## Library layout: three roots, one lib per role

Libraries live under `@overckd` (the core, publishable), `@overckd-app` (the
app's building blocks, never published) and `@ckapp` (generic). Paths equal
import aliases. Inside a root, one folder per feature and one Nx lib per role.
One shared domain lib. HTTP contracts are `api-http` libs. Each lib has one
`type:*` and one `platform:*` tag (`any`, `node`, `browser`: where the code
**can** run). Composition happens only in the apps.

- **Why:** things that change together stay together, and the core and the app
  change for different reasons (capabilities vs. screens). Libs make every
  boundary lint-checkable. `@overckd/domain` can be published under its import
  path.
- **Rejected:** scope-first (`shared/backend/frontend`) and layer-first trees;
  one tree per feature for core and Angular libs; `@overckd-angular` (Electron
  parts will join), `@overckd-ui` (non-UI code, `ui/…/ui`), `@overckd-client`
  (Electron main runs server code), `@overckd/core` + `@overckd/angular`
  (longer aliases; "core" would hold adapters), `@overckd/shared` +
  `@overckd/frontend` (overloaded words); coarser libs (boundaries by convention
  only); a domain lib per feature (the models are tightly linked); a shared
  server composition lib (composition belongs to the apps, and the compiler
  already forces each app to wire every feature); `side:` tags (mixed "can run
  here" with "is used by"; most adapters run anywhere); direction tags (no
  enforceable rules).

## Angular: data-access with derived bindings

Each feature has a `data-access` lib between its pages and its ports
(`feature → data-access → application`). `injectQueries` / `injectCommands`
from `@ckapp/angular-effect` derive the Angular API from a port's type:
queries become `ResourceRef`s with signal arguments, commands become
`Promise`s. NgRx stores for shared client state live in data-access too.

- **Why:** pages depend inwards only and never reach ports or adapters, and
  adding an operation needs no Angular change. Tested in the repo's zoneless
  TestBed.
- **Rejected:** hand-written facade classes (boilerplate, one more step per
  operation); `adapter-angular` tagged `type:adapter` (allowed `feature →
adapter`, losing the inversion); `application-angular` (the same structure,
  Nx's name preferred); pages binding ports directly (they could reach the
  runtime); abstract Angular ports plus an adapter (every port defined twice);
  NgRx as the only mechanism; Observables or plain Promises for queries.

## Entities are `Schema.Class`

Entities are `Schema.Class`, value objects and unions are structs, errors are
`TaggedError`, and behaviour lives in pure module functions.

- **Why:** structural equality and `instanceof` checks (errors and entities
  keep their classes across HTTP; tested), and the existing models already use
  this style.
- **Rejected:** structs everywhere: more functional and no instance handling in
  adapters and tests, but no structural `Equal`/`Hash` or `instanceof`, and the
  existing models would have to be rewritten.

## YAML file codecs in `@overckd/codec-yaml`

The codecs between the YAML files (collections, recipes, tags, ingredients) and
the domain models live in one core lib, `@overckd/codec-yaml`
(`type:contract`). Each codec is a schema from YAML text to domain values, and
`adapter-fs` only does the I/O. Formats private to one adapter (rxdb documents)
stay inside it; app config files belong to the apps.

- **Why:** people edit these files and other tools may read them, so the format
  is a public contract like the HTTP API, and it can be published on its own.
- **Rejected:** codecs inside each feature's `adapter-fs` (not publishable, and
  the format matters beyond the adapter); one codec lib per feature (consumers
  want one package); the names `file-yaml` and `format-yaml` (`codec-yaml` says
  what it is) and `@overckd/yaml` (the legacy lib's name).

## rxdb as the server-side database adapter

rxdb backs `<Feature>RepoRxdb` in `@overckd/<feature>/adapter-rxdb`, as an
alternative to `adapter-fs`, chosen in the composition roots of the backend and
the desktop main process. The adapter is `platform:any` and receives its storage
from the app.

- **Why:** it is already a dependency, and it runs in Node and in the browser.
- **Rejected for now:** dropping rxdb in favour of files plus a later SQL
  adapter; a local-first store in the browser (a different topology; possible
  later without retagging).

## Test helpers in `@overckd/testing`

Helpers that specs of several libs share, such as the `<Feature>Repo`
conformance suites, live in one core lib, `@overckd/testing` (`type:testing`
`platform:any`), with one folder per feature. Adapters may depend on it from
their spec files only; lint rejects the import anywhere else. Made on
2026-10-01.

- **Why:** the helpers import vitest, which must stay out of the libs that
  ship. A lib of its own keeps vitest out of their compile scope, is
  typechecked on its own, and its tag makes the boundary checkable. One lib is
  enough for now; split it per feature when it grows.
- **Rejected:** a `testing` entry point of each application lib
  (`@overckd/<feature>/application/testing`): vitest in the application lib's
  compile scope, and nothing stops production code from importing it.
  `tools/`: no Nx project, so no tags and no boundary checks, and the project
  graph wouldn't see the adapters depending on it. One testing lib per feature:
  more libs than the helpers need today.
