import {
  Collection,
  CollectionId,
  CollectionNotFound,
} from '@overckd/domain-experimental';
import { Effect, Layer } from 'effect';
import { describe, expect, it } from 'vitest';
import { CollectionQueries } from './collection-queries';
import { CollectionQueriesLocal } from './collection-queries.local';
import { CollectionRepo } from './collection-repo';

const desserts = Collection.make({
  id: CollectionId.make('desserts'),
  name: 'Desserts',
  description: '',
  recipes: [],
});

describe('CollectionQueriesLocal', () => {
  it('returns all collections of the repo', async () => {
    const repo = Layer.mock(CollectionRepo, {
      getAll: Effect.succeed([desserts]),
    });

    const collections = await Effect.runPromise(
      CollectionQueries.use(queries => queries.getAll).pipe(
        Effect.provide(CollectionQueriesLocal.pipe(Layer.provide(repo))),
      ),
    );

    expect(collections).toEqual([desserts]);
  });

  it('finds a collection by its id', async () => {
    const repo = Layer.mock(CollectionRepo, {
      findById: () => Effect.succeed(desserts),
    });

    const collection = await Effect.runPromise(
      CollectionQueries.use(queries =>
        queries.findById({ id: desserts.id }),
      ).pipe(Effect.provide(CollectionQueriesLocal.pipe(Layer.provide(repo)))),
    );

    expect(collection).toEqual(desserts);
  });

  it('fails with CollectionNotFound for unknown ids', async () => {
    const repo = Layer.mock(CollectionRepo, {
      findById: id => Effect.fail(new CollectionNotFound({ id })),
    });

    const error = await Effect.runPromise(
      CollectionQueries.use(queries =>
        queries.findById({ id: CollectionId.make('nope') }),
      ).pipe(
        Effect.flip,
        Effect.provide(CollectionQueriesLocal.pipe(Layer.provide(repo))),
      ),
    );

    expect(error).toBeInstanceOf(CollectionNotFound);
  });
});
