import { event } from '@marblejs/core';
import { IngredientByQueryDto } from './ingredient.type';

/**
 * Queries on `Ingredient`s.
 */
export enum IngredientQueryType {
  FindByQuery = '@overckd.ingredient.query.find_by_query',
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
