import * as t from 'io-ts';

import { recipeIngredient } from './recipe-ingredient';
import { recipeIngredientGroup } from './recipe-ingredient-group';
import { labeled } from './labeled';
import { recipeBase } from './recipe-base';
import { recipeTimer, recipeTimerId } from './recipe-timer';

const recipeStyle = t.partial({
  title: t.string,
  imagesContainer: t.string,
  secondaryImagesContainer: t.string,
  images: t.array(t.string),
});

export const recipe = t.intersection([
  recipeBase(t.union([recipeIngredient, recipeIngredientGroup])),
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
