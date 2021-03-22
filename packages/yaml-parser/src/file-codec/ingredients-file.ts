import * as t from 'io-ts';

import { Ingredient } from '@overckd/domain';

import { ingredient } from '../codec';
import { overckdFileCodec } from './overckd-file';

const filetype = 'ingredients';
const ingredientsFileContent = overckdFileCodec(
  filetype,
  '1.0.0',
  t.type({
    ingredients: t.record(t.string, ingredient),
  }),
);

type IngredientsFileContent = t.TypeOf<typeof ingredientsFileContent>;

function decodeIngredientsFile(i: IngredientsFileContent) {
  const { ingredients } = i;
  const map = new Map<string, Ingredient>();
  Object.entries(ingredients).forEach(([id, yamlIngredient]) => {
    map.set(id, {
      ...yamlIngredient,
      uri: id,
    });
  });

  return Array.from(map.values());
}

const dtoParser = new t.Type<
  Ingredient[],
  IngredientsFileContent,
  IngredientsFileContent
>(
  `${filetype}-content`,
  (a): a is Ingredient[] => Array.isArray(a),
  (i, c) => {
    try {
      return t.success(decodeIngredientsFile(i));
    } catch (e) {
      return t.failure(i, c);
    }
  },
  a => (a as unknown) as IngredientsFileContent,
);

/**
 * Codec for encoding/decoding recipe files
 */
export const ingredientsFile = ingredientsFileContent.pipe(dtoParser);
