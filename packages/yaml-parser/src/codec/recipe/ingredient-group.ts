import * as t from 'io-ts';

import { ingredient } from './ingredient';

export const ingredientGroup = t.type({
  group: t.string,
  label: t.string,
  ingredients: t.array(ingredient),
});

export type IngredientGroupC = typeof ingredientGroup;
export type IngredientGroupDTO = t.TypeOf<IngredientGroupC>;
