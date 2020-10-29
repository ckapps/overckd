import { Recipe } from '@overckd/domain';

import { YamlRecipeFile } from './recipe.types';

/**
 * Parses the passed yaml `fileContent`.
 *
 * @param fileContent The loaded yaml file content
 */
export function parseRecipeFile(fileContent: YamlRecipeFile): Recipe {
  return fileContent.recipe;
}

export function toYamlFile(recipe: Recipe): YamlRecipeFile {
  return {
    overckd: '1.0.0',
    recipe,
  };
}
