# Effect conventions

How Effect code is written in this repo. The general patterns are in
[ports and adapters](ports-and-adapters.md); this page covers the rules.

## Which Effect

The workspace uses **Effect `4.0.0-rc.118`** (`effect`, `@effect/platform-node`,
`@effect/platform-browser`). Version 4 differs substantially from version 3,
and most examples on the web are version 3. Look things up here, in this order:

1. `node_modules/effect/CLAUDE.md`: the official guide for this version.
2. `node_modules/effect/ai-docs/src/**`: runnable examples (HttpApi, testing,
   services, schema, ManagedRuntime, …).
3. The `.d.ts` files in `node_modules/effect/dist/`.

Common version 3 names that **do not exist** here:

| Version 3                                             | Here (version 4)                    |
| ----------------------------------------------------- | ----------------------------------- |
| `Context.Tag`, `Context.GenericTag`, `Effect.Service` | `Context.Service`                   |
| `Either`                                              | `Result`                            |
| `Effect.catchAll`, `Effect.catchAllCause`             | `Effect.catch`, `Effect.catchCause` |
| `Schema.decodeUnknown` (returning an Effect)          | `Schema.decodeUnknownEffect`        |
| `@effect/platform` (`HttpApi`, `HttpClient`, …)       | `effect/http-api`, `effect/http`    |
| `@effect/cli`                                         | `effect/cli`                        |

## Imports

```ts
import { Context, Effect, Layer, Option, Schema } from 'effect';
import { HttpApiBuilder } from 'effect/http-api'; // unstable modules: subpaths
import { HttpClient } from 'effect/http';
```

- Core modules come from the `effect` barrel; unstable modules from their
  subpath (`effect/http`, `effect/http-api`, `effect/cli`, `effect/rpc`,
  `effect/sql`).
- Platform packages (`@effect/platform-node`, `@effect/platform-browser`) are
  imported only by apps. Libraries use the abstract services (`FileSystem`,
  `Path`, `HttpClient`) and let the app provide the platform.

## Services and layers

- Ports and other services: `Context.Service<Self, Interface>()(key)` with an
  explicit interface. Method requirements are `never`.
- Service keys: `'@overckd/<feature>/<role>/<Name>'`.
- **Ports never carry implementations** (no `make`, no `static layer`), because
  their implementations live in other libs. Effect's own examples attach layers
  as statics (`Users.layer`, `Users.layerMemory`); that is fine for internal
  services with a single implementation, but not for ports.
