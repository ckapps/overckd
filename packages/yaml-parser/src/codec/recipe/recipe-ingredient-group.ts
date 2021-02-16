import * as t from 'io-ts';

import { recipeIngredient } from './recipe-ingredient';

export const recipeIngredientGroup = t.type({
  group: t.string,
  label: t.string,
  ingredients: t.array(recipeIngredient),
});

type RecipeIngredientGroupC = typeof recipeIngredientGroup;
export type RecipeIngredientGroupDTO = t.TypeOf<RecipeIngredientGroupC>;
