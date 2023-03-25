import { event } from '@marblejs/core';
import { RecipeNameDto } from './recipe.type';

/** Queries for `Recipe`s. */
export enum RecipeQueryType {
  // GetAll = 'RECIPE_GET_ALL',
  GetByName = '@overckd.recipe.query.get_by_name',
}

// ----------------------------------------------------------------------------
// Events
// ----------------------------------------------------------------------------
/**
 * Event for `getById`
 */
export const GetRecipeByNameEvent = event(RecipeQueryType.GetByName)(
  RecipeNameDto,
);

/**
 * Event for `getAll`
 */
// export const GetAllRecipeCollectionsEvent = event(
//   RecipeCollectionQueryType.GetAll,
// )();
