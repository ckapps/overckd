import {
  RecipeId,
  RecipeNotFound,
  RecipePreparation,
} from '@overckd/domain-experimental';
import { Context, Effect } from 'effect';

/** Inbound port: everything that reads recipes. */
export class RecipeQueries extends Context.Service<
  RecipeQueries,
  {
    /**
     * Find a recipe by its id.
     * @param id Id of the recipe
     */
    readonly findById: (
      id: RecipeId,
    ) => Effect.Effect<RecipePreparation, RecipeNotFound>;
  }
>()('@overckd/recipe/application/RecipeQueries') {}
