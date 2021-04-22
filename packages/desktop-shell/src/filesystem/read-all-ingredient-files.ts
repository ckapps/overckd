import { readDir, readFile } from '@ckapp/rxjs-node-fs';
import { filterEndsWith } from '@ckapp/rxjs-snafu/lib/cjs/string/operators';
import { Ingredient } from '@overckd/domain';
import { yamlDecode } from '@overckd/yaml-parser';
import { ingredientsFile } from '@overckd/yaml-parser/dist/file-codec';
import * as path from 'path';
import { OperatorFunction, from, Observable } from 'rxjs';
import { reduce, mergeMap, map } from 'rxjs/operators';

function reduceIngredients(): OperatorFunction<Ingredient[], Ingredient[]> {
  return reduce((acc, cur) => [...acc, ...cur], [] as Ingredient[]);
}

/**
 * @param dir
 * Path to the directory
 *
 * @returns
 */
export function readAllIngredientFiles(dir: string): Observable<Ingredient[]> {
  return readDir(dir).pipe(
    mergeMap(paths => from(paths)),
    filterEndsWith('.ingredients.yaml'),
    map(filename => path.resolve(dir, filename)),
    mergeMap(path => readFile(path, { encoding: 'utf-8' })),
    yamlDecode(ingredientsFile),
    reduceIngredients(),
  );
}
