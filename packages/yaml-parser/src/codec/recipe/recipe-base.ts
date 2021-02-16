/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import * as t from 'io-ts';

import { portionQuantifier } from './portion-quantifier';

export function recipeBase<T extends t.Mixed>(ingredientCodec: T) {
  return t.intersection([
    t.type({
      name: t.string,
      steps: t.union([t.string, t.array(t.string)]),
      tips: t.array(t.string),
      ingredients: t.array(ingredientCodec),
    }),
    t.partial({
      stepsEnumerated: t.boolean,
      basedOn: t.array(t.string),
      portion: portionQuantifier,
    }),
  ]);
}
