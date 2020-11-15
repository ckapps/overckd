import { Ingredient } from './ingredient';
import { IngredientGroup } from './ingredient-group';

/**
 * Checks if the passed `o` is an `IngredientGroup`.
 *
 * @param o
 */
export function isIngredientGroup(
  o: Ingredient | IngredientGroup,
): o is IngredientGroup {
  const asAny = (o as unknown) as { ingredients?: [] };
  return Array.isArray(asAny['ingredients']);
}

/**
 * Checks if the passed `o` is an `Ingredient`.
 *
 * @param o
 */
export function isIngredient(o: Ingredient | IngredientGroup): o is Ingredient {
  return !isIngredientGroup(o);
}
