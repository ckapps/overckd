import * as t from 'io-ts';

import { RecipeCollection } from '@overckd/domain';

import { recipeCollection, recipeCollectionRecipe } from '../codec';
import { overckdFileCodec } from './overckd-file';

const filetype = 'recipe-collection';
const recipeCollectionFileContent = overckdFileCodec(
  filetype,
  '1.0.0',
  t.type({
    collections: t.array(recipeCollection),
    recipes: t.record(t.string, recipeCollectionRecipe),
  }),
);

type RecipeCollectionFileContent = t.TypeOf<typeof recipeCollectionFileContent>;

/**
 * Manual decoding for recipe collection files.
 *
 * @param i Decoded file content
 */
function decodeRecipeCollectionFile(i: RecipeCollectionFileContent) {
  const { recipes } = i;
  const map = new Map<string, RecipeCollection>();
  Object.entries(recipes).forEach(([id, yamlRecipe]) => {
    const collectionRecipe = {
      id: yamlRecipe.id || id,
      name: yamlRecipe.name,
    };

    yamlRecipe.collections.forEach(c => {
      const collectionFromMap = map.get(c.id);

      if (collectionFromMap) {
        collectionFromMap.recipes.push(collectionRecipe);
      } else {
        map.set(c.id, {
          id: c.id,
          name: c.name,
          description: c.description,
          recipes: [collectionRecipe],
        });
      }
    });
  });

  return Array.from(map.values());
}

const dtoParser = new t.Type<
  RecipeCollection[],
  RecipeCollectionFileContent,
  RecipeCollectionFileContent
>(
  `${filetype}-content`,
  (a): a is RecipeCollection[] => Array.isArray(a),
  (i, c) => {
    try {
      return t.success(decodeRecipeCollectionFile(i));
    } catch (e) {
      return t.failure(i, c);
    }
  },
  // TODO: Implement
  // a => (a as unknown) as RecipeCollectionFile,
  a => {
    throw new Error('Not implemented');
  },
);

/**
 * Codec for encoding/decoding recipe collection files
 */
export const recipeCollectionFile = recipeCollectionFileContent.pipe(dtoParser);
