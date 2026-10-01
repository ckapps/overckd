# Testing

Test each role through its port, with the neighbours replaced. No test needs a
network, a real file system or a database unless it tests that adapter.
Run tests through Nx: `pnpm nx test <project>` or `pnpm nx affected -t test`.

| Role                                         | Test with                                                        | Replace                                              |
| -------------------------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------- |
| domain                                       | plain unit tests: pure functions, codec round trips              | nothing                                              |
| `codec-yaml`                                 | sample YAML texts: decode, round trip, invalid YAML, wrong shape | nothing                                              |
| `*Local` (use cases)                         | the port, via `Effect.runPromise`                                | outbound ports with `Layer.mock`                     |
| repository adapters                          | a shared conformance suite                                       | the storage (`FileSystem.layerNoop`, in-memory rxdb) |
| HTTP handlers                                | `HttpApiTest.groups`                                             | inbound ports with `Layer.mock`                      |
| `*Http` (remote impl)                        | the port                                                         | `fetch`, via `FetchHttpClient.Fetch`                 |
| `data-access` (bindings, stores), components | Angular TestBed / Spectator                                      | ports with `Layer.mock` via `provideEffectRuntime`   |

Assert on errors with `Effect.flip`, which moves the error into the success
channel. Don't compare whole `Exit` values with `toEqual`: failure causes carry
span and trace annotations.

## Domain

Pure functions and codecs need no Effect runtime. The existing specs in
`libs/@overckd/domain-experimental/src/lib/internal/*.spec.ts` show the codec
round-trip style (`Schema.decodeSync` / `Schema.encodeSync`).

## Use cases (`*Local`)

Provide the implementation with mocked outbound ports. `Layer.mock` only needs
the members the test uses; calling any other member is a defect.

```ts
// libs/@overckd/collection/application/src/lib/collection-commands.local.spec.ts
const desserts = Collection.make({
  id: CollectionId.make('desserts'),
  name: 'Desserts',
  description: '',
  recipes: [],
});

describe('CollectionCommandsLocal', () => {
  it('renames and saves the collection', async () => {
    const saved: Array<Collection> = [];
    const repo = Layer.mock(CollectionRepo, {
      findById: () => Effect.succeed(desserts),
      save: collection => Effect.sync(() => void saved.push(collection)),
    });

    const renamed = await Effect.runPromise(CollectionCommands.use(commands => commands.rename({ id: desserts.id, name: 'Sweets' })).pipe(Effect.provide(CollectionCommandsLocal.pipe(Layer.provide(repo)))));

    expect(renamed.name).toBe('Sweets');
    expect(saved).toEqual([renamed]);
  });
});

describe('CollectionQueriesLocal', () => {
  it('fails with CollectionNotFound for unknown ids', async () => {
    const repo = Layer.mock(CollectionRepo, {
      findById: id => Effect.fail(new CollectionNotFound({ id })),
    });

    const error = await Effect.runPromise(CollectionQueries.use(queries => queries.findById({ id: CollectionId.make('nope') })).pipe(Effect.flip, Effect.provide(CollectionQueriesLocal.pipe(Layer.provide(repo)))));

    expect(error).toBeInstanceOf(CollectionNotFound);
  });
});
```

## Repository adapters

Every implementation of a `<Feature>Repo` must behave the same. Write the
expected behaviour once as a conformance suite in `@overckd/testing`
(`src/lib/<feature>/`): a function that registers tests and takes a function
building the repository from seed data, so each adapter decides how to store
it. Each adapter lib runs it against its own implementation:
`CollectionRepoMemory`, `CollectionRepoFs` on an in-memory file system
(`FileSystem.layerNoop` with the few methods the adapter calls, backed by a
`Map`), `CollectionRepoRxdb` on in-memory storage.

```ts
// libs/@overckd/collection/adapter-memory/src/lib/collection-repo.memory.spec.ts
import { collectionRepoConformance } from '@overckd/testing';

describe('CollectionRepoMemory', () => {
  collectionRepoConformance(CollectionRepoMemory);
});
```

