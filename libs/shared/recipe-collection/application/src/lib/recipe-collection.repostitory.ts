import {
  RecipeCollection,
  RecipeCollectionId,
  RecipeCollectionNotFound,
} from '@overckd/domain-experimental';
import { Context, Effect } from 'effect';

export class RecipeCollectionRepo extends Context.Tag(
  '@overckd/recipe-collection/application/repo',
)<
  RecipeCollectionRepo,
  {
    /**
     * Get all recipe collections.
     */
    readonly getAll: Effect.Effect<ReadonlyArray<RecipeCollection>>;

    /**
     * Find a recipe collection by its id.
     * @param id Id of the recipe collection
     */
    readonly findById: (
      id: RecipeCollectionId,
    ) => Effect.Effect<RecipeCollection, RecipeCollectionNotFound>;
  }
>() {}
