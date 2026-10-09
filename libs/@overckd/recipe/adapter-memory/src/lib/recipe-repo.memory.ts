import { RecipeId, RecipeNotFound, RecipePreparation } from '@overckd/domain';
import { RecipeRepo } from '@overckd/recipe/application';
import { Effect, Layer, Ref } from 'effect';

/**
 * `RecipeRepo` that keeps the recipes in memory.
 * @param seed The recipes it starts with
 */
export const RecipeRepoMemory = (seed: ReadonlyArray<RecipePreparation> = []) =>
  Layer.effect(
    RecipeRepo,
    Effect.gen(function* () {
      const store = yield* Ref.make<ReadonlyMap<RecipeId, RecipePreparation>>(
        new Map(seed.map(recipe => [recipe.id, recipe])),
      );

      return RecipeRepo.of({
        findById: Effect.fn('RecipeRepo.findById')(function* (id: RecipeId) {
          const recipe = (yield* Ref.get(store)).get(id);
          if (recipe === undefined) {
            return yield* new RecipeNotFound({ id });
          }
          return recipe;
        }),
      });
    }),
  );
