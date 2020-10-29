import { OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';

import { RecipeCollection } from '@overckd/domain';

import { parseRecipeCollectionFile } from '../../parse';
import { YamlRecipeCollectionFile } from '../../parse/recipe-collection.types';

export function parseRecipeCollection(): OperatorFunction<
  YamlRecipeCollectionFile,
  RecipeCollection[]
> {
  return map(parseRecipeCollectionFile);
}
