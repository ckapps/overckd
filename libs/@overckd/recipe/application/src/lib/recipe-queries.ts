import {
  RecipeFindByIdError,
  RecipeFindByIdPayload,
  RecipePreparation,
} from '@overckd/domain-experimental';
import { Context, Effect } from 'effect';

/** Inbound port: everything that reads recipes. */
export class RecipeQueries extends Context.Service<
  RecipeQueries,
  {
    /**
     * Find a recipe by its id.
     */
    readonly findById: (
      payload: RecipeFindByIdPayload,
    ) => Effect.Effect<RecipePreparation, RecipeFindByIdError>;
  }
>()('@overckd/recipe/application/RecipeQueries') {}
