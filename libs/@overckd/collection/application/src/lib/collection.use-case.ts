import { CollectionId } from '@overckd/domain-experimental';
import { Context, Effect, Layer, pipe } from 'effect';
import { CollectionRepo } from './collection.repostitory';

export class CollectionUseCase extends Context.Service<CollectionUseCase>()(
  'CollectionUseCase',
  {
    make: Effect.gen(function* () {
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
) {
  static readonly layer = Layer.effect(this, this.make);
}
