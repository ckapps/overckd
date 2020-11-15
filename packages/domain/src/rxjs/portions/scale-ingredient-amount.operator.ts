import { OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';

import { Ingredient } from '../../ingredient';
import { scaleIngredientAmount } from '../../portions';

/**
 * Operator that takes an ingredient and a scalar
 * and returns the ingredient with the new amount for
 * this ingredient.
 */
export function scaleIngredientAmount$(): OperatorFunction<
  [Ingredient, number],
  [Ingredient, Ingredient['amount']]
> {
  return map(([ingredient, scalar]) => [
    ingredient,
    scaleIngredientAmount(ingredient, scalar),
  ]);
}
