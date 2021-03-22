import * as t from 'io-ts';

import { overckdUri } from '../shared/shared.codecs';

export const recipeIngredient = t.intersection([
  t.type({
    name: t.string,
  }),
  t.partial({
    uri: overckdUri,
    amount: t.union([t.number, t.string]),
    unit: t.string,
    scaleFactor: t.number,
    optional: t.boolean,
    alternatives: t.array(t.string),
  }),
]);

type RecipeIngredientC = typeof recipeIngredient;
export type RecipeIngredientDTO = t.TypeOf<RecipeIngredientC>;
