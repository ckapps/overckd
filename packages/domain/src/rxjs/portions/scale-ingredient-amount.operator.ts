import { OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';

import { RecipeIngredient } from '../../recipe-ingredient';
import { scaleIngredientAmount } from '../../portions';

/**
 * Operator that takes an ingredient and a scalar
 * and returns the ingredient with the new amount for
 * this ingredient.
 */
export function scaleIngredientAmount$(): OperatorFunction<
  [RecipeIngredient, number],
  [RecipeIngredient, RecipeIngredient['amount']]
> {
  return map(([ingredient, scalar]) => [
    ingredient,
    scaleIngredientAmount(ingredient, scalar),
  ]);
}
