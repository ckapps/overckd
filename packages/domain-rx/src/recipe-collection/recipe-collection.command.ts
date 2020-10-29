import { event } from '@marblejs/core';

import { RecipeCollectionDto } from './recipe-collection.type';

export enum RecipeCollectionCommandType {
  Create = 'CREATE_COLLECTION',
}

export const CreateRecipeCollectionCommand = event(
  RecipeCollectionCommandType.Create,
)(RecipeCollectionDto);
