import * as t from 'io-ts';

import { tag } from '../tag';
import { ingredientBase } from './ingredient-base.codec';

export const ingredient = t.intersection([
  ingredientBase,
  t.type({
    tags: t.array(tag),
  }),
]);

type IngredientC = typeof ingredient;
export type IngredientDTO = t.TypeOf<IngredientC>;
