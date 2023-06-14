import * as t from 'io-ts';

import { recipeIngredient } from '../recipe-ingredient/recipe-ingredient.codec';
import { recipeIngredientGroup } from '../recipe-ingredient-group/recipe-ingredient-group.codec';
import { recipeTimer, recipeTimerId } from '../recipe-timer/recipe-timer.codec';
import { labeled } from './labeled.codec';
import { recipeBase } from './recipe-base.codec';

const recipeStyle = t.partial({
  title: t.string,
  imagesContainer: t.string,
  secondaryImagesContainer: t.string,
  images: t.array(t.string),
});

export const recipe = t.intersection([
  recipeBase(
    t.union(
      [recipeIngredient, recipeIngredientGroup],
      'recipe-ingredient-union',
    ),
  ),
  t.type({
    images: t.array(t.string),
    styles: recipeStyle,
  }),
  t.partial({
    groups: t.array(labeled(recipeBase(recipeIngredient))),
    timers: t.record(recipeTimerId, recipeTimer),
  }),
]);

type RecipeC = typeof recipe;
export type RecipeDTO = t.TypeOf<RecipeC>;
