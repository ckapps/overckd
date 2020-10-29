import { event } from '@marblejs/core';

import { RecipeCollectionIdDto } from './recipe-collection.type';

/**
 *
 */
export enum RecipeCollectionQueryType {
  GetAll = 'RECIPE_COLLECTION_GET_ALL',
  GetById = 'RECIPE_COLLECTION_GET_BY_ID',
}

// ----------------------------------------------------------------------------
// Events
// ----------------------------------------------------------------------------
/**
 * Event for `getById`
 */
export const GetRecipeCollectionByIdEvent = event(
  RecipeCollectionQueryType.GetById,
)(RecipeCollectionIdDto);

/**
 * Event for `getAll`
 */
export const GetAllRecipeCollectionsEvent = event(
  RecipeCollectionQueryType.GetAll,
)();
