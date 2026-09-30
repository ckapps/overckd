import { RecipeId } from '@overckd/domain-experimental';
import { Context, Effect, Function as Fn, Layer } from 'effect';
import { RecipeRepo } from './recipe.repostitory';

export class RecipeUseCase extends Context.Service<RecipeUseCase>()(
  'RecipeUseCase',
  {
    make: Effect.gen(function* () {
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
) {
  static readonly layer = Layer.effect(this, this.make);
}
