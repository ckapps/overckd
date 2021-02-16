import * as t from 'io-ts';

import { ingredient } from './ingredient';
import { ingredientGroup } from './ingredient-group';
import { labeled } from './labeled';
import { recipeBase } from './recipe-base';

const recipeStyle = t.partial({
  title: t.string,
  imagesContainer: t.string,
  secondaryImagesContainer: t.string,
  images: t.array(t.string),
});

export const recipe = t.intersection([
  recipeBase(t.union([ingredient, ingredientGroup])),
  t.type({
    images: t.array(t.string),
    styles: recipeStyle,
  }),
  t.partial({
    groups: t.array(labeled(recipeBase(ingredient))),
  }),
]);

export type RecipeC = typeof recipe;
export type RecipeDTO = t.TypeOf<RecipeC>;
