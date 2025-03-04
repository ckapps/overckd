import { readFile } from '@ckapp/rxjs-node-fs';
import { RecipeCollection } from '@overckd/domain';
import { recipeCollectionFile, yamlDecode } from '@overckd/yaml';
import { Observable } from 'rxjs';

/**
 * @param filename
 * Path to the file
 *
 * @returns
 * Observable that emits with the parsed
 * recipe collections.
 */
export function readRecipeCollectionFile(
  filename: string,
): Observable<RecipeCollection[]> {
  return readFile(filename, { encoding: 'utf8' }).pipe(
    yamlDecode(recipeCollectionFile, { filename }),
  );
}
