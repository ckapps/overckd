import { CollectionFindByIdPayload } from '@overckd/domain-experimental';
import { Effect, Layer } from 'effect';
import { CollectionQueries } from './collection-queries';
import { CollectionRepo } from './collection-repo';

/** `CollectionQueries` on top of a `CollectionRepo`. */
export const CollectionQueriesLocal = Layer.effect(
  CollectionQueries,
  Effect.gen(function* () {
    const repo = yield* CollectionRepo;

    return CollectionQueries.of({
      getAll: repo.getAll.pipe(Effect.withSpan('CollectionQueries.getAll')),
      findById: Effect.fn('CollectionQueries.findById')(
        ({ id }: CollectionFindByIdPayload) => repo.findById(id),
      ),
    });
  }),
);
