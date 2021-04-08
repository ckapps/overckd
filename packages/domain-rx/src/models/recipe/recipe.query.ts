import { event } from '@marblejs/core';

import { RecipeNameDto } from './recipe.type';

/**
 *
 */
export enum RecipeQueryType {
  // GetAll = 'RECIPE_GET_ALL',
  GetByName = 'RECIPE_GET_BY_NAME',
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
