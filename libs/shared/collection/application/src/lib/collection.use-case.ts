import { CollectionId } from '@overckd/domain-experimental';
import { Effect, pipe } from 'effect';
import { CollectionRepo } from './collection.repostitory';

export class CollectionUseCase extends Effect.Service<CollectionUseCase>()(
  'CollectionUseCase',
  {
    effect: Effect.gen(function* () {
      const repo = yield* CollectionRepo;

      const getAll = repo.getAll.pipe(Effect.withSpan('Collection.getAll'));

      const findById = (id: CollectionId) =>
        pipe(
          repo.findById(id),
          Effect.withSpan('Collection.findById', { attributes: { id } }),
          // policyRequire("Person", "read")
        );

      return { getAll, findById } as const;
    }),
  },
) {}
