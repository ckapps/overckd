import * as t from 'io-ts';

import { overckdUri } from '../overckd-uri';

export const recipeIngredient = t.intersection([
  t.type({
    name: t.string,
  }),
  t.partial({
    amount: t.union([t.number, t.string]),
    unit: t.string,
    scaleFactor: t.number,
    optional: t.boolean,
    alternatives: t.array(t.string),
    uri: overckdUri,
  }),
]);

type RecipeIngredientC = typeof recipeIngredient;
export type RecipeIngredientDTO = t.TypeOf<RecipeIngredientC>;
