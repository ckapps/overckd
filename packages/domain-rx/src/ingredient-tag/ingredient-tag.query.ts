import { event } from '@marblejs/core';

import { IngredientTagByQueryDto } from './ingredient-tag.type';

/**
 *
 */
export enum IngredientTagQueryType {
  FindByQuery = 'INGREDIENT_TAGS_FIND_BY_QUERY',
}

// ----------------------------------------------------------------------------
// Events
// ----------------------------------------------------------------------------
/**
 * Event for `getById`
 */
export const FindIngredientTagByQueryEvent = event(
  IngredientTagQueryType.FindByQuery,
)(IngredientTagByQueryDto);

/**
 * Event for `getAll`
 */
// export const GetAllRecipeCollectionsEvent = event(
//   RecipeCollectionQueryType.GetAll,
// )();
