import * as t from 'io-ts';

export const ingredient = t.intersection([
  t.type({
    name: t.string,
  }),
  t.partial({
    amount: t.union([t.number, t.string]),
    unit: t.string,
    scaleFactor: t.number,
    optional: t.boolean,
    alternatives: t.array(t.string),
  }),
]);

export type IngredientC = typeof ingredient;
export type IngredientDTO = t.TypeOf<IngredientC>;
