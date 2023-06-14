import { event } from '@marblejs/core';
import { RecipeCollectionDto } from './recipe-collection.type';

/** Commands for `RecipeCollection`s. */
export enum RecipeCollectionCommandType {
  Create = '@overckd.recipe_collection.command.create',
}

export const CreateRecipeCollectionCommand = event(
  RecipeCollectionCommandType.Create,
)(RecipeCollectionDto);
