import * as t from 'io-ts';

import {
  recipeIngredient,
  recipeIngredientGroup,
  recipeTimer,
  recipeTimerId,
} from '../domain.codec';
import { labeled } from './labeled.codec';
import { recipeBase } from './recipe-base.codec';

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
