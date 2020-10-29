import { event } from '@marblejs/core';

import { RecipeCollectionDto } from './recipe-collection.type';

export enum RecipeCollectionEventType {
  Created = 'RECIPE_COLLECTION_CREATED',
}

export const RecipeCollectionCreatedEvent = event(
  RecipeCollectionEventType.Created,
)(RecipeCollectionDto);
