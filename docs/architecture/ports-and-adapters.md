# Ports and adapters

The patterns every feature follows, shown on the `collection` feature. All code
on this page is typechecked against the installed Effect version, and all of it
except the file-system adapter sketch also ran in tests; treat it as the template when you
add code.

> **Status:** the collection ports, `CollectionQueriesLocal`, the contract and
> the handlers follow this page. `CollectionCommands` and the repository
> adapters (§6) don't exist yet; see the [migration plan](../migration.md).

## 1. Ports

A port is a `Context.Service` tag **declared by an explicit interface**. The
interface is the contract; implementations live elsewhere (usually in other
libs), so the tag never gets a `make` or a `static layer`.

The input of an inbound port method is one payload, and its errors have a type;
both live in the domain lib, next to the models:

```ts
// libs/@overckd/domain/src/lib/internal/collection.model.ts
export type CollectionFindByIdPayload = typeof CollectionFindByIdPayload.Type;
export const CollectionFindByIdPayload = Schema.Struct({ id: CollectionId });
export type CollectionFindByIdError = CollectionNotFound;

export type CollectionRenamePayload = typeof CollectionRenamePayload.Type;
export const CollectionRenamePayload = Schema.Struct({ id: CollectionId, name: Schema.NonEmptyString });
export type CollectionRenameError = CollectionNotFound;
```

```ts
// libs/@overckd/collection/application/src/lib/collection-queries.ts
import { Collection, CollectionFindByIdError, CollectionFindByIdPayload } from '@overckd/domain';
import { Context, Effect } from 'effect';

/** Inbound port: everything that reads collections. */
export class CollectionQueries extends Context.Service<
  CollectionQueries,
  {
    readonly getAll: Effect.Effect<ReadonlyArray<Collection>>;
    readonly findById: (payload: CollectionFindByIdPayload) => Effect.Effect<Collection, CollectionFindByIdError>;
  }
>()('@overckd/collection/application/CollectionQueries') {}
```

```ts
// libs/@overckd/collection/application/src/lib/collection-commands.ts
/** Inbound port: everything that changes collections. */
export class CollectionCommands extends Context.Service<
  CollectionCommands,
  {
    readonly rename: (payload: CollectionRenamePayload) => Effect.Effect<Collection, CollectionRenameError>;
  }
>()('@overckd/collection/application/CollectionCommands') {}
```

```ts
// libs/@overckd/collection/application/src/lib/collection-repo.ts
/** Outbound port: where collections are stored. One repo per aggregate. */
export class CollectionRepo extends Context.Service<
  CollectionRepo,
  {
    readonly getAll: Effect.Effect<ReadonlyArray<Collection>>;
    readonly findById: (id: CollectionId) => Effect.Effect<Collection, CollectionNotFound>;
    readonly save: (collection: Collection) => Effect.Effect<void>;
  }
>()('@overckd/collection/application/CollectionRepo') {}
```

Rules for ports:

- **Inbound ports come in pairs**: `<Feature>Queries` for anything that only
  reads, `<Feature>Commands` for anything that changes state. If an operation
  changes state, it is a command, even if it also returns data.
- **Outbound ports**: one `<Feature>Repo` per aggregate with read and write
  methods. Split it only when a real adapter cannot write (e.g. a read-only
  catalog).
- **Methods require nothing** (`R = never`). Dependencies are resolved when the
  implementation is built, so callers only ever depend on the port.
