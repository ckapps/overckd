import { event } from '@marblejs/core';
import { RecipeCollectionIdDto } from './recipe-collection.type';

/** Queries for `RecipeCollection`s. */
export enum RecipeCollectionQueryType {
  GetAll = '@overckd.recipe_collection.query.get_all',
  GetById = '@overckd.recipe_collection.query.get_by_id',
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
