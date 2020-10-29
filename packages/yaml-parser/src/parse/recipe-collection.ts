import { CollectionRecipe, RecipeCollection } from '@overckd/domain';

import {
  YamlRecipeCollectionFile,
  YamlRecipe,
  YamlRecipeCollection,
} from './recipe-collection.types';

function parseCollection(collection: YamlRecipeCollection): RecipeCollection {
  const { id, name, description } = collection;

  return {
    id,
    name,
    description,
    recipes: [],
  };
}

function parseRecipe(r: YamlRecipe): CollectionRecipe {
  const { id, name } = r;

  return {
    id,
    name,
  };
}

/**
 * Parses the passed yaml `fileContent`.
 *
 * @param fileContent The loaded yaml file content
 */
export function parseRecipeCollectionFile(
  fileContent: YamlRecipeCollectionFile,
): RecipeCollection[] {
  const map = new Map<string, RecipeCollection>();

  Object.entries(fileContent.recipes).forEach(([id, yamlRecipe]) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const collectionRecipe = parseRecipe({ id, ...yamlRecipe });

    yamlRecipe.collections.forEach(c => {
      const collectionFromMap = map.get(c.id);

      if (collectionFromMap) {
        collectionFromMap.recipes.push(collectionRecipe);
      } else {
        const collection = parseCollection(c);
        collection.recipes.push(collectionRecipe);
        map.set(c.id, collection);
      }
    });
  });

  return Array.from(map.values());
}