- **Only domain types** in signatures, and **only user-actionable errors** in
  the error channel (see [errors](effect.md#errors)). The same port type must fit
  the local and the remote implementation.
- **One payload, named errors**: an inbound port method that takes input takes
  one `<Feature><Method>Payload`, a `Schema.Struct` in the domain lib; one that
  declares errors fails with `<Feature><Method>Error`, a type in the domain lib.
  A method without input or errors (`getAll`) gets neither. Repository methods
  take plain parameters ([decisions](../decisions.md#payloads-and-error-types-in-the-domain)).
- Service key: `'@overckd/<feature>/<role>/<Name>'`.

## 2. Local implementations: the use cases

A local implementation is a `Layer` that builds the port from outbound ports.
Pass-through methods get a span; anything with steps is an `Effect.fn` named
`'<Port>.<method>'`. Rules and calculations are pure domain functions
(`renameCollection`), not code in the layer.

```ts
// libs/@overckd/collection/application/src/lib/collection-queries.local.ts
export const CollectionQueriesLocal = Layer.effect(
  CollectionQueries,
  Effect.gen(function* () {
    const repo = yield* CollectionRepo;

    return CollectionQueries.of({
      getAll: repo.getAll.pipe(Effect.withSpan('CollectionQueries.getAll')),
      findById: Effect.fn('CollectionQueries.findById')(({ id }: CollectionFindByIdPayload) => repo.findById(id)),
    });
  }),
);
```

```ts
// libs/@overckd/collection/application/src/lib/collection-commands.local.ts
export const CollectionCommandsLocal = Layer.effect(
  CollectionCommands,
  Effect.gen(function* () {
    const repo = yield* CollectionRepo;

    const rename = Effect.fn('CollectionCommands.rename')(function* ({ id, name }: CollectionRenamePayload) {
      const collection = yield* repo.findById(id);
      const renamed = renameCollection(collection, name);
      yield* repo.save(renamed);
      return renamed;
    });

    return CollectionCommands.of({ rename });
  }),
);
```

The layer requires `CollectionRepo` and **does not provide it**. Choosing the
repository is the job of a composition root. Never `Layer.provide` an
implementation's dependencies inside a feature lib.

### Why a service and not standalone functions?

A standalone function has exactly one implementation, but the whole point of a
port is that the browser and the server implement it differently. If the
use cases were standalone functions over `CollectionRepo` and the browser
provided an HTTP-backed repo instead, every command would run its orchestration
twice, once in the browser and again on the server, and every caller would see
`CollectionRepo` in its requirements. See
[decisions](../decisions.md#ports-are-services-implementations-are-layers).

## 3. The contract

The contract is the `HttpApi` definition, kept in the `api-http` libs: one
`HttpApiGroup` per feature (`@overckd/<feature>/api-http`) and the root API
(`@overckd/api-http`). The server handlers and the browser client are both
derived from it, so they cannot drift apart. HTTP status codes belong here, not
on the domain errors.

```ts
// libs/@overckd/collection/api-http/src/lib/collection.api.ts
import { CollectionIdFromString, CollectionJson, CollectionNotFound } from '@overckd/domain';
import { Schema } from 'effect';
import { HttpApiEndpoint, HttpApiGroup, HttpApiSchema, OpenApi } from 'effect/http-api';

export class CollectionApi extends HttpApiGroup.make('collection')
  .add(
    HttpApiEndpoint.get('getAll', '/', {
      success: Schema.Array(CollectionJson),
    }),
  )
  .add(
    HttpApiEndpoint.get('findById', '/:id', {
      params: { id: CollectionIdFromString },
      success: CollectionJson,
      error: CollectionNotFound.pipe(HttpApiSchema.status(404)),
    }),
  )
  .add(
    HttpApiEndpoint.patch('rename', '/:id', {
      params: { id: CollectionIdFromString },
      payload: Schema.Struct({ name: Schema.NonEmptyString }),
      success: CollectionJson,
      error: CollectionNotFound.pipe(HttpApiSchema.status(404)),
    }),
  )
  .prefix('/collections')
  .annotateMerge(
    OpenApi.annotations({
      title: 'Collections',
      description: 'Collections of recipes',
    }),
  ) {}
```

Every feature group is added to the root API in `libs/@overckd/api-http`:

```ts
// libs/@overckd/api-http/src/lib/overckd.api.ts
export class OverckdApi extends HttpApi.make('overckd')
  .add(CollectionApi)
  .prefix('/api')
  .annotateMerge(OpenApi.annotations({ title: 'Overckd API' })) {}
```

## 4. Inbound HTTP adapter

The handlers map each endpoint onto one port method. There is no logic and no
error mapping: typed port errors pass through, and the contract gives them their
status code. When the decoded `params` already have the shape of the port
payload, pass them on; otherwise put the payload together from `params` and the
request body (`payload` in `HttpApi`).

```ts
// libs/@overckd/collection/adapter-http-server/src/lib/collection.controller.ts
export const CollectionHttpController = HttpApiBuilder.group(
  OverckdApi,
  'collection',
  Effect.fn(function* (handlers) {
    const queries = yield* CollectionQueries;
    const commands = yield* CollectionCommands;

    return handlers.handleAll({
      getAll: () => queries.getAll,
      findById: ({ params }) => queries.findById(params),
      rename: ({ params, payload }) => commands.rename({ id: params.id, name: payload.name }),
    });
  }),
);
```

The handlers depend on the **ports**, not on `*Local`, so tests can mock the
ports and composition roots decide the implementation.

## 5. Remote implementation (browser side)

The browser implements the same inbound ports by calling the API. It keeps the
errors the port declares and turns everything else (network, status codes the
contract doesn't declare, decoding) into defects.

```ts
// libs/@overckd/collection/adapter-http-client/src/lib/collection-queries.http.ts
import { OverckdApi } from '@overckd/api-http';
import { Effect, Layer } from 'effect';
import { HttpClient } from 'effect/http';
import { HttpApiClient } from 'effect/http-api';

/** Typed client for the `collection` group, using the app-provided HttpClient. */
const makeClient = Effect.gen(function* () {
  const httpClient = yield* HttpClient.HttpClient;
  return yield* HttpApiClient.group(OverckdApi, {
    group: 'collection',
    httpClient,
  });
});

export const CollectionQueriesHttp = Layer.effect(
  CollectionQueries,
  Effect.gen(function* () {
    const client = yield* makeClient;

    return CollectionQueries.of({
      getAll: client.getAll().pipe(
        // No typed errors on this port method: transport/decoding failures are defects.
        Effect.orDie,
        Effect.withSpan('CollectionQueries.getAll'),
      ),
      findById: Effect.fn('CollectionQueries.findById')((payload: CollectionFindByIdPayload) =>
        client.findById({ params: payload }).pipe(
          // Keep the port's typed error (CollectionNotFound), everything else dies.
          Effect.catchTag(['HttpClientError', 'SchemaError'], Effect.die),
        ),
      ),
    });
  }),
);
```

`CollectionCommandsHttp` follows the same shape. The adapter knows no base URL:
it uses whatever `HttpClient` the app provides (see [frontend](frontend.md)).
Retry idempotent queries in the adapter if needed, before the defect conversion.

## 6. Outbound adapters (repositories)

A repository implementation is a `Layer` for `<Feature>Repo`, named
`<Feature>Repo<Tech>`, in `libs/@overckd/<feature>/adapter-<tech>`. It is tagged
`type:adapter` + `platform:any`; use `platform:node` only if it must import a
Node-only package, and then only Node apps can use it. Generate the lib as in
[add a feature](../guides/add-a-feature.md#2-generate-the-libs).

- Configuration (file paths, database names) comes in as **function
  parameters**; the composition root reads the config and passes it in.
- Use Effect's abstract platform services (`FileSystem`, `Path`, `HttpClient`),
  never `node:fs` or another platform package; the app provides the platform.
  For rxdb, take the storage (or the database) as a parameter, so the app
  chooses between in-memory, file-based or IndexedDB storage.
- Formats private to the adapter (e.g. rxdb document schemas) are **codecs
  inside it**. The YAML files are a shared format: their codecs live in
  `@overckd/codec-yaml`, and `adapter-fs` only does the I/O.
- Map failures deliberately ([errors](effect.md#errors)): errors the port
  declares are kept; I/O, decoding and database errors become defects, unless
  users need to be told (then declare a typed error on the port and map to it).
- Spans: `'<Feature>Repo.<method>'`.
- Every implementation passes the feature's repository conformance suite
  ([testing](testing.md#repository-adapters)).

The simplest one keeps everything in memory:

```ts
// libs/@overckd/collection/adapter-memory/src/lib/collection-repo.memory.ts
export const CollectionRepoMemory = (seed: ReadonlyArray<Collection> = []) =>
  Layer.effect(
    CollectionRepo,
    Effect.gen(function* () {
      const store = yield* Ref.make<ReadonlyMap<CollectionId, Collection>>(new Map(seed.map(collection => [collection.id, collection])));

      return CollectionRepo.of({
        getAll: Ref.get(store).pipe(Effect.map(byId => [...byId.values()])),
        findById: Effect.fn('CollectionRepo.findById')(function* (id: CollectionId) {
          const collection = (yield* Ref.get(store)).get(id);
          if (collection === undefined) {
            return yield* new CollectionNotFound({ id });
          }
          return collection;
        }),
        save: collection => Ref.update(store, byId => new Map(byId).set(collection.id, collection)),
      });
    }),
  );
```

A repository backed by YAML files uses the codecs from `@overckd/codec-yaml`.
A codec is a schema from YAML text to domain values: parsing is one step,
validating the parsed data against the file's schema the next, and encoding runs
the same way back.

```ts
// libs/@overckd/codec-yaml/src/lib/yaml.ts
import { CollectionJson } from '@overckd/domain';
import { Effect, Schema, SchemaIssue, SchemaTransformation } from 'effect';
import { safeDump, safeLoad } from 'js-yaml';

/** YAML text as plain data; invalid YAML is a schema issue like any other. */
const YamlString = Schema.String.pipe(
  Schema.decodeTo(
    Schema.Unknown,
    SchemaTransformation.transformEffect<unknown, string>({
      decode: (text, options) =>
        Effect.try({
          try: () => safeLoad(text),
          catch: () => new SchemaIssue.InvalidValue({ message: 'Invalid YAML' }, text, options),
        }),
      encode: value => Effect.succeed(safeDump(value)),
    }),
  ),
);

/** A codec from YAML text to `schema`, which validates what the YAML contains. */
export const fromYamlString = <S extends Schema.Top>(schema: S) => YamlString.pipe(Schema.decodeTo(schema, SchemaTransformation.passthrough({ strict: false })));

// libs/@overckd/codec-yaml/src/lib/collections-file.ts
/** The collections file: YAML text ↔ domain values. */
export const CollectionsFileYaml = fromYamlString(Schema.Struct({ collections: Schema.Array(CollectionJson) }));
```

The adapter reads the file and decodes it; the format itself is not its concern:

```ts
// libs/@overckd/collection/adapter-fs/src/lib/collection-repo.fs.ts
import { CollectionsFileYaml } from '@overckd/codec-yaml';
import { CollectionRepo } from '@overckd/collection/application';
import { CollectionNotFound } from '@overckd/domain';
import { Array as Arr, Effect, FileSystem, Layer, Option, Schema } from 'effect';

/** Repository backed by a YAML file on disk. Config comes in as a parameter. */
export const CollectionRepoFs = (options: { readonly file: string }) =>
  Layer.effect(
    CollectionRepo,
    Effect.gen(function* () {
      const fs = yield* FileSystem.FileSystem;
      const decode = Schema.decodeEffect(CollectionsFileYaml);

      const readAll = fs.readFileString(options.file).pipe(
        Effect.flatMap(decode),
        Effect.map(file => file.collections),
        // I/O and decoding failures are defects here. If users should be told which
        // file is broken, declare a typed error on the port and map to it instead.
        Effect.orDie,
      );

      return CollectionRepo.of({
        getAll: readAll.pipe(Effect.withSpan('CollectionRepo.getAll')),
        findById: Effect.fn('CollectionRepo.findById')(function* (id) {
          const found = Arr.findFirst(yield* readAll, c => c.id === id);
          return yield* Option.match(found, {
            onNone: () => Effect.fail(new CollectionNotFound({ id })),
            onSome: Effect.succeed,
          });
        }),
        save: () => Effect.die('not implemented in this sketch'),
      });
    }),
  );
```

The real YAML layout (`overckd.collections.yaml` and the `*.recipe.yaml` files
under `data/`) is defined by the legacy io-ts codecs in `libs/yaml` today; port
them to `@overckd/codec-yaml`. To use an adapter, provide it in the composition
root of each app that should use it, e.g. `CollectionRepoFs({ file })` in the
desktop main process. Nothing else changes: the ports and use cases don't know
which repository they get.

## 7. Composition roots

Only the apps choose implementations. A server-side app wires the API from the
contract, the handlers and the local use cases, then adds the repositories and
a transport:

```ts
// apps/backend/src/main.ts
/** The API: the contract, served by the handlers, backed by the local use cases. */
const ApiLive = HttpApiBuilder.layer(OverckdApi, {
  openapiPath: '/openapi.json',
}).pipe(Layer.provide(CollectionHttpController), Layer.provide([CollectionQueriesLocal, CollectionCommandsLocal]));

const HttpLive = HttpRouter.serve(Layer.mergeAll(ApiLive, HttpApiSwagger.layer(OverckdApi), HttpRouter.cors())).pipe(
  // Swap for CollectionRepoRxdb / CollectionRepoFs without touching anything else.
  Layer.provide(CollectionRepoMemory()),
  Layer.provide(NodeHttpServer.layer(createServer, { port: 3000 })),
);

Layer.launch(HttpLive).pipe(NodeRuntime.runMain);
```

The desktop main process wires the same kind of `ApiLive` and serves it through
a custom protocol ([desktop](desktop.md)); the frontend provides the `*Http`
implementations to Angular ([frontend](frontend.md)).

Both server-side apps list the handlers and use cases of every feature, and the
compiler keeps those lists complete: `HttpApiBuilder.layer(OverckdApi)` needs a
handler layer for every group in the contract, the handlers need their ports,
and the use cases need their repositories. An app that forgets any of them does
not compile.

## Checklist

- [ ] Port declared by interface, `R = never`, key `'@overckd/<feature>/<role>/<Name>'`.
- [ ] Input as one `<Feature><Method>Payload`, errors as `<Feature><Method>Error`, both in the domain.
- [ ] Reads in `<Feature>Queries`, changes in `<Feature>Commands`.
- [ ] Logic in pure domain functions; `*Local` only orchestrates.
- [ ] No implementation provides its own dependencies.
- [ ] Handlers: one line per endpoint, no logic.
- [ ] Remote implementation keeps declared errors, dies on the rest.
- [ ] Status codes in the contract.
