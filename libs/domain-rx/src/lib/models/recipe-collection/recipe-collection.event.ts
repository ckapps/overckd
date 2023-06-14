import { event } from '@marblejs/core';
import { RecipeCollectionDto } from './recipe-collection.type';

/** Events for `RecipeCollection`s. */
export enum RecipeCollectionEventType {
  Created = '@overckd.recipe_collection.event.created',
}

export const RecipeCollectionCreatedEvent = event(
  RecipeCollectionEventType.Created,
)(RecipeCollectionDto);
