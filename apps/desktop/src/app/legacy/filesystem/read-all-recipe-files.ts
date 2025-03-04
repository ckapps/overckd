import { readDir, readFile } from '@ckapp/rxjs-node-fs';
import { filterEndsWith } from '@ckapp/rxjs-snafu/lib/cjs/string/operators';
import { Recipe } from '@overckd/domain';
import { recipeFile, yamlDecode } from '@overckd/yaml';
import * as path from 'path';
import { from, map, mergeMap, Observable, toArray } from 'rxjs';

/**
 * @param dir
 * Path to the directory
 *
 * @returns
 * Observable that emits with the parsed recipes in the
 * given `dir`.
 */
export function readAllRecipeFiles(dir: string): Observable<Recipe[]> {
  return readDir(dir).pipe(
    mergeMap(paths => from(paths)),
    filterEndsWith('.recipe.yaml'),
    map(filename => path.resolve(dir, filename)),
    mergeMap(path => readFile(path, { encoding: 'utf-8' })),
    yamlDecode(recipeFile),
    toArray(),
  );
}
