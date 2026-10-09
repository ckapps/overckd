# Add an operation (query or command)

Adding a capability touches every role of a feature, in a fixed order from the
inside out. The running example adds `CollectionCommands.rename`; the complete
code is in [ports and adapters](../architecture/ports-and-adapters.md).

## 0. Decide: query or command?

If it changes state, it goes into `<Feature>Commands`, even if it returns data.
Otherwise `<Feature>Queries`.

## 1. Domain

In the domain lib, add what crosses the port or the wire, and export it from
`src/index.ts` (type-only names with `export type`):

- the payload, if the operation takes input: a `Schema.Struct` named
  `<Feature><Method>Payload` (creation payloads can contain an `<Entity>Draft`),
- errors the user can act on: `Schema.TaggedError`, **no** HTTP status, and if
  the operation declares any, their type `<Feature><Method>Error`,
- the rule itself as a pure function: `renameCollection(collection, name)`.

```ts
export type CollectionRenamePayload = typeof CollectionRenamePayload.Type;
export const CollectionRenamePayload = Schema.Struct({ id: CollectionId, name: Schema.NonEmptyString });
export type CollectionRenameError = CollectionNotFound;
```

## 2. Port

Add the method to the port interface in the application lib. Only domain types,
only user-actionable errors, no requirements:

```ts
readonly rename: (
  payload: CollectionRenamePayload,
) => Effect.Effect<Collection, CollectionRenameError>;
```

If the use case needs something new from storage, add it to `<Feature>Repo`
(e.g. `save`).

## 3. Local implementation and its test

Implement the method in `<Feature>QueriesLocal` / `<Feature>CommandsLocal` with
`Effect.fn('<Port>.<method>')`. Orchestrate only; the rule is the domain
function.

```ts
const rename = Effect.fn('CollectionCommands.rename')(function* ({ id, name }: CollectionRenamePayload) {
  const collection = yield* repo.findById(id);
  const renamed = renameCollection(collection, name);
  yield* repo.save(renamed);
  return renamed;
});
```

Test it with `Layer.mock` for the outbound port
([testing](../architecture/testing.md#use-cases-local)).

## 4. Repository adapters

If you added repo methods, implement them in **every** `<Feature>Repo*`
implementation (memory, fs, rxdb) and run the conformance suite.

## 5. Contract

Add the endpoint to `<Feature>Api`, with the status code of each error:

```ts
.add(
  HttpApiEndpoint.patch('rename', '/:id', {
    params: { id: CollectionIdFromString },
    payload: Schema.Struct({ name: Schema.NonEmptyString }),
    success: CollectionJson,
    error: CollectionNotFound.pipe(HttpApiSchema.status(404)),
  }),
)
```

The endpoint's `params` and `payload` (the request body) are where untrusted
input is validated. They describe HTTP, so their shape may differ from the port
payload.

## 6. Handler

One line in `<Feature>HttpController`. No logic, no error mapping. Pass
`params` on when they have the port payload's shape (`findById: ({ params }) =>
queries.findById(params)`), otherwise put the payload together:

```ts
rename: ({ params, payload }) => commands.rename({ id: params.id, name: payload.name }),
```

## 7. Remote implementation

Add the method to `<Feature>QueriesHttp` / `<Feature>CommandsHttp`. Keep the
errors the port declares; everything else dies:

```ts
rename: Effect.fn('CollectionCommands.rename')(
  ({ id, name }: CollectionRenamePayload) =>
    client
      .rename({ params: { id }, payload: { name } })
      .pipe(Effect.catchTag(['HttpClientError', 'SchemaError'], Effect.die)),
),
```

## 8. Data access

Nothing to write: the feature's `inject<Port>()` bindings derive the new method
from the port (queries → `ResourceRef` with a signal of the payload, commands
→ `Promise`). Only if a store holds state that the operation changes, update that
store in `libs/@overckd-app/<feature>/data-access`.

## 9. UI

Call the binding from a `feature-*` component
(`injectCollectionCommands().rename({ id, name })`); put presentational parts
into the `ui` lib. Handle typed errors (`error instanceof CollectionNotFound`),
rethrow the rest.

## 10. Verify

```sh
pnpm nx affected -t lint test typecheck
```

A lint error from `@nx/enforce-module-boundaries` means code is in the wrong
lib; move it rather than changing the rules.

## Where does the code go?

| Concern                                | Place                                                               |
| -------------------------------------- | ------------------------------------------------------------------- |
| shape and validation of input          | schema: domain (port payloads) or contract (HTTP params and bodies) |
| business rule, calculation             | pure function in the domain                                         |
| orchestration (load, apply rule, save) | `*Local` implementation                                             |
| HTTP mapping, status codes             | contract                                                            |
| transport and storage errors           | adapter (defects)                                                   |
| display, user feedback                 | components                                                          |

Never put logic into handlers, data-access bindings or components.
