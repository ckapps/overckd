import { RecipeCollectionId } from '@overckd/domain-experimental';
import { Effect } from 'effect';
import { RecipeCollectionRepo } from './recipe-collection.repostitory';

/**
 * Get all recipe collections.
 */
export const getAll = Effect.gen(function* () {
  const repo = yield* RecipeCollectionRepo;
  return yield* repo.getAll;
}).pipe(Effect.withSpan('RecipeCollection.getAll'));

/**
 * Find a recipe collection by its id.
 * @param id Id of the recipe collection
 */
export const findById = (id: RecipeCollectionId) =>
  Effect.gen(function* () {
    const repo = yield* RecipeCollectionRepo;
    return yield* repo.findById(id);
  }).pipe(Effect.withSpan('RecipeCollection.findById', { attributes: { id } }));