- Implementations are `Layer.effect(Port, Effect.gen(…))` returning
  `Port.of({ … })`, named `<Port><Impl>`. A layer that takes data is a
  function returning a layer: `CollectionRepoMemory(seed)`. Settings come from
  a service instead: `CollectionRepoFs` reads `CollectionRepoFsConfig`
  ([configuration](configuration.md#adapter-settings)).
- Implementations **never provide their own dependencies**. Wiring
  (`Layer.provide`) happens only in composition roots.
- Access a service with `yield* Port` inside `Effect.gen`, or with
  `Port.use(port => …)` for a one-off call.

## Writing effects

Follow the official guidance:

- `Effect.gen(function* () { … })` for inline sequential code.
- `Effect.fn('Name')(function* (…) { … })` for named, reusable effectful
  functions; the name becomes the span. Pass extra combinators as further
  arguments instead of `.pipe` on `Effect.fn`. Use `Effect.fnUntraced` on hot
  paths.
- `pipe` / `.pipe(…)` for short linear transformations.
- Fail with `return yield* new SomeError({ … })`, so TypeScript knows the code
  stops there.
- Don't write functions that only wrap `Effect.gen`.

## Domain modeling

All data that crosses a port or the wire is described with Schema in
`libs/@overckd/domain`:

| Kind         | Schema                                                                     | Example                                   |
| ------------ | -------------------------------------------------------------------------- | ----------------------------------------- |
| Entity       | `Schema.Class`                                                             | `Collection`, `Tag`, `RecipeRef`          |
| Value object | `Schema.Struct` / `Schema.TaggedStruct`                                    | `UnitIngredientAmount`, `PreparationStep` |
| Union        | `Schema.Union` of tagged members                                           | `IngredientAmount`, `RecipePreparation`   |
| Identifier   | branded string: `Schema.NonEmptyString.pipe(Schema.brand('@overckd/XId'))` | `CollectionId`                            |
| Error        | `Schema.TaggedError`                                                       | `CollectionNotFound`                      |
| Payload      | `Schema.Struct` named `<Feature><Method>Payload`                           | `CollectionFindByIdPayload`               |
| Wire format  | `*Json` codec that decodes to the model                                    | `CollectionJson`                          |

The input of a `<Feature>Queries` or `<Feature>Commands` method is one payload,
and the errors it declares have a type, `<Feature><Method>Error`
(`CollectionFindByIdError = CollectionNotFound`)
([decisions](../decisions.md#payloads-and-error-types-in-the-domain)).

- Build entities with `X.make({ … })`. It validates and **throws** on invalid
  input (a defect), so validate untrusted input at the edge with a schema
  (contract params and bodies, form input) before it reaches a port.
- `Schema.Class` encoders need real class instances. Adapters and tests
  therefore construct entities with `X.make`, and `*Json` codecs decode to the
  type side (`Schema.decodeTo(Schema.toType(X))`) so nested encoders receive
  instances. Decoded entities are class instances, also after an HTTP round
  trip.
- Canonical `*Json` codecs live in the domain, the YAML file codecs in
  `@overckd/codec-yaml`. Formats private to one adapter (rxdb documents) stay
  inside that adapter.
- Behaviour lives in **pure functions** next to the model, named
  `<verb><Entity>`, data-first and data-last via `Function.dual`:

```ts
export const renameCollection: {
  (name: string): (self: Collection) => Collection;
  (self: Collection, name: string): Collection;
} = Fn.dual(2, (self: Collection, name: string): Collection => Collection.make({ ...self, name }));
```

- Domain functions return plain values, `Option` or `Result`; they don't
  return `Effect`, don't read the clock and don't use services.
- Use the `Option`, `Result`, `Array`, `Match`, `Predicate` and `DateTime`
  modules. Don't hand-write type guards (`isString`, …) or use `Date.now()`.

## Errors

**A port declares an error only if the user can act on it.** Everything else is
a defect.

| Failure                             | Where it goes                 | Example                                                                                 |
| ----------------------------------- | ----------------------------- | --------------------------------------------------------------------------------------- |
| Domain / user-actionable            | typed error on the port       | `CollectionNotFound`, `CollectionAlreadyExists`, an invalid recipe file the user edited |
| Infrastructure, transport, decoding | defect, raised by the adapter | network down, 500, disk I/O error, corrupt database                                     |
| Programming error                   | defect                        | invariant broken, `X.make` with invalid data                                            |

- The local and the remote implementation of a port share one exact type, so
  transport errors must not appear in port signatures.
- Adapters retry where it makes sense (idempotent reads), then convert:
  `Effect.orDie` when the method declares no errors, or
  `Effect.catchTag(['HttpClientError', 'SchemaError'], Effect.die)` /
  `Effect.catchTags({ … })` to keep the declared ones.
- HTTP status codes are set in the contract with `HttpApiSchema.status(…)`,
  never on the domain error.
- Handlers and data-access bindings don't remap errors. Components match typed errors
  (`error instanceof CollectionNotFound`) and leave defects to the global error
  handler.
- If users need to be told that a file is broken, that is actionable: declare a
  typed error on the port and map to it in the adapter, instead of dying.

## Running effects

Effects are run only by composition roots:

- apps: `NodeRuntime.runMain`, `Layer.launch`, `HttpRouter.serve`,
  `HttpRouter.toWebHandler`;
- the Angular bridge in `libs/@ckapp/angular-effect` (`injectQueries`, `injectCommands`);
- tests.

Libraries never call `Effect.runPromise` / `Effect.runSync`.

## Configuration

Configuration (`Config.*`, environment, CLI flags, Angular `environment.ts`) is
read in apps only. A server-side app reads flags, environment and its config
file through one `ConfigProvider` and hands the settings out as one service
per section (`ServerConfig`). Libraries declare what they need as a service of
their own (`CollectionRepoFsConfig`), which the app provides. See
[configuration](configuration.md).

## Observability

- Every port method has a span named `'<Port>.<method>'`: `Effect.fn` adds it,
  pass-through members use `Effect.withSpan`.
- Log with `Effect.log*` (structured, with annotations), never `console.log`.
