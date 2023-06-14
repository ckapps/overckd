import * as t from 'io-ts';

import { overckdUri } from '../shared/overckd-uri';

export const ingredientBase = t.intersection([
  t.type({
    name: t.string,
  }),
  t.partial({
    uri: overckdUri,
  }),
]);

type IngredientBaseC = typeof ingredientBase;
export type IngredientBaseDTO = t.TypeOf<IngredientBaseC>;
