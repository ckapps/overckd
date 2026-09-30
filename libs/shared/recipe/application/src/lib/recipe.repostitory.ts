import {
  RecipeId,
  RecipeNotFound,
  RecipePreparation,
} from '@overckd/domain-experimental';
import { Context, Effect } from 'effect';

export class RecipeRepo extends Context.Service<
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
>()('@overckd/recipe/application/repo') {}
