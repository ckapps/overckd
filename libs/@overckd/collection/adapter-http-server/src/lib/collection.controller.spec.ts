import { OverckdApi } from '@overckd/api-http';
import { CollectionQueries } from '@overckd/collection/application';
import {
  Collection,
  CollectionId,
  CollectionNotFound,
} from '@overckd/domain-experimental';
import { Effect, Layer, Scope } from 'effect';
import { HttpServer } from 'effect/http';
import { HttpApiTest } from 'effect/http-api';
import { describe, expect, it } from 'vitest';
import { CollectionHttpController } from './collection.controller';

const desserts = Collection.make({
  id: CollectionId.make('desserts'),
  name: 'Desserts',
  description: '',
  recipes: [],
});

const TestLayer = Layer.mergeAll(
  CollectionHttpController.pipe(
    Layer.provide(
      Layer.mock(CollectionQueries, {
        getAll: Effect.succeed([desserts]),
        findById: id =>
          id === desserts.id
            ? Effect.succeed(desserts)
            : Effect.fail(new CollectionNotFound({ id })),
      }),
    ),
  ),
  HttpServer.layerServices,
);

const run = <A, E>(
  effect: Effect.Effect<A, E, Layer.Success<typeof TestLayer> | Scope.Scope>,
) => Effect.runPromise(effect.pipe(Effect.provide(TestLayer), Effect.scoped));

describe('CollectionHttpController', () => {
  const makeClient = HttpApiTest.groups(OverckdApi, ['collection']);

  it('returns all collections', async () => {
    const collections = await run(
      Effect.gen(function* () {
        const client = yield* makeClient;
        return yield* client.collection.getAll();
      }),
    );
    expect(collections).toEqual([desserts]);
  });

  it('finds a collection by its id', async () => {
    const collection = await run(
      Effect.gen(function* () {
        const client = yield* makeClient;
        return yield* client.collection.findById({
          params: { id: desserts.id },
        });
      }),
    );
    expect(collection).toEqual(desserts);
  });

  it('answers unknown ids with a typed 404', async () => {
    const error = await run(
      Effect.gen(function* () {
        const client = yield* makeClient;
        return yield* client.collection
          .findById({ params: { id: CollectionId.make('nope') } })
          .pipe(Effect.flip);
      }),
    );
    expect(error).toBeInstanceOf(CollectionNotFound);
  });
});
