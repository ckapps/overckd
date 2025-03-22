import { RecipeCollectionId } from '@overckd/domain-experimental';
import { Effect, pipe } from 'effect';
import { RecipeCollectionRepo } from './recipe-collection.repostitory';

export class RecipeCollectionUseCase extends Effect.Service<RecipeCollectionUseCase>()(
  'RecipeCollection',
  {
    effect: Effect.gen(function* () {
      const repo = yield* RecipeCollectionRepo;

      const getAll = repo.getAll.pipe(
        Effect.withSpan('RecipeCollection.getAll'),
      );

      const findById = (id: RecipeCollectionId) =>
        pipe(
          repo.findById(id),
          Effect.withSpan('RecipeCollection.findById', { attributes: { id } }),
          // policyRequire("Person", "read")
        );

      return { getAll, findById } as const;
    }),
  },
) {}