The testing lib imports vitest, so only spec files may import it
([dependency rules](libraries.md#dependency-rules)). The module-boundary rule
covers spec files too, so a `platform:any` adapter can't use Node's file system
in its tests.

## HTTP handlers

`HttpApiTest.groups` builds a typed client wired straight to the handlers, with
the real request encoding, routing and response decoding. Mock the ports; no
use cases or repositories are involved.

```ts
// libs/@overckd/collection/adapter-http-server/src/lib/collection.controller.spec.ts
const TestLayer = Layer.mergeAll(
  CollectionHttpController.pipe(
    Layer.provide(
      Layer.mock(CollectionQueries, {
        getAll: Effect.succeed([desserts]),
        findById: ({ id }) => (id === desserts.id ? Effect.succeed(desserts) : Effect.fail(new CollectionNotFound({ id }))),
      }),
    ),
    Layer.provide(Layer.mock(CollectionCommands, {})),
  ),
  HttpServer.layerServices,
);

const run = <A, E>(effect: Effect.Effect<A, E, Layer.Success<typeof TestLayer> | Scope.Scope>) => Effect.runPromise(effect.pipe(Effect.provide(TestLayer), Effect.scoped));

describe('CollectionHttpController', () => {
  const makeClient = HttpApiTest.groups(OverckdApi, ['collection']);

  it('answers unknown ids with a typed 404', async () => {
    const error = await run(
      Effect.gen(function* () {
        const client = yield* makeClient;
        return yield* client.collection.findById({ params: { id: CollectionId.make('nope') } }).pipe(Effect.flip);
      }),
    );
    expect(error).toBeInstanceOf(CollectionNotFound);
  });
});
```

## Remote implementations (`*Http`)

Replace `fetch` itself. Node has no `location`, so give the client an absolute
base URL.

```ts
// libs/@overckd/collection/adapter-http-client/src/lib/collection-queries.http.spec.ts
const respondWith =
  (status: number, body: unknown): typeof globalThis.fetch =>
  () =>
    Promise.resolve(
      new Response(JSON.stringify(body), {
        status,
        headers: { 'content-type': 'application/json' },
      }),
    );

const TestHttpClient = Layer.effect(HttpClient.HttpClient, Effect.map(HttpClient.HttpClient, HttpClient.mapRequest(HttpClientRequest.prependUrl('http://api.test')))).pipe(Layer.provide(FetchHttpClient.layer));

const findById = (fakeFetch: typeof globalThis.fetch) => CollectionQueries.use(queries => queries.findById({ id: CollectionId.make('desserts') })).pipe(Effect.provide(CollectionQueriesHttp.pipe(Layer.provide(TestHttpClient))), Effect.provideService(FetchHttpClient.Fetch, fakeFetch));

it('keeps the typed domain error', async () => {
  const error = await Effect.runPromise(findById(respondWith(404, { _tag: 'CollectionNotFound', id: 'desserts' })).pipe(Effect.flip));
  expect(error).toBeInstanceOf(CollectionNotFound);
});

it('turns transport failures into defects', async () => {
  const exit = await Effect.runPromiseExit(findById(() => Promise.reject(new Error('offline'))));
  expect(Exit.isFailure(exit) && Cause.hasDies(exit.cause)).toBe(true);
});
```

The contract is shared by both ends of the wire, so these tests plus the handler
tests cover it. A fetch function can also be backed by
`HttpRouter.toWebHandler(…).handler` to run a full in-memory round trip (the
desktop path), but such a test depends on both HTTP adapters and the server
composition, which a feature lib may not do (adapters don't depend on other
adapters), so it belongs in an app-level test project.

## Data access and components

Components are tested with Spectator as today. Data-access bindings and stores
run in the repo's zoneless TestBed (`setupTestBed()`): provide
`provideEffectRuntime(…)` with mocked ports (a data-access lib may not import
adapters), create the binding in an injection context, and wait until the app is
stable.

```ts
// libs/@overckd-app/collection/data-access/src/lib/collection.bindings.spec.ts
const findDesserts = ({ id }: CollectionFindByIdPayload) => (id === desserts.id ? Effect.succeed(desserts) : Effect.fail(new CollectionNotFound({ id })));

beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [
      provideEffectRuntime(
        Layer.mergeAll(
          Layer.mock(CollectionQueries, { findById: findDesserts }),
          Layer.mock(CollectionCommands, {
            rename: ({ id, name }) => Effect.map(findDesserts({ id }), c => Collection.make({ ...c, name })),
          }),
        ),
      ),
    ],
  });
});

const stable = () => TestBed.inject(ApplicationRef).whenStable();

it('stays idle while an input is undefined, then loads', async () => {
  const payload = signal<CollectionFindByIdPayload | undefined>(undefined);
  const collection = TestBed.runInInjectionContext(() => injectCollectionQueries().findById(payload));
  await stable();
  expect(collection.status()).toBe('idle');

  payload.set({ id: desserts.id });
  await stable();
  expect(collection.value()?.name).toBe('Desserts');
});

it('runs commands as promises that reject with typed errors', async () => {
  const commands = TestBed.runInInjectionContext(() => injectCollectionCommands());
  await expect(commands.rename({ id: desserts.id, name: 'Sweets' })).resolves.toMatchObject({
    name: 'Sweets',
  });
  await expect(commands.rename({ id: CollectionId.make('nope'), name: 'x' })).rejects.toBeInstanceOf(CollectionNotFound);
});
```

## Follow-up

`@effect/vitest` (`it.effect`, shared `layer(…)` blocks) is used by Effect's own
examples but is not installed in this workspace yet; until it is, run effects
with `Effect.runPromise` inside vitest tests as shown above.
