import { RecipeId } from '@overckd/domain-experimental';
import * as Effect from 'effect/Effect';
import * as Fn from 'effect/Function';
import { RecipeRepo } from './recipe.repostitory';

export class RecipeUseCase extends Effect.Service<RecipeUseCase>()(
  'RecipeUseCase',
  {
    effect: Effect.gen(function* () {
      const repo = yield* RecipeRepo;

      const findById = (id: RecipeId) =>
        Fn.pipe(
          repo.findById(id),
          Effect.withSpan('Recipe.findById', { attributes: { id } }),
          // policyRequire("Person", "read")
        );

      return { findById } as const;
    }),
  },
) {}
