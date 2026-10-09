import {
  BasicRecipePreparation,
  RecipePreparation,
  UnionRecipePreparation,
} from '@overckd/domain';

/**
 * A part of a recipe to show: a group of a union recipe with its label, or
 * the recipe's own part without one.
 */
export interface RecipePart {
  readonly label: string | undefined;
  readonly recipe: BasicRecipePreparation;
}

/**
 * The parts of a recipe in the order to show them. A union's own part is the
 * one with the union's id.
 */
export const recipeParts = (
  recipe: RecipePreparation,
): ReadonlyArray<RecipePart> => {
  const parts = (
    part: BasicRecipePreparation | UnionRecipePreparation,
  ): ReadonlyArray<RecipePart> =>
    part._tag === 'BasicRecipePreparation'
      ? [{ label: part.id === recipe.id ? undefined : part.name, recipe: part }]
      : part.recipes.flatMap(parts);

  return parts(recipe);
};
