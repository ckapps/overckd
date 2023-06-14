import { RecipeIngredient } from '../recipe-ingredient/recipe-ingredient.model';
import { RecipeIngredientGroup } from './recipe-ingredient-group.types';

/**
 * Checks if the passed `o` is an `RecipeIngredientGroup`.
 *
 * @param o
 */
export function isRecipeIngredientGroup(
  o: RecipeIngredient | RecipeIngredientGroup,
): o is RecipeIngredientGroup {
  const asAny = o as unknown as { ingredients?: [] };
  return Array.isArray(asAny['ingredients']);
}

/**
 * Checks if the passed `o` is an `RecipeIngredient`.
 *
 * @param o
 */
export function isRecipeIngredient(
  o: RecipeIngredient | RecipeIngredientGroup,
): o is RecipeIngredient {
  return !isRecipeIngredientGroup(o);
}
