import {
  RecipeCollection,
  CollectionRecipe,
} from '@overckd/domain/dist/models/recipe-collection/recipe-collection.model';

import {
  CollectionRecipeDto,
  RecipeCollectionDto,
} from './recipe-collection.type';

/**
 * Creates the data from the DTO.
 *
 * @param dto DTO
 */
export function createCollectionRecipe(
  dto: CollectionRecipeDto,
): CollectionRecipe {
  const { id, name } = dto;
  return { id, name };
}

/**
 * Creates the data from the DTO.
 *
 * @param dto DTO
 */
export function createRecipeCollection(
  dto: RecipeCollectionDto,
): RecipeCollection {
  const { id, recipes, name, description } = dto;

  return {
    id,
    name,
    description,
    recipes: recipes.map(createCollectionRecipe),
  };
}
