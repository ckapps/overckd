import { event } from '@marblejs/core';

import { FlattenIngredientByQueryDto } from './ingredient.type';

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
)(FlattenIngredientByQueryDto);

/**
 * Event for `getAll`
 */
// export const GetAllRecipeCollectionsEvent = event(
//   RecipeCollectionQueryType.GetAll,
// )();
