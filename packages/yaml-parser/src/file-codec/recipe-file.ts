import * as t from 'io-ts';

import { Recipe } from '@overckd/domain';

import { recipe } from '../codec';
import { overckdFileCodec } from './overckd-file';

const filetype = 'recipe';
const recipeFileContent = overckdFileCodec(
  filetype,
  '1.0.0',
  t.type({
    recipe: recipe,
  }),
);

type RecipeFileContent = t.TypeOf<typeof recipeFileContent>;

const dtoParser = new t.Type<Recipe, RecipeFileContent, RecipeFileContent>(
  `${filetype}-content`,
  (a): a is Recipe => typeof a === 'object',
  (i, c) => {
    return 'recipe' in i
      ? t.success((i.recipe as unknown) as Recipe)
      : t.failure(i, c);
  },
  a => (a as unknown) as RecipeFileContent,
);

/**
 * Codec for encoding/decoding recipe files
 */
export const recipeFile = recipeFileContent.pipe(dtoParser);
