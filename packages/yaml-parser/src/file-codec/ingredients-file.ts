import * as t from 'io-ts';

import { Ingredient } from '@overckd/domain';

import { recipe } from '../codec';
import { overckdFileCodec } from './overckd-file';

const filetype = 'ingredients';
const ingredientsFileContent = overckdFileCodec(
  filetype,
  '1.0.0',
  t.type({
    recipe: recipe,
  }),
);

type IngredientsFileContent = t.TypeOf<typeof ingredientsFileContent>;

// TODO: Implement parser
const dtoParser = new t.Type<
  Ingredient,
  IngredientsFileContent,
  IngredientsFileContent
>(
  `${filetype}-content`,
  (a): a is Ingredient => typeof a === 'object',
  (i, c) => {
    return 'recipe' in i
      ? t.success((i.recipe as unknown) as Ingredient)
      : t.failure(i, c);
  },
  a => (a as unknown) as IngredientsFileContent,
);

/**
 * Codec for encoding/decoding recipe files
 */
export const ingredientsFile = ingredientsFileContent.pipe(dtoParser);
