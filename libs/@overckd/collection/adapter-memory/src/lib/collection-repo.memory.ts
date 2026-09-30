import { CollectionRepo } from '@overckd/collection/application';
import {
  Collection,
  CollectionId,
  CollectionNotFound,
} from '@overckd/domain-experimental';
import { Effect, Layer, Ref } from 'effect';

/**
 * `CollectionRepo` that keeps the collections in memory.
 * @param seed The collections it starts with
 */
export const CollectionRepoMemory = (seed: ReadonlyArray<Collection> = []) =>
  Layer.effect(
    CollectionRepo,
    Effect.gen(function* () {
      const store = yield* Ref.make<ReadonlyMap<CollectionId, Collection>>(
        new Map(seed.map(collection => [collection.id, collection])),
      );

      return CollectionRepo.of({
        getAll: Ref.get(store).pipe(
          Effect.map(byId => [...byId.values()]),
          Effect.withSpan('CollectionRepo.getAll'),
        ),
        findById: Effect.fn('CollectionRepo.findById')(function* (
          id: CollectionId,
        ) {
          const collection = (yield* Ref.get(store)).get(id);
          if (collection === undefined) {
            return yield* new CollectionNotFound({ id });
          }
          return collection;
        }),
      });
    }),
  );
