import { RecipeIngredient } from '../recipe-ingredient';

/**
 * Scales the amount of a given `ingredient` by using
 * the specific `scalar`.
 *
 * @param ingredient The ingredient with the amount to scale
 * @param scalar The scalar by which to scale
 *
 * @returns
 * The new amount for the given ingredient
 */
export function scaleIngredientAmount(
  ingredient: RecipeIngredient,
  scalar: number,
): RecipeIngredient['amount'] {
  const { amount, scaleFactor = 1 } = ingredient;

  if (typeof amount !== 'number' || scalar === 1) {
    return amount;
  }

  // Factor in the ingredient specific scale factor
  return amount + amount * (scalar - 1) * scaleFactor;
}
