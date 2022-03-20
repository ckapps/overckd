import { event } from '@marblejs/core';

import { IngredientByQueryDto } from './ingredient.type';

/**
 *
 */
export enum IngredientQueryType {
  FindByQuery = 'INGREDIENTS_FIND_BY_QUERY',
}

// ----------------------------------------------------------------------------
// Events
// ----------------------------------------------------------------------------
/**
 * Event for `getById`
 */
export const FindIngredientByQueryEvent = event(
  IngredientQueryType.FindByQuery,
)(IngredientByQueryDto);

/**
 * Event for `getAll`
 */
// export const GetAllRecipeCollectionsEvent = event(
//   RecipeCollectionQueryType.GetAll,
// )();
