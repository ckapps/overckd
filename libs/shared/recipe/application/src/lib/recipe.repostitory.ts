import {
  RecipeId,
  RecipeNotFound,
  RecipePreparation,
} from '@overckd/domain-experimental';
import * as Context from 'effect/Context';
import * as Effect from 'effect/Effect';

export class RecipeRepo extends Context.Tag('@overckd/recipe/application/repo')<
  RecipeRepo,
  {
    /**
     * Find a recipe by its id.
     * @param id Id of the recipe
     */
    readonly findById: (
      id: RecipeId,
    ) => Effect.Effect<RecipePreparation, RecipeNotFound>;
  }
>() {}
